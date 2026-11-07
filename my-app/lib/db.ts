
import mariadb, { type PoolConnection } from 'mariadb';

const pool = mariadb.createPool({
  host: process.env.DB_SERVER || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'aimap_mariadb_import',
  connectionLimit: 5,
  acquireTimeout: 30000,
});

export async function getConnection(): Promise<PoolConnection> {
  return pool.getConnection();
}
