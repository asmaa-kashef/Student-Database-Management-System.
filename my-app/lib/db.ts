
import sql from 'mssql';

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'aimap_db',
  port: Number(process.env.DB_PORT || 1433),

  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },

  connectionTimeout: 30000,
  requestTimeout: 30000,

  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool: sql.ConnectionPool | null = null;
let poolPromise: Promise<sql.ConnectionPool> | null = null;

export async function getConnection(): Promise<sql.ConnectionPool> {
  if (pool?.connected) {
    return pool;
  }

  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .then((connectedPool) => {
        pool = connectedPool;
        console.log('Connected to SQL Server successfully!');
        return connectedPool;
      })
      .catch((error: unknown) => {
        pool = null;
        poolPromise = null;

        console.error('Database connection failed:', error);

        throw error;
      });
  }

  return poolPromise;
}
