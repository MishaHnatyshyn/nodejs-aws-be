import BookNotFoundError from './bookNotFound.error';
import BookRepository from '../../repositories/book.repository';
import Book from '../../models/book.model';

export class BookService {
  constructor(
    private bookRepository: BookRepository,
  ) {}

  async getOneById(id: string): Promise<Book> {
    const targetBook = await this.bookRepository.getById(id)

    if (!targetBook) {
      throw new BookNotFoundError(id);
    }
    return targetBook;
  }

  async getAll(): Promise<Book[]> {
    return this.bookRepository.getAll()
  }
}
