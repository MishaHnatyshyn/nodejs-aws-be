import StorageService from './storage.service';
import * as csv from 'csv-parser';
import {Readable} from 'stream';

export default class ImportService {
  private UPLOADED_FOLDER_PREFIX = 'uploaded/'
  private BUCKET_NAME = process.env.PRODUCTS_BUCKET_NAME
  constructor(
    private storageService: StorageService
  ) {}

  public getSignedUrlForProductsUpload(filename: string): Promise<string> {
    return this.storageService.getSignedUrl(this.BUCKET_NAME, `${this.UPLOADED_FOLDER_PREFIX}${filename}`, 'text/csv')
  }

  private parseCsvFile(stream: Readable, key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (data) => {
          console.log(data);
        })
        .on('error', (error) => reject(error))
        .on('end', async () => {
          console.log(`Move file ${this.BUCKET_NAME}/${key} from uploaded folder`);

          await this.storageService.copy(this.BUCKET_NAME, key, key.replace('uploaded', 'parsed'))

          console.log(`Remove ${this.BUCKET_NAME}/${key} from uploaded folder`)

          await this.storageService.delete(this.BUCKET_NAME, key);

          resolve()
        })
    })

  }

  public parseNewFiles(keys: string[]): Promise<void[]> {
    return Promise.all(keys.map(async (key) => {
      const s3Stream = this.storageService.get(this.BUCKET_NAME, key);
      return this.parseCsvFile(s3Stream, key);
    }))
  }
}
