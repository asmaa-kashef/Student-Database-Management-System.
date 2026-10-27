import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM subject');
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}