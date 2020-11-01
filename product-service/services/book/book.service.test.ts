import { BookService } from './book.service';
import BookNotFoundError from './bookNotFound.error';

describe('BookServer', () => {
  let service: BookService;
  const mockBooks = [
    {
      imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/51A99teA6iL.jpg',
      count: 2,
      description: 'Short Product Descriptio1',
      id: '7567ec4b-b10c-48c5-9445-fc73c48a80a2',
      price: 23,
      title: 'Product2',
      author: 'Author 1',
      pagesCount: 100,
    },
    {
      imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/51A99teA6iL.jpg',
      count: 3,
      description: 'Short Product Description7',
      id: '7567ec4b-b10c-45c5-9345-fc73c48a80a1',
      price: 15,
      title: 'ProductName',
      author: 'Author 1',
      pagesCount: 100,
    }]
  beforeEach(() => {
    service = new BookService(mockBooks);
  })

  describe('getOneById', () => {
    it('should return book by id', () => {
      const result = service.getOneById('7567ec4b-b10c-48c5-9445-fc73c48a80a2');
      expect(result).toEqual(mockBooks[0]);
    })

    it('should throw BookNotFoundError and pass id there if there is no book with provided id', () => {
      try {
        service.getOneById('123')
      } catch (e) {
        expect(e).toBeInstanceOf(BookNotFoundError)
        expect(e.id).toEqual('123');
      }
    })
  })

  describe('getAll', () => {
    it('should return all books', () => {
      const result = service.getAll();
      expect(result).toEqual(mockBooks);
    })
  })
})
