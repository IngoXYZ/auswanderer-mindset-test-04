
// Robust Prisma client for Vercel
let prismaClient: any = null

export async function getPrismaClient() {
  if (!prismaClient) {
    try {
      const { PrismaClient } = await import('@prisma/client')
      
      prismaClient = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        datasources: {
          db: {
            url: process.env.DATABASE_URL
          }
        }
      })
      
      // Test connection
      await prismaClient.$connect()
      console.log('✅ Prisma client connected successfully')
      
    } catch (error) {
      console.error('❌ Prisma client initialization failed:', error)
      throw new Error(`Database connection failed: ${error.message}`)
    }
  }
  return prismaClient
}
