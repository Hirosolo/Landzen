import { NextRequest, NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

// Update these with your actual MySQL credentials
const dbConfig = {
  host: 'localhost',
  user: 'landzen',
  password: 't123',
  database: 'landzen',
};

export async function GET(req: NextRequest) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM Properties');
    // Cast rows to RowDataPacket[]
    const data = rows as RowDataPacket[];
    const mapped = Array.isArray(data)
      ? data.map((property) => ({
          propertyID: property.propertyID ?? 'NaN',
          propertyName: property.propertyName || 'NaN',
          description: property.description || 'NaN',
          propertyAddress: property.propertyAddress || 'NaN',
          googleMapUrl: property.googleMapUrl || 'NaN',
          images: property.images || 'NaN',
        }))
      : [];
    return NextResponse.json(mapped);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
