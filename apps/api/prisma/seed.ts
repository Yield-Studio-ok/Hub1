import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding mocks in Neon DB...");

  const testUsers = [
    { email: "admin@yieldstudio.com", name: "Admin Yield", role: "admin" },
    { email: "user@yieldstudio.com", name: "User Yield", role: "user" },
    { email: "mock1@yieldstudio.com", name: "Mock Uno", role: "user" },
    { email: "mock2@yieldstudio.com", name: "Mock Dos", role: "user" }
  ];

  for (const u of testUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        password: "hashed_password_mock", 
        role: u.role,
      },
    });
    console.log(`Upserted user: ${user.email} (ID: ${user.id})`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
