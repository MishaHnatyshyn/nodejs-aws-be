import Book from './book.model';

export default class BookWithCount extends Book {
  readonly count: number
}
