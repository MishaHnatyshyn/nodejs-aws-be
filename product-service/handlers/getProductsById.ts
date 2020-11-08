import { APIGatewayProxyHandler } from 'aws-lambda';
import {
  formDefaultServerErrorResponse,
  formFailureResponseBody,
  formResponse,
  formSuccessResponseBody
} from '../utils/response';
import { HttpResponseStatus } from '../types/HttpResponseStatus.enum';
import BookNotFoundError from '../services/book/bookNotFound.error';
import Book from '../models/book.model';
import {getBookService} from '../services/utils';

const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
  const { productId } = event.pathParameters;

  try {
    const bookService = await getBookService()

    const book = await bookService.getOneById(productId);
    const body = formSuccessResponseBody<Book>(book);

    return formResponse(HttpResponseStatus.OK, body)
  } catch (e) {
    if (e instanceof BookNotFoundError) {
      const errorBody = formFailureResponseBody(`Sorry, can't find a book with id ${productId}. Try using another id!`)
      return formResponse(HttpResponseStatus.NOT_FOUND, errorBody);
    }

    return formDefaultServerErrorResponse()
  }
}

export default getProductsById;
