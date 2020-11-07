import { BookService } from '../services';
import { Book } from '../types/book.interface';
import getProductsList from './getProductsList';
import {
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayProxyEventBase,
  Context
} from 'aws-lambda';
import { formDefaultServerErrorResponse } from '../utils/response';

jest.mock('../services', () => ({
  BookService: {
    getAll: jest.fn(),
  }
}))

describe('getProductsList', () => {
  const event = {} as APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>;
  const context = {} as Context;
  beforeEach(() => {
    jest.resetAllMocks();
  })

  it('should get all books from BookService and return success response', async () => {
    const mockBooks = [] as Book[];
    (BookService.getAll as jest.Mock).mockReturnValue(mockBooks)
    const result = await getProductsList(event, context, () => {})
    expect(BookService.getAll).toBeCalled();
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        status: 'SUCCESS',
        data: mockBooks
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    })
  })

  it('should return 500 response if unknown error occurs', async () => {
    (BookService.getAll as jest.Mock).mockImplementation(() => {
      throw new Error()
    })
    const result = await getProductsList(event, context, () => {})
    expect(BookService.getAll).toBeCalled();
    expect(result).toEqual(formDefaultServerErrorResponse())
  })
})
