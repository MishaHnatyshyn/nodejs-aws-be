import BOOKS from '../../data/Books';
import { Book } from '../../types/book.interface';
import BookNotFoundError from './bookNotFound.error';

export class BookService {
  constructor(private books: Book[]) {}

  getOneById(id: string): Book {
    const targetBook = this.books.find(book => book.id === id);
    if (!targetBook) {
      throw new BookNotFoundError(id);
    }
    return targetBook;
  }

  getAll(): Book[] {
    return this.books;
  }
}

export default new BookService(BOOKS);
