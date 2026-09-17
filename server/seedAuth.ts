import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const admin = await db.user.upsert({
    where: { email: 'admin@spectracheck.com' },
    update: {},
    create: {
      email: 'admin@spectracheck.com',
      name: 'System Admin',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  const inspector = await db.user.upsert({
    where: { email: 'inspector@spectracheck.com' },
    update: {},
    create: {
      email: 'inspector@spectracheck.com',
      name: 'Field Inspector',
      password: passwordHash,
      role: 'INSPECTOR',
    },
  });

  const consumer = await db.user.upsert({
    where: { email: 'consumer@spectracheck.com' },
    update: {},
    create: {
      email: 'consumer@spectracheck.com',
      name: 'Average Consumer',
      password: passwordHash,
      role: 'CONSUMER',
    },
  });

  console.log({ admin, inspector, consumer });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
