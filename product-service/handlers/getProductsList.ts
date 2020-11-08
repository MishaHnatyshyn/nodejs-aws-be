import { APIGatewayProxyHandler } from 'aws-lambda';
import {
  formResponse,
  formSuccessResponseBody,
  formDefaultServerErrorResponse
} from '../utils/response';
import { HttpResponseStatus } from '../types/HttpResponseStatus.enum';
import Book from '../models/book.model';
import {getBookService} from '../services/utils';


const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    const bookService = await getBookService()

    const books = await bookService.getAll();
    const body = formSuccessResponseBody<Book[]>(books);

    return formResponse(HttpResponseStatus.OK, body)
  } catch (e) {
    return formDefaultServerErrorResponse()
  }
}

export default getProductsList;
