import {APIGatewayProxyHandler} from 'aws-lambda';
import {
  formDefaultServerErrorResponse,
  formFailureResponseBody,
  formResponse,
  formSuccessResponseBody
} from '../../shared/utils/response';
import {HttpResponseStatus} from '../../shared/types/HttpResponseStatus.enum';
import {getImportService} from '../services/utils';


const importProductsFile: APIGatewayProxyHandler = async (event) => {
  const filename = event?.queryStringParameters?.name

  if (!filename) {
    const errorBody = formFailureResponseBody('Query Parameter "name" is required', [])
    return formResponse(HttpResponseStatus.BAD_REQUEST, errorBody);
  }

  try {
    const importService = getImportService();
    const url = await importService.getSignedUrlForProductsUpload(filename);
    const body = formSuccessResponseBody<string>(url);
    return formResponse(HttpResponseStatus.OK, body)
  } catch (e) {
    return formDefaultServerErrorResponse();
  }
}

export default importProductsFile;
