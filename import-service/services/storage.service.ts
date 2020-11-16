import { S3, AWSError } from 'aws-sdk';
import {Readable} from 'stream';
import {PromiseResult} from 'aws-sdk/lib/request';

export default class StorageService {
  private DEFAULT_REGION: string = 'us-east-1'
  private s3: S3;
  constructor(
    region: string = ''
  ) {
    this.s3 = new S3({ region: region || this.DEFAULT_REGION })
  }

  public getSignedUrl(bucketName: string, key: string, contentType: string): Promise<string> {
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: 60,
      ContentType: contentType,
    }

    return this.s3.getSignedUrlPromise('putObject', params)
  }

  public get(bucketName: string, key: string): Readable {
    return this.s3.getObject({
      Bucket: bucketName,
      Key: key
    }).createReadStream();
  }

  public delete(bucketName: string, key: string):  Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>> {
    return this.s3.deleteObject({
      Bucket: bucketName,
      Key: key
    }).promise()
  }

  public copy(bucketName: string, sourceKey: string, destinationKey: string): Promise<PromiseResult<S3.CopyObjectOutput, AWSError>> {
    return this.s3.copyObject({
      Bucket: bucketName,
      CopySource: `${bucketName}/${sourceKey}`,
      Key: destinationKey
    }).promise()
  }
}
