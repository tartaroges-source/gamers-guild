import { prisma } from '../lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME ?? 'Admin';

  if (!email || !password) {
    throw new Error(
      'Missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD. Set both in .env.local before seeding.'
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`Admin account already exists for ${email} — nothing to do.`);
    return;
  }

  // 12 salt rounds is bcrypt's widely-recommended default: strong enough to
  // resist brute-force attacks, without making login noticeably slow.
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  console.log(`Created first Admin account: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
