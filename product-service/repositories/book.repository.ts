import {Client} from 'pg';
import Book from '../models/book.model';
import {ProductDto} from '../types/product.dto';
import BookWithCount from '../models/bookWithCount.model';
import Stock from '../models/stock.model';

const baseSelectQuery = `
    select id, title, description, image_url, price, stocks.count as count from products
    inner join stocks on products.id = stocks.product_id`

export default class BookRepository {
  constructor(private client: Client) {}

  async getById(id: string): Promise<BookWithCount> {
    const { rows } = await this.client.query<BookWithCount>(`
      ${baseSelectQuery}
      where id = $1
    `, [id])
    return rows[0]
  }

  async getAll(): Promise<BookWithCount[]> {
    const { rows } = await this.client.query<BookWithCount>(baseSelectQuery)

    return rows
  }

  async createBookWithStock(data: ProductDto): Promise<BookWithCount> {
    try {
      await this.client.query('BEGIN')
      const book = await this.createBook(data)

      await this.createStock(book.id, data.count)
      await this.client.query('COMMIT')

      return { ...book, count: data.count }
    } catch (e) {
      await this.client.query('ROLLBACK')
      return null
    }
  }

  async createBook({ title, description, price}: ProductDto) {
    const { rows: books } = await this.client.query<Book>(`
      insert into products (title, description, image_url, price) 
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [title, description, '', price])
    return books[0]
  }

  async createStock(bookId: string, count: number) {
    return this.client.query<Stock>(`
      insert into stocks (product_id, count) VALUES ($1, $2)
    `, [bookId, count])
  }
}
