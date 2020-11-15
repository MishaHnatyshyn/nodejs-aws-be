import {getDbClient} from '../data-access';
import BookRepository from '../repositories/book.repository';
import {BookService} from './book/book.service';

export const getBookService = async () => {
  const connection = await getDbClient()
  const bookRepository = new BookRepository(connection);
  return new BookService(bookRepository)
}
