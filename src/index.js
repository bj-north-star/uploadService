import axios from "axios";
import queryString from "query-string";

const xhr = axios.create();
export default class UploadService {
  constructor(config = {}) {
    this.globalConfig = config;
  }

  multipartUpload(key, file, params = {}) {
    return new Promise((resolve, reject) => {
      if (!(file instanceof Blob)) {
        return reject(Error("参数不是一个文件!"));
      }

      const fileReader = new FileReader();
      const _this = this;
      fileReader.onload = function () {
        const blob = new Blob([this.result], { type: file.type });
        const formData = new FormData();
        formData.append("file", blob, file.name);

        let url = params.url || "/files/file/upload";
        const { serviceName, busiName } = params;
        const otherParams = {};

        if (serviceName) {
          otherParams.serviceName = serviceName;
        }

        if (busiName) {
          otherParams.busiName = busiName;
        }

        const queryStr = queryString.stringify(otherParams);
        url = queryStr ? url + "?" + queryStr : url;
        const customHeaders = params.headers || {};
        const timeout = params.timeout || _this.globalConfig.timeout || 0;
        const axiosConfig = {
          headers: {
            "Content-Type": "multipart/form-data",
            ...customHeaders,
          },
          timeout,
          onUploadProgress: function (progressEvent) {
            const totalLength = progressEvent.lengthComputable
              ? progressEvent.total
              : progressEvent.target.getResponseHeader("content-length") ||
                progressEvent.target.getResponseHeader(
                  "x-decompressed-content-length"
                );
            const p = Math.round((progressEvent.loaded * 100) / totalLength);

            if (totalLength !== null && typeof params.progress === "function") {
              params.progress(p);
            }
          },
        };

        xhr
          .post(url, formData, axiosConfig)
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      };

      fileReader.readAsArrayBuffer(file);
    });
  }
}
