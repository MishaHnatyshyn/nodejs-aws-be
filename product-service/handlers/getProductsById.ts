import { APIGatewayProxyHandler } from 'aws-lambda';
import {
  formDefaultServerErrorResponse,
  formFailureResponseBody,
  formResponse,
  formSuccessResponseBody
} from '../utils/response';
import { HttpResponseStatus } from '../types/HttpResponseStatus.enum';
import BookNotFoundError from '../services/book/bookNotFound.error';
import BookWithCount from '../models/bookWithCount.model';
import {getBookService} from '../services/utils';

const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
  console.log('New request to getProductsById lambda. pathParameters: ' + event.pathParameters)

  const { productId } = event.pathParameters;

  try {
    const bookService = await getBookService()

    const book = await bookService.getOneById(productId);
    const body = formSuccessResponseBody<BookWithCount>(book);

    return formResponse(HttpResponseStatus.OK, body)
  } catch (e) {
    if (e instanceof BookNotFoundError) {
      const errorBody = formFailureResponseBody(`Sorry, can't find a book with id ${productId}. Try using another id!`, [])
      return formResponse(HttpResponseStatus.NOT_FOUND, errorBody);
    }

    return formDefaultServerErrorResponse()
  }
}

export default getProductsById;
