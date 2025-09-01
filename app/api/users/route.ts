

import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/db';

export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting user creation API...');
    
    // Parse request body
    const body = await request.json();
    console.log('📥 Request body received:', { ...body, email: body.email ? '***@***.***' : 'missing' });
    
    const { name, email } = body;

    if (!name || !email) {
      console.log('❌ Missing name or email');
      return NextResponse.json(
        { error: 'Name und E-Mail sind erforderlich' },
        { status: 400 }
      );
    }

    // Get Prisma client
    console.log('🔗 Initializing database connection...');
    const prisma = await getPrismaClient();
    console.log('✅ Database client ready');

    // Check if user already exists, if so, return existing user
    const emailLower = email.toLowerCase().trim();
    console.log('🔍 Checking for existing user...');
    
    let user = await prisma.user.findUnique({
      where: { email: emailLower }
    });

    if (user) {
      console.log('👤 Existing user found:', user.id);
    } else {
      console.log('👤 Creating new user...');
      user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: emailLower,
        },
      });
      console.log('✅ New user created:', user.id);
    }

    return NextResponse.json({ userId: user.id });
  } catch (error) {
    console.error('❌ Error in user API:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json(
      { error: 'Fehler beim Speichern der Benutzerdaten' },
      { status: 500 }
    );
  }
}

