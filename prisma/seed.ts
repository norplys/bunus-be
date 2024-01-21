import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  return hash(password, 10);
}

async function main() {
  await prisma.user.create({
    data: {
      email: "admin123@gmail.com",
      name: "test",
      password: await hashPassword("admin123"),
      phone: "08123456789",
    },
  });

  await prisma.category.createMany({
    data : [
      {name : 'main'},
      {name : 'topping'},
      {name : 'beverage'}
    ]
  })

  const mockUuid = await prisma.category.findFirst({
    where : {
      name : 'main'
    }
  })

  await prisma.menu.create({
    data : {
      name : 'Bubur Ayam Kampung',
      price : 20000,
      image : 'https://res.cloudinary.com/dpg0tbbot/image/upload/v1704978248/bunus/rcqltvzeguzxmldbamko.webp',
      description : "lorem ipsum",
      category : {
        connect : {
          id: mockUuid?.id
        }
      }
    }
  })
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});

