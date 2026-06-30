const fs = require("fs");
const path = "C:\\Users\\Administrator\\Documents\\Codex\\2026-06-17\\codex-tasks-md-task001-task\\enzyme-skincare\\prisma\\seed.ts";
let content = fs.readFileSync(path, "utf-8");

const adminInsert = `
  // Create admin user if not exists
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: "admin@enzymeskincare.com" } });
  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: { email: "admin@enzymeskincare.com", name: "管理员", passwordHash: "admin123", role: "admin" },
    });
    console.log("Admin user created: admin@enzymeskincare.com / admin123");
  }
`;

content = content.replace(
  'console.log("Seeding database...");',
  adminInsert + "\n  console.log(\"Seeding database...\");"
);
fs.writeFileSync(path, content, "utf-8");
console.log("Seed updated");
