import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
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
      PRODUCTS_BUCKET_NAME: 'nodejs-aws-import-service-bucket',
      SQS_URL: 'https://sqs.us-east-1.amazonaws.com/866013640144/catalogItemsQueueRssNodeAws',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: 'arn:aws:s3:::nodejs-aws-import-service-bucket'
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: 'arn:aws:s3:::nodejs-aws-import-service-bucket/*'
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: 'arn:aws:sqs:us-east-1:866013640144:catalogItemsQueueRssNodeAws'
      }
    ],
  },
  resources: {
    Resources: {
      GatewayResponseDenied: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Credentials': "'true'",
          },
          ResponseType: 'ACCESS_DENIED',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        }
      },
      GatewayResponseUnauthorized: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Credentials': "'true'",
          },
          ResponseType: 'UNAUTHORIZED',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        }
      }
    }
  },
  functions: {
    importProductsFile: {
      handler: 'index.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            cors: true,
            request: {
              parameters: {
                querystrings: {
                  name: true
                }
              }
            },
            authorizer: {
              name: 'basicAuthorizer',
              arn: 'arn:aws:lambda:us-east-1:866013640144:function:authorization-service-dev-basicAuthorizer',
              resultTtlInSeconds: 0,
              identitySource: 'method.request.header.Authorization',
              type: 'token',
            }
          }
        }
      ]
    },
    importFileParser: {
      handler: 'index.importFileParser',
      events: [
        {
          s3: {
            event: 's3:ObjectCreated:*',
            bucket: 'nodejs-aws-import-service-bucket',
            rules: [
              {
                prefix: 'uploaded/',
                suffix: ''
              }
            ],
            existing: true
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
