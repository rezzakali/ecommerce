import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { message: 'Signout successful!' },
    { status: 200 }
  );
  response.cookies.set('authToken', '', { expires: new Date(0), path: '/' });
  return response;
}
