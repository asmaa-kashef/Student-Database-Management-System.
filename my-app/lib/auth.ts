
import bcrypt from 'bcryptjs';
import { getConnection } from './db';

export async function verifyUser(
  username: string,
  password: string
) {
  let connection;

  try {
    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      !username.trim() ||
      !password
    ) {
      return null;
    }

    connection = await getConnection();

    const users = await connection.query(
      `
      SELECT id, username, password_hash
      FROM maintenance_users
      WHERE username = ?
      LIMIT 1
      `,
      [username.trim()]
    );

    const user = users[0];

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isValid) {
      return null;
    }

    return {
      id: Number(user.id),
      username: user.username,
    };

  } finally {
    if (connection) {
      connection.release();
    }
  }
}
