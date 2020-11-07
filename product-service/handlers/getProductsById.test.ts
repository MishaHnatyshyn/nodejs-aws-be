import { BookService } from '../services';
import { Book } from '../types/book.interface';
import getProductsById from './getProductsById';
import {
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayProxyEventBase,
  Context
} from 'aws-lambda';
import BookNotFoundError from '../services/book/bookNotFound.error';
import { formDefaultServerErrorResponse } from '../utils/response';

jest.mock('../services', () => ({
  BookService: {
    getOneById: jest.fn(),
  }
}))

describe('getProductsById', () => {
  const productId = '123';
  const event = ({
    pathParameters: {
      productId
    }
  } as unknown) as APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>;
  const context = {} as Context;
  beforeEach(() => {
    jest.resetAllMocks();
  })

  it('should get books from BookService and return success response', async () => {
    const mockBook = {} as Book;
    (BookService.getOneById as jest.Mock).mockReturnValue(mockBook)
    const result = await getProductsById(event, context, () => {})
    expect(BookService.getOneById).toBeCalledWith(productId);
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        status: 'SUCCESS',
        data: mockBook
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    })
  })

  it('should return 404 response if BookService throws BookNotFoundError error', async () => {
    (BookService.getOneById as jest.Mock).mockImplementation(() => {
      throw new BookNotFoundError(event.pathParameters.productId)
    })
    const result = await getProductsById(event, context, () => {})
    expect(BookService.getOneById).toBeCalledWith(productId);
    expect(result).toEqual({
      statusCode: 404,
      body: JSON.stringify({
        status: 'FAILURE',
        message: `Sorry, can't find a book with id ${productId}. Try using another id!`
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    })
  })

  it('should return 500 response if unknown error occurs', async () => {
    (BookService.getOneById as jest.Mock).mockImplementation(() => {
      throw new Error()
    })
    const result = await getProductsById(event, context, () => {})
    expect(BookService.getOneById).toBeCalledWith(productId);
    expect(result).toEqual(formDefaultServerErrorResponse())
  })
})
