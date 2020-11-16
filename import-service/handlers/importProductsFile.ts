import {APIGatewayProxyHandler} from 'aws-lambda';
import * as AWS from 'aws-sdk';
import {formDefaultServerErrorResponse, formResponse, formSuccessResponseBody} from '../../shared/utils/response';
import {HttpResponseStatus} from '../../shared/types/HttpResponseStatus.enum';


const importProductsFile: APIGatewayProxyHandler = async (event) => {
  const filename = event.queryStringParameters.name;
  const s3 = new AWS.S3({ region: 'us-east-1' })
  const params = {
    Bucket: process.env.PRODUCTS_BUCKET_NAME,
    Key: `uploaded/${filename}`,
    Expires: 60,
    ContentType: 'text/csv',
  }

  try {
    const url = await s3.getSignedUrlPromise('putObject', params)
    const body = formSuccessResponseBody<string>(url);
    return formResponse(HttpResponseStatus.OK, body)
  } catch (e) {
    return formDefaultServerErrorResponse();
  }
}

export default importProductsFile;
