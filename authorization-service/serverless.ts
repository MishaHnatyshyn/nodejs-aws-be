import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  resources: {
    Outputs: {
      AuthorizationARN: {
        Value: {
          'Fn::GetAtt': ['BasicAuthorizerLambdaFunction', 'Arn']
        },
        Export: {
          Name: 'AuthorizationARN'
        }
      }
    }
  },
  functions: {
    basicAuthorizer: {
      handler: 'index.basicAuthorizer',
    }
  }
}

module.exports = serverlessConfiguration;
