import {S3Handler} from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as csv from 'csv-parser';

const importFileParser: S3Handler = async (event) => {
  const bucket = process.env.PRODUCTS_BUCKET_NAME;
  const records = event.Records;
  const s3 = new AWS.S3({ region: 'us-east-1' })

  await Promise.all(records.map(async (record) => {
    const s3Stream = s3.getObject({
      Bucket: bucket,
      Key: record.s3.object.key
    }).createReadStream();

    await new Promise((resolve, reject) => {
      s3Stream
        .pipe(csv())
        .on('data', (data) => {
          console.log(data);
        })
        .on('error', (error) => reject(error))
        .on('end', async () => {
          console.log(`Move file ${bucket}/${record.s3.object.key} from uploaded folder`);

          await s3.copyObject({
            Bucket: bucket,
            CopySource: `${bucket}/${record.s3.object.key}`,
            Key: record.s3.object.key.replace('uploaded', 'parsed')
          }).promise()

          console.log(`Remove ${bucket}/${record.s3.object.key} from uploaded folder`)

          await s3.deleteObject({
            Bucket: bucket,
            Key: record.s3.object.key
          }).promise()

          resolve()
        })
    })
  }))
}

export default importFileParser;
