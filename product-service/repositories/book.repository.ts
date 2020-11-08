import {Client} from 'pg';
import Book from '../models/book.model';

const baseSelectQuery = `
    select id, title, description, image_url, price, stocks.count as count from products
    inner join stocks on products.id = stocks.product_id`

export default class BookRepository {
  constructor(private client: Client) {}

  async getById(id: string): Promise<Book> {
    const { rows } = await this.client.query<Book>(`
      ${baseSelectQuery}
      where id = $1
    `, [id])
    return rows[0]
  }

  async getAll(): Promise<Book[]> {
    const { rows } = await this.client.query<Book>(baseSelectQuery)

    return rows
  }
}
