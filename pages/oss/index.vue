<template>
  <div>
    <div @tap="ossUpload">oss 上传</div>
  </div>
</template>

<script setup>
import XpcOss from "../../uni_modules/xpc-oss/js_sdk/oss";

// 获取 STS临时上传凭证
const getSTS = async () => {
  const getOSS = await uni.request({
    url: "http://192.168.1.13:3000/getSTS",
  });
  console.log(getOSS);
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
  try {
    const startResult = await xpcOss.start(imagePath.tempFilePaths[0]);
    // 返回格式{url: 'XX'},入股url有那么就是上传成功，否则就是失败
    console.log(startResult);
  } catch (error) {
    console.log(error);
  }
};
</script>

<style lang="scss" scoped></style>
