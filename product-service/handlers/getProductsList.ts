import { APIGatewayProxyHandler } from 'aws-lambda';
import {
  formResponse,
  formSuccessResponseBody,
  formDefaultServerErrorResponse
} from '../../shared/utils/response';
import { HttpResponseStatus } from '../../shared/types/HttpResponseStatus.enum';
import {getBookService} from '../services/utils';
import BookWithCount from '../models/bookWithCount.model';


const getProductsList: APIGatewayProxyHandler = async () => {
  console.log('New request to getProductsList lambda')

  try {
    const bookService = await getBookService()

    const books = await bookService.getAll();
    const body = formSuccessResponseBody<BookWithCount[]>(books);

    return formResponse(HttpResponseStatus.OK, body)
  } catch (e) {
    return formDefaultServerErrorResponse()
  }
}

export default getProductsList;
