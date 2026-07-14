import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create admin user if not exists
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: "admin@enzymeskincare.com" } });
  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: { email: "admin@enzymeskincare.com", name: "管理员", passwordHash: "admin123", role: "admin" },
    });
    console.log("Admin user created: admin@enzymeskincare.com / admin123");
  } else {
    console.log("Admin user already exists, skipped.");
  }

  console.log("Seed admin complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
