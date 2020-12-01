import { HttpResponseStatus } from '../types/HttpResponseStatus.enum';
import { APIGatewayProxyResult } from 'aws-lambda';

export const formSuccessResponseBody = <T>(data: T) => ({
  status: 'SUCCESS',
  data
})

export const formFailureResponseBody = (message: string, errors: any[]) => ({
  status: 'FAILURE',
  message,
  errors,
})

export const formResponse = (status: HttpResponseStatus, body, headers = {}): APIGatewayProxyResult => ({
  statusCode: status as number,
  body: JSON.stringify(body),
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': '*',
    ...headers
  },
})

export const formDefaultServerErrorResponse = (): APIGatewayProxyResult => {
  const errorBody = formFailureResponseBody('Something went wrong :(', []);

  return formResponse(HttpResponseStatus.SERVER_ERROR, errorBody)
}
