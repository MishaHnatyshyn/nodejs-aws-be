export default class BookNotFoundError extends Error {
  constructor(public id: string) {
    super(`Book with ${id} can not be found`);
  }
}
