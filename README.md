### 前文

由于项目需求变更，此前使用`ali-oss`库直传文件到阿里云 OSS 中心的方式不再支持，为了方便各专业尽量少改动代码，此包应运而生。

### 安装

```javascript
npm install @bj-nsc/upload --save
```

### 使用方式

```javascript
import OSS from "@bj-nsc/upload";

const client = new OSS();

// 所有这些配置都是可选的
const config = {
  serviceName: "eic-team-review", //服务名
  busiName: "users", // 业务名
  apiPrefix: "", // api前缀, 默认是/api，如果不需要加任何前缀请传空字符串
  url: "", // 文件上传接口地址, 当设置此属性时apiPrefix失效
  headers: {
    Authorization: "",
  },
  timeout: 1000, // 上传超时设置
  progress: function (value) {}, // 上传进度回调
};

client
  .multipartUpload("file", file, config)
  .then((res) => {
    // 上传成功
    const { name, bucket, etag, requestUrl } = res;
  })
  .catch((error) => {
    // 上传失败
  });
```
