
import 'server-only';

import {
  createHmac,
  timingSafeEqual,
} from 'node:crypto';

import { cookies } from 'next/headers';

const COOKIE_NAME = 'aimap_admin_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

type AdminData = {
  id: number;
  username: string;
};

type SessionPayload = {
  id: number;
  username: string;
  expiresAt: number;
};

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || !/^[a-fA-F0-9]{64}$/.test(secret)) {
    throw new Error(
      'ADMIN_SESSION_SECRET must contain exactly 64 hexadecimal characters.'
    );
  }

  return secret;
}

function signPayload(payload: string): string {
  return createHmac('sha256', getSecret())
    .update(payload)
    .digest('base64url');
}

function isValidAdminData(
  admin: unknown
): admin is AdminData {
  if (!admin || typeof admin !== 'object') {
    return false;
  }

  const data = admin as Record<string, unknown>;

  return (
    Number.isSafeInteger(data.id) &&
    Number(data.id) > 0 &&
    typeof data.username === 'string' &&
    data.username.trim().length > 0 &&
    data.username.length <= 100
  );
}

export async function createAdminSession(
  admin: AdminData
): Promise<void> {
  if (!isValidAdminData(admin)) {
    throw new Error('Invalid administrator data.');
  }

  const expiresAt =
    Math.floor(Date.now() / 1000) +
    SESSION_DURATION_SECONDS;

  const sessionData: SessionPayload = {
    id: admin.id,
    username: admin.username.trim(),
    expiresAt,
  };

  const payload = Buffer.from(
    JSON.stringify(sessionData)
  ).toString('base64url');

  const signature = signPayload(payload);
  const token = `${payload}.${signature}`;

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
    expires: new Date(expiresAt * 1000),
  });
}

export async function getAdminSession(): Promise<AdminData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const parts = token.split('.');

    if (parts.length !== 2) {
      return null;
    }

    const [payload, signature] = parts;

    if (!payload || !signature) {
      return null;
    }

    const expectedSignature = Buffer.from(
      signPayload(payload),
      'base64url'
    );

    const actualSignature = Buffer.from(
      signature,
      'base64url'
    );

    if (
      expectedSignature.length !== actualSignature.length ||
      !timingSafeEqual(
        expectedSignature,
        actualSignature
      )
    ) {
      return null;
    }

    const session: unknown = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8')
    );

    if (!session || typeof session !== 'object') {
      return null;
    }

    const data = session as Record<string, unknown>;

    if (
      !Number.isSafeInteger(data.id) ||
      Number(data.id) <= 0 ||
      typeof data.username !== 'string' ||
      !data.username.trim() ||
      data.username.length > 100 ||
      !Number.isSafeInteger(data.expiresAt) ||
      Number(data.expiresAt) <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return {
      id: Number(data.id),
      username: data.username,
    };

  } catch (error) {
    console.error('ADMIN SESSION ERROR:', error);
    return null;
  }
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });
}
