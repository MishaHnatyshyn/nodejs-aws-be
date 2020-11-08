import { Client } from "pg";
import { connectionOptions } from './options';

export const getDbClient = async () => {
  const client = new Client(connectionOptions);
  await client.connect();
  return client;
}
