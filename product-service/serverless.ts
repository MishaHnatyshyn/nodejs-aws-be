import type { Serverless } from 'serverless/aws';

const CATALOG_ITEMS_QUEUE = 'catalogItemsQueue';
const CREATE_PRODUCT_TOPIC = 'createProductTopic';
const CREATE_PRODUCT_SUBSCRIPTION = 'createProductSubscription';
const CREATE_PRODUCT_SUBSCRIPTION_ERRORS = 'createProductSubscriptionErrors';
const CREATE_PRODUCT_SUB_ERRORS_EMAIL = '7585955@ukr.net';
const CREATE_PRODUCT_SUB_EMAIL = '7585955@ukr.net';
const SQS_NAME = 'catalogItemsQueueRssNodeAws';
const SNS_TOPIC_NAME = 'createProductTopicRssNodeAws'

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SNS_ARN: {
        Ref: CREATE_PRODUCT_TOPIC
      }
    },
    iamRoleStatements: [{
      Effect: 'Allow',
      Action: 'sqs:*',
      Resource: {
        'Fn::GetAtt': [CATALOG_ITEMS_QUEUE, 'Arn']
      }
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: {
          Ref: CREATE_PRODUCT_TOPIC
        }
      }
    ]
  },
  resources: {
    Resources: {
      [CATALOG_ITEMS_QUEUE]: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: SQS_NAME
        }
      },
      [CREATE_PRODUCT_TOPIC]: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: SNS_TOPIC_NAME
        }
      },
      [CREATE_PRODUCT_SUBSCRIPTION]: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: CREATE_PRODUCT_SUB_EMAIL,
          Protocol: 'email',
          TopicArn: {
            Ref: CREATE_PRODUCT_TOPIC
          },
          FilterPolicy: {
            status: ["OK"],
          },
        }
      },
      [CREATE_PRODUCT_SUBSCRIPTION_ERRORS]: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: CREATE_PRODUCT_SUB_ERRORS_EMAIL,
          Protocol: 'email',
          TopicArn: {
            Ref: CREATE_PRODUCT_TOPIC
          },
          FilterPolicy: {
            status: ["ERROR"],
          },
        }
      }
    }
  },
  functions: {
    getProduct: {
      handler: 'index.getProductsById',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{productId}',
            cors: true,
            request: {
              parameters: {
                paths: {
                  productId: true
                }
              }
            }
          }
        }
      ]
    },
    getProductsList: {
      handler: 'index.getProductsList',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true
          }
        }
      ]
    },
    createProduct: {
      handler: 'index.createProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'products',
            cors: true
          }
        }
      ]
    },
    catalogBatchProcess: {
      handler: 'index.catalogBatchProcess',
      events: [
        {
          sqs: {
            batchSize: 5,
            arn: {
              'Fn::GetAtt': [CATALOG_ITEMS_QUEUE, 'Arn']
            }
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
