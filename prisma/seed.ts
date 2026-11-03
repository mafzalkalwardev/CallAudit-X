import { seedDemoAccounts } from "../lib/demo-user";
import { prisma } from "../lib/prisma";

async function main() {
  const { admin, customer } = await seedDemoAccounts({ refreshPasswords: true });
  const categories = await prisma.category.count();
  console.log({ admin: admin.email, customer: customer.email, categories });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
