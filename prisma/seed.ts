import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { UUID } from "crypto";

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

  const mockUuid = await prisma.category.findMany({
    where : {
      name : {
        in : ['main', 'topping', 'beverage']
      }
    }
  })

  const menuDatas = [{
    name : 'Bubur Ayam Kampung',
    price : 20000,
    image : 'https://res.cloudinary.com/dpg0tbbot/image/upload/v1704978248/bunus/rcqltvzeguzxmldbamko.webp',
    description : "lorem ipsum",
    categoryId : mockUuid[0].id
  },
  {
    name : 'Telur Asin',
    price : 9000,
    image : 'https://res.cloudinary.com/dpg0tbbot/image/upload/v1704978287/bunus/z59fmlwb1fhm41e0q4js.webp',
    description : "lorem ipsum",
    categoryId : mockUuid[1].id
  },
  {
    name : 'Es Teh Manis',
    price : 5000,
    image : 'https://res.cloudinary.com/dpg0tbbot/image/upload/v1704978359/bunus/ntqqtbkh2zme9tpo3zcn.svg',
    description : "lorem ipsum",
    categoryId : mockUuid[2].id
  },
]

  await prisma.menu.createMany({
    data : menuDatas
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

