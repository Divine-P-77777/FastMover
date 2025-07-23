// /app/api/check-admin/route.ts
import { NextRequest, NextResponse } from 'next/server';

const primaryAdmins = process.env.PRIMARY_ADMINS?.split(',') || [];

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (primaryAdmins.includes(email)) {
    return NextResponse.json({ authorized: true });
  }

  return NextResponse.json({ authorized: false }, { status: 403 });
}
