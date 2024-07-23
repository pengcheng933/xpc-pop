import crypto from "crypto-js";
import { fetchFileData, contentType, get_file_extension } from "./utils";
import { uploadOssSTS, sliceArrItem, resolveValue } from "./type/oss";

const VITE_OSS_DIR = "";
class SlicingContinuing implements SlicingContinuing {
  uploadOssSTS: uploadOssSTS; // STS信息
  individualFileSize = 256;
  uploadId = "";
  arrayBufferRes: ArrayBuffer; // 上传文件二进制流
  retries = 3; // 重试次数
  status = 0; // 0 未开始 1 已经获取ID了 2 已经成功上传所有分片了 3 已经合并分片了
  sliceArr: Array<sliceArrItem> = []; // 分片数组
  slicesUploaded: Array<sliceArrItem> = []; // 已上传分片
  uploadFailedArr: Array<sliceArrItem> = []; // 上传失败的分片
  bucketName: string;
  localDomainName: string;
  domainName: string;
  storageDirectory: string;
  requestUrl: string;
  resolve: (value: resolveValue) => void;
  upLoadSTS: Function;
  contentType: string;
  upload: Function;
  fileExtension: string; // 后缀名
  resourceAddress: string | ArrayBuffer;
  constructor({
    bucketName,
    localDomainName,
    individualFileSize,
    storageDirectory,
    upLoadSTS,
  }: {
    bucketName: string;
    localDomainName: string;
    individualFileSize?: number;
    storageDirectory: string;
    upLoadSTS: () => void;
  }) {
    if (individualFileSize && individualFileSize < 100) {
      throw "分片最小为100KB";
    }
    this.bucketName = bucketName;
    this.localDomainName = localDomainName;
    this.domainName = `https://${this.bucketName}.${this.localDomainName}/`;
    this.storageDirectory = storageDirectory;
    this.uploadOssSTS = uni.getStorageSync("uploadOssSTS") || {};
    this.upLoadSTS = upLoadSTS;
  }
  init(): void {
    this.resourceAddress = "";
    this.requestUrl = `${this.domainName + VITE_OSS_DIR}/${crypto.SHA256(
      "" + new Date().getTime() + Math.floor(Math.random() * 1000000)
    )}${this.fileExtension}`;
    this.status = 0;
    this.retries = 3;
    this.sliceArr = [];
    this.slicesUploaded = [];
    this.uploadFailedArr = [];
  }
  start(
    resourceAddress: string | ArrayBuffer,
    fileExtension: string | undefined
  ): Promise<resolveValue> {
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.retries = 3;
      console.log(this.status);
      this.resourceAddress = resourceAddress;
      this.uploadOssSTS = uni.getStorageSync("uploadOssSTS") || {};
      if (fileExtension) {
        this.fileExtension = fileExtension;
      } else {
        this.fileExtension = get_file_extension(resourceAddress as string);
      }
      this.stepJudgment();
    });
  }
  stepJudgment() {
    // 如果status不为0那么就是重试操作
    if (this.status === 1) {
      const retryUploadingArr = this.sliceArr.filter(
        (item1) =>
          !this.slicesUploaded.some((item2) => item2.index === item1.index)
      );
      retryUploadingArr.forEach((item) => {
        this.readingFiles(item);
      });
    } else if (this.status === 2) {
      this.completeMultipartUpload();
    } else {
      this.contentType = contentType[this.fileExtension];
      this.requestUrl = `${
        this.domainName + this.storageDirectory
      }/${crypto.SHA256(
        "" + new Date().getTime() + Math.floor(Math.random() * 1000000)
      )}${this.fileExtension}`;
      this.detectionSize();
    }
  }
  async checkExpirationTime(timeLag = 0) {
    // 检查签名是否过期了
    const now = new Date();
    now.setMinutes(now.getMinutes() + timeLag);
    if (new Date(this.uploadOssSTS.expiration) > now) {
      return { code: 0 };
    } else {
      //更新签名
      const sts = await this.upLoadSTS(this.retries);
      if (sts !== "error") {
        uni.setStorageSync("uploadOssSTS", sts);
        this.uploadOssSTS = sts;
        return {
          code: 0,
        };
      } else {
        return {
          code: -1,
        };
      }
    }
  }
  // 生成签名
  getSignature(
    verb: string,
    resource: string,
    date: string,
    contentType: string
  ) {
    const content = `${verb}\n\n${contentType}\n${date}\n${resource}`;
    const signature = crypto
      .HmacSHA1(content, this.uploadOssSTS.access_key_secret)
      .toString(crypto.enc.Base64);
    return "OSS " + this.uploadOssSTS.access_key_id + ":" + signature;
  }
  async uploadIfBelowMinThreshold() {
    const checkResult = await this.checkExpirationTime();
    if (checkResult.code !== 0) {
      this.uniformErrorHandling({
        type: "checkExpirationTime",
      });
      return;
    }
    const url = this.requestUrl;
    const date = new Date().toUTCString();
    const signature = this.getSignature(
      "PUT",
      `${
        this.uploadOssSTS.security_token
          ? `x-oss-security-token:${this.uploadOssSTS.security_token}`
          : ""
      }\n/${this.bucketName}/${url.replace(this.domainName, "")}`,
      date,
      this.contentType
    );
    try {
      const uploadResult = await uni.request({
        url,
        header: {
          "Content-Type": this.contentType,
          authorization: signature,
          Date: date,
          "x-oss-security-token": this.uploadOssSTS.security_token,
        },
        data: this.arrayBufferRes,
        method: "PUT",
      });
      if (uploadResult.statusCode === 200) {
        this.status = 3;
        this.resolve({
          url: this.requestUrl,
        });
      } else {
        this.uniformErrorHandling({
          type: "uploadIfBelowMinThreshold",
        });
      }
    } catch (error) {
      this.uniformErrorHandling({
        type: "uploadIfBelowMinThreshold",
      });
    }
  }
  // 检测大小是否达到最小分片了
  async detectionSize() {
    try {
      if (typeof this.resourceAddress === "string") {
        this.arrayBufferRes = await fetchFileData(this.resourceAddress);
      } else {
        this.arrayBufferRes = this.resourceAddress;
      }
      // 如果大小小于最小分片就直接上传
      if (this.arrayBufferRes.byteLength <= this.individualFileSize * 1024) {
        // 小于最小设置值直接上传
        this.uploadIfBelowMinThreshold();
      } else {
        this.getUploadId();
      }
    } catch (e) {
      this.uniformErrorHandling({
        type: "detectionSize",
      });
    }
  }
  // 获取这次分片上传ID
  async getUploadId() {
    const url = `${this.requestUrl}?uploads`;
    const date = new Date().toUTCString();
    const checkResult = await this.checkExpirationTime();
    if (checkResult.code !== 0) {
      this.uniformErrorHandling({
        type: "checkExpirationTime",
      });
      return;
    }
    const signature = this.getSignature(
      "POST",
      `${
        this.uploadOssSTS.security_token
          ? `x-oss-security-token:${this.uploadOssSTS.security_token}`
          : ""
      }\n/${this.bucketName}/${url.replace(this.domainName, "")}`,
      date,
      this.contentType
    );

    try {
      const res = await uni.request({
        url,
        header: {
          "Content-Type": this.contentType,
          authorization: signature,
          Date: date,
          "x-oss-security-token": this.uploadOssSTS.security_token,
        },
        method: "POST",
      });
      if (res.statusCode === 200) {
        this.uploadId = this.getXMLValue(res.data);
        this.status = 1;
        this.retries = 3;
        this.readingFilesAndSlicing();
      } else {
        this.uniformErrorHandling({
          type: "getUploadId",
        });
      }
    } catch (e) {
      this.uniformErrorHandling({
        type: "getUploadId",
      });
    }
  }
  // 上传并分片
  async readingFilesAndSlicing() {
    this.cuttingFiles(this.arrayBufferRes);
    // 这儿会开始大量上传，希望过期时间长一点，不要传到一半失败了，暂定为离过期1分钟
    const checkResult = await this.checkExpirationTime(1);
    if (checkResult.code !== 0) {
      this.uniformErrorHandling({
        type: "checkExpirationTime",
      });
      return;
    }
    this.sliceArr.forEach((item) => {
      this.readingFiles(item);
    });
  }
  async readingFiles(item) {
    const url = `${this.requestUrl}?partNumber=${item.index}&uploadId=${this.uploadId}`;
    const date = new Date().toUTCString();
    const signature = this.getSignature(
      "PUT",
      `${
        this.uploadOssSTS.security_token
          ? `x-oss-security-token:${this.uploadOssSTS.security_token}`
          : ""
      }\n/${this.bucketName}/${url.replace(this.domainName, "")}`,
      date,
      this.contentType
    );
    try {
      const res = await uni.request({
        url,
        header: {
          "Content-Type": this.contentType,
          authorization: signature,
          Date: date,
          "x-oss-security-token": this.uploadOssSTS.security_token,
        },
        data: item.sliceFile,
        method: "PUT",
      });
      if (res.statusCode === 200) {
        this.slicesUploaded.push({
          index: item.index,
          ETag: res.header.ETag || res.header.Etag, // 安卓是ETag iOS是Etag 那个有用那个
        });
        this.estimationSlicesUploadedSuccess();
      } else {
        this.uniformErrorHandling({
          type: "readingFiles",
          item,
        });
      }
    } catch (e) {
      this.uniformErrorHandling({
        type: "readingFiles",
        item,
      });
    }
  }
  async completeMultipartUpload() {
    const url = `${this.requestUrl}?uploadId=${this.uploadId}`;
    const date = new Date().toUTCString();
    const checkResult = await this.checkExpirationTime();
    if (checkResult.code !== 0) {
      this.uniformErrorHandling({
        type: "checkExpirationTime",
      });
      return;
    }
    const signature = this.getSignature(
      "POST",
      `${
        this.uploadOssSTS.security_token
          ? `x-oss-security-token:${this.uploadOssSTS.security_token}`
          : ""
      }\n/${this.bucketName}/${url.replace(this.domainName, "")}`,
      date,
      this.contentType
    );
    // 按照index升序排列
    const data = this.generateXML(
      this.slicesUploaded.sort((a, b) => a.index - b.index)
    );
    console.log(data);
    try {
      const res = await uni.request({
        url,
        header: {
          "Content-Type": this.contentType,
          authorization: signature,
          Date: date,
          "x-oss-security-token": this.uploadOssSTS.security_token,
        },
        data,
        method: "POST",
      });
      if (res.statusCode === 200) {
        this.status = 3;
        this.resolve({
          url: this.requestUrl,
        });
      } else {
        this.uniformErrorHandling({
          type: "completeMultipartUpload",
        });
      }
    } catch (e) {
      this.uniformErrorHandling({
        type: "completeMultipartUpload",
      });
    }
  }
  // 统一错误处理
  uniformErrorHandling({ type, item }: { type: string; item?: sliceArrItem }) {
    const typeObj = {
      uploadIfBelowMinThreshold: () => {
        if (this.retries) {
          this.retries--;
          this.uploadIfBelowMinThreshold();
        } else {
          this.resolve({
            url: "",
          });
        }
      },
      getUploadId: () => {
        if (this.retries) {
          this.retries--;
          this.getUploadId();
        } else {
          this.resolve({
            url: "",
          });
        }
      },
      readingFiles: (item) => {
        if (item.retries) {
          item.retries--;
          this.readingFiles(item);
        } else {
          item.retries = 3;
          this.uploadFailedArr.push(item);
          this.estimationSlicesUploadedSuccess();
        }
      },
      completeMultipartUpload: () => {
        if (this.retries) {
          this.retries--;
          this.completeMultipartUpload();
        } else {
          this.resolve({
            url: "",
          });
        }
      },
      detectionSize: () => {
        this.resolve({
          url: "",
        });
      },
      checkExpirationTime: () => {
        this.resolve({
          url: "",
        });
      },
    };
    if (typeObj[type]) typeObj[type](item);
  }
  // 分片是否成功判断
  estimationSlicesUploadedSuccess() {
    if (
      this.slicesUploaded.length + this.uploadFailedArr.length ===
      this.sliceArr.length
    ) {
      if (this.slicesUploaded.length === this.sliceArr.length) {
        this.status = 2;
        // 上传成功等于总数 合并
        this.completeMultipartUpload();
      } else {
        //  清空失败的为重试做准备
        this.uploadFailedArr = [];
        this.resolve({
          url: "",
        });
      }
    }
  }
  //  切割文件
  cuttingFiles(arrayBufferRes: ArrayBuffer) {
    const totalFileSize = arrayBufferRes.byteLength;
    const sliceNum = Math.ceil(totalFileSize / 1024 / this.individualFileSize);
    for (let i = 0; i < sliceNum; i++) {
      const start = i * this.individualFileSize * 1024;
      const end =
        start + this.individualFileSize * 1024 > totalFileSize
          ? totalFileSize
          : start + this.individualFileSize * 1024;
      const sliceFile = arrayBufferRes.slice(start, end);
      this.sliceArr.push({
        index: i + 1,
        sliceFile,
        retries: this.retries, // 重试次数，重试为0，那么就判断为失败
      });
    }
  }
  // 获取xml中的值
  getXMLValue(str: string): string {
    const reg = /<UploadId>(([\s\S])*?)<\/UploadId>/;
    let res = str.match(reg);
    if (res) {
      return res[1];
    }
    return "";
  }
  // 拼接XML
  generateXML(parts) {
    const xml = parts.reduce((acc, part) => {
      const partXML = `
      <Part>
          <PartNumber>${part.index}</PartNumber>
          <ETag>${part.ETag}</ETag>
      </Part>`;
      return acc + partXML;
    }, "<CompleteMultipartUpload>");
    return xml + "\n</CompleteMultipartUpload>";
  }
}

export default SlicingContinuing;
