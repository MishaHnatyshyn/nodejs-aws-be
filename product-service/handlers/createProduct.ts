import { APIGatewayProxyHandler } from 'aws-lambda';
import {
  formResponse,
  formSuccessResponseBody,
  formDefaultServerErrorResponse, formFailureResponseBody
} from '../../shared/utils/response';
import { HttpResponseStatus } from '../../shared/types/HttpResponseStatus.enum';
import Book from '../models/book.model';
import {getBookService} from '../services/utils';
import {ProductDto} from '../types/product.dto';
import * as Joi from 'joi';
import {validateProductDto} from '../schemas/book.schema';

const createProduct: APIGatewayProxyHandler = async (event) => {
  try {
    console.log('New request to createProduct lambda. Body: ' + event.body)
    const bodyData = event.body || '{}'
    const productData = JSON.parse(bodyData) as ProductDto
    await validateProductDto(productData);
    const bookService = await getBookService()

    const book = await bookService.create(productData);
    const body = formSuccessResponseBody<Book>(book);

    return formResponse(HttpResponseStatus.CREATED, body)
  } catch (e) {
    if (e instanceof Joi.ValidationError) {
      const body = formFailureResponseBody('Invalid body', e.details)
      return formResponse(HttpResponseStatus.BAD_REQUEST, body)
    }
    return formDefaultServerErrorResponse()
  }
}

export default createProduct;
