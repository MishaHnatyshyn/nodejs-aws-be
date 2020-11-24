import {S3Handler} from 'aws-lambda';
import {getImportService} from '../services/utils';
import {QueueService} from '../services/queue.service';

const importFileParser: S3Handler = async (event) => {
  const records = event.Records;
  try {
    const importService = getImportService();
    const queueService = new QueueService();
    const resourcesKeys = records.map((record) => record.s3.object.key);
    const products = await importService.parseNewFiles(resourcesKeys)
    await Promise.all(products.map((product) => queueService.sendMessage(process.env.SQS_URL, JSON.stringify(product))))
  } catch (e) {
    console.log('Error happened in importFileParser', e)
  }
}

export default importFileParser;
