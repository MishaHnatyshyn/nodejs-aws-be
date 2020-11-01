import { APIGatewayProxyHandler } from 'aws-lambda';
import { Book} from '../types/book.interface';
import {
  formResponse,
  formSuccessResponseBody,
  formDefaultServerErrorResponse
} from '../utils/response';
import { HttpResponseStatus } from '../types/HttpResponseStatus.enum';
import { BookService } from '../services';

const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    const books = BookService.getAll();
    const body = formSuccessResponseBody<Book[]>(books);

    return formResponse(HttpResponseStatus.OK, body)
  } catch (e) {
    return formDefaultServerErrorResponse()
  }
}

export default getProductsList;
