export type uploadOssSTS = {
  expiration: string;
  access_key_secret: string;
  access_key_id: string;
  security_token: string;
};
export type sliceArrItem = {
  index: number;
  sliceFile: ArrayBuffer;
  retries: number;
};
type slicesUploaded = {
  index: number;
  ETag: string;
};

export type resolveValue = {
  url: string;
};

interface ISlicingContinuing {
  uploadOssSTS: uploadOssSTS;
  individualFileSize: number;
  localTemporaryPath: string;
  uploadId: string;
  arrayBufferRes: ArrayBuffer | null;
  retries: number;
  status: number;
  sliceArr: Array<sliceArrItem>;
  slicesUploaded: Array<sliceArrItem>;
  uploadFailedArr: Array<sliceArrItem>;
  bucketName: string;
  domainName: string;
  localDomainName: string;
  storageDirectory: string;
  requestUrl: string;
  resolve: resolveValue;
  upLoadSTS: Function;
  upload: Function;
  init(): void;
  start(tempFilePath: string): Promise<resolveValue>;
  uniformErrorHandling({
    type,
    item,
  }: {
    type: string;
    item?: sliceArrItem;
  }): void;
}
