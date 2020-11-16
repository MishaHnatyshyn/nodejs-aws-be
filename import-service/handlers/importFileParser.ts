import {S3Handler} from 'aws-lambda';
import {getImportService} from '../services/utils';

const importFileParser: S3Handler = async (event) => {
  const records = event.Records;
  try {
    const importService = getImportService();
    const resourcesKeys = records.map((record) => record.s3.object.key);
    await importService.parseNewFiles(resourcesKeys)
  } catch (e) {
    console.log('Error happened in importFileParser', e)
  }
}

export default importFileParser;
