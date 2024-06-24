// import { PrismaClient } from "@prisma/client";
// import { faker } from "@faker-js/faker";

// const prisma = new PrismaClient();

// async function main() {
//   await prisma.user.create({
//     data: {
//       email: "s1f102200378@iniad.org",
//       firebaseUid: "byJUYMmEz4afDvt2Hw4kEDT3zkY2",
//       firstName: faker.name.firstName(),
//       lastName: faker.name.lastName(),
//       fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
//     },
//   });
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
