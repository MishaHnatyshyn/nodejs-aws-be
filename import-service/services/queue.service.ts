import {SQS, AWSError} from 'aws-sdk';
import {PromiseResult} from 'aws-sdk/lib/request';

export class QueueService {
  private DEFAULT_REGION: string = 'us-east-1'
  private sqs: SQS;

  constructor(region: string = '') {
    this.sqs = new SQS({ region: region || this.DEFAULT_REGION})
  }

  async sendMessage(queueUrl: string, message: string): Promise<PromiseResult<SQS.Types.SendMessageResult, AWSError>> {
    return this.sqs.sendMessage({ QueueUrl: queueUrl, MessageBody: message }).promise()
  }
}
