import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'API is working' });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json({
      success: true,
      message: 'Test API received data',
      receivedData: body,
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { error: 'An error occurred processing the request' },
      { status: 500 }
    );
  }
}
