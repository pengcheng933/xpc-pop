# xpc-oss

格式 https://ielts-cdn.oss-cn-beijing.aliyuncs.com/

- 建议使用 STS 授权访问
  https://help.aliyun.com/zh/oss/developer-reference/use-temporary-access-credentials-provided-by-sts-to-access-oss?spm=a2c4g.11186623.0.i2

- 查看 key
  https://ram.console.aliyun.com/manage/ak?spm=a2c4g.11186623.0.0.68f44a1cG9GGhE
- 调用实例

```javascript
<script setup>
import XpcOss from "../../uni_modules/xpc-oss/js_sdk/oss";

// 获取 STS临时上传凭证
const getSTS = async () => {
  const getOSS = await uni.request({
    url: "http://192.168.1.6:3000/getSTS",
  });
  const ossDate = {
    expiration: getOSS.data.Expiration,
    access_key_secret: getOSS.data.AccessKeySecret,
    access_key_id: getOSS.data.AccessKeyId,
    security_token: getOSS.data.SecurityToken,
  };
  return ossDate;
};

const ossUpload = async () => {
  const xpcOss = new XpcOss({
    bucketName: "pengcheng933",
    localDomainName: "oss-cn-chengdu.aliyuncs.com",
    individualFileSize: 256,
    storageDirectory: "test",
    upLoadSTS: getSTS,
  });
  const imagePath = await uni.chooseImage({
    count: 1, //默认9
    sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
    sourceType: ["album"], //从相册选择
  });
  const startResult = await xpcOss.start(imagePath.tempFilePaths[0]);
  // 返回格式{url: 'XX'},入股url有那么就是上传成功，否则就是失败
  console.log(startResult);
};
</script>
```

- 备注，初始化完后再次调用，可以先 init 初始化实例，再调用 start

```javascript
<script setup>
import XpcOss from "../../uni_modules/xpc-oss/js_sdk/oss";

// 获取 STS临时上传凭证
const getSTS = async () => {
  const getOSS = await uni.request({
    url: "http://192.168.1.6:3000/getSTS",
  });
  const ossDate = {
    expiration: getOSS.data.Expiration,
    access_key_secret: getOSS.data.AccessKeySecret,
    access_key_id: getOSS.data.AccessKeyId,
    security_token: getOSS.data.SecurityToken,
  };
  return ossDate;
};

const ossUpload = async () => {
  const xpcOss = new XpcOss({
    bucketName: "pengcheng933",
    localDomainName: "oss-cn-chengdu.aliyuncs.com",
    individualFileSize: 256,
    storageDirectory: "test",
    upLoadSTS: getSTS,
  });
  const imagePath = await uni.chooseImage({
    count: 1, //默认9
    sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
    sourceType: ["album"], //从相册选择
  });
  const startResult = await xpcOss.start(imagePath.tempFilePaths[0]);
  // 返回格式{url: 'XX'},入股url有那么就是上传成功，否则就是失败
  console.log(startResult);
  const imagePath2 = await uni.chooseImage({
    count: 1, //默认9
    sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
    sourceType: ["album"], //从相册选择
  });
  xpcOss.init()
  const startResult2 = await xpcOss.start(imagePath2.tempFilePaths[0]);
  // 返回格式{url: 'XX'},入股url有那么就是上传成功，否则就是失败
  console.log(startResult2);
};
</script>
```

- 我发现有些 IOS 路径，uniapp 无法读取里面的二进制信息，如果遇到了，可以用原生去读取二进制数据然后传给插件，也能传到阿里云去

```javascript
<script setup>
import XpcOss from "../../uni_modules/xpc-oss/js_sdk/oss";

// 获取 STS临时上传凭证
const getSTS = async () => {
  const getOSS = await uni.request({
    url: "http://192.168.1.6:3000/getSTS",
  });
  const ossDate = {
    expiration: getOSS.data.Expiration,
    access_key_secret: getOSS.data.AccessKeySecret,
    access_key_id: getOSS.data.AccessKeyId,
    security_token: getOSS.data.SecurityToken,
  };
  return ossDate;
};

const ossUpload = async () => {
  const xpcOss = new XpcOss({
    bucketName: "pengcheng933",
    localDomainName: "oss-cn-chengdu.aliyuncs.com",
    individualFileSize: 256,
    storageDirectory: "test",
    upLoadSTS: getSTS,
  });
  // 自行通过getArratBuffer获取二进制数据
  const arrayBuffer = getArratBuffer()
  const startResult = await xpcOss.start(arrayBuffer);
  // 返回格式{url: 'XX'},入股url有那么就是上传成功，否则就是失败
  console.log(startResult);
  const imagePath2 = await uni.chooseImage({
    count: 1, //默认9
    sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
    sourceType: ["album"], //从相册选择
  });
  xpcOss.init()
  const startResult2 = await xpcOss.start(imagePath2.tempFilePaths[0]);
  // 返回格式{url: 'XX'},入股url有那么就是上传成功，否则就是失败
  console.log(startResult2);
};
</script>
```
