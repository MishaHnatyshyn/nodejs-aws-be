import { SNS, AWSError } from 'aws-sdk';
import {PublishInput} from 'aws-sdk/clients/sns';
import {PromiseResult} from 'aws-sdk/lib/request';

export enum NotificationStatus {
  SUCCESS = 'OK',
  ERROR = 'ERROR'
}

export class NotificationService {
  private DEFAULT_REGION: string = 'us-east-1'
  private sns: SNS;
  constructor(private topicARN: string, region: string = '') {
    this.sns = new SNS({ region: region || this.DEFAULT_REGION })
  }

  notify(subject: string, message: string, status: NotificationStatus = NotificationStatus.SUCCESS): Promise<PromiseResult<SNS.Types.PublishResponse, AWSError>> {
    const payload = this.formatNotificationMessage(subject, message, status)
    return this.sns.publish(payload).promise()
  }

  private formatNotificationMessage(subject: string, message: string, status: NotificationStatus): PublishInput {
    return {
      Message: message,
      Subject: subject,
      MessageStructure: 'string',
      TopicArn: this.topicARN,
      MessageAttributes: {
        status: {
          DataType: "String",
          StringValue: status,
        },
      },
    }
  }
}
