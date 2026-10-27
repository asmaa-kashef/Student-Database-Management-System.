
import sql from 'mssql/msnodesqlv8';

const config: sql.config = {
  server: 'localhost\\SQLEXPRESS',
  database: 'aimap_db',
  driver: 'ODBC Driver 18 for SQL Server',
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
    encrypt: false,
  },
  connectionTimeout: 30000,
};

let pool: sql.ConnectionPool | null = null;
let poolPromise: Promise<sql.ConnectionPool> | null = null;

export async function getConnection(): Promise<sql.ConnectionPool> {
  if (pool?.connected) {
    return pool;
  }

  if (!poolPromise) {
    console.log(
      'Connecting to SQL Server using Windows Authentication...'
    );

    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .then((connectedPool) => {
        pool = connectedPool;

        console.log('Connected to aimap_db successfully!');

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
