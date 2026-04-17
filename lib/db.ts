import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getDbPool(): mysql.Pool {
  if (pool) {
    return pool;
  }

  const host = requireEnv('DB_HOST');
  const port = Number(process.env.DB_PORT ?? '3306');
  const user = requireEnv('DB_USER');
  const password = process.env.DB_PASSWORD ?? '';
  const database = requireEnv('DB_NAME');

  pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}
