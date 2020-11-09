import BookNotFoundError from './bookNotFound.error';
import BookRepository from '../../repositories/book.repository';
import {ProductDto} from '../../types/product.dto';
import BookWithCount from '../../models/bookWithCount.model';
import FailedToCreateBookError from './failedToCreateBook.error';

export class BookService {
  constructor(
    private bookRepository: BookRepository,
  ) {}

  async getOneById(id: string): Promise<BookWithCount> {
    const targetBook = await this.bookRepository.getById(id)

    if (!targetBook) {
      throw new BookNotFoundError(id);
    }
    return targetBook;
  }

  async getAll(): Promise<BookWithCount[]> {
    return this.bookRepository.getAll()
  }

  async create(data: ProductDto): Promise<BookWithCount> {
    const book = await this.bookRepository.createBookWithStock(data)
    if (!book) {
      throw new FailedToCreateBookError()
    }
    return book
  }
}
