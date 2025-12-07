import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.menuItem.createMany({
    data: [
      {
        category: "Steak",
        name: "Grilled Red Snapper",
        price: 1200,
        description: "400 gm - Tender & flaky red snapper with a smokey & savory flavor that will tantalise your taste buds",
        image: "image1.webp",
      },
      {
        category: "Steak",
        name: "Giant Spare Ribs",
        price: 2850,
        description: "1000 gm - Smoked giant ribs slow cooked to make it fall off the bone glazing with bbq sauce",
        image: "image2.webp",
      },
      {
        category: "Steak",
        name: "King Prawn",
        price: 1150,
        description: "4 pcs - Succulent jumbo shrimps, lightly seasoned & cooked to perfection on the grill",
        image: "image3.webp",
      },
      {
        category: "Appetizer",
        name: "Spicy Mushroom",
        price: 320,
        description: "1:1 - Evenly cut slices of mushrooms sauteed with spicy sauce & garlic butter",
        image: "image4.webp",
      },
      {
        category: "Appetizer",
        name: "Chicken Wings",
        price: 300,
        description: "6 pcs - Hot chicken wings topped with rich & savory bbq sauce",
        image: "image5.webp",
      },
      {
        category: "Appetizer",
        name: "Poutine",
        price: 450,
        description: "1:1 - Crispy potato topped with rich beef sauce & milky mozzarella baked",
        image: "image6.webp",
      },
      {
        category: "Appetizer",
        name: "Bacon Cordon",
        price: 350,
        description: "1:1 - Crispy roll wrapped with milky mozzarella & beef bacon",
        image: "image7.webp",
      },
      {
        category: "Appetizer",
        name: "Southern Cube",
        price: 450,
        description: "1:1 - Deep fried potato cubes & marinated beef cubes drizzled with american cheese",
        image: "image8.webp",
      },
      {
        category: "Appetizer",
        name: "Meat Envelope",
        price: 350,
        description: "5 pcs - Crispy envelope stuffing with smoked cheesy chicken",
        image: "image9.webp",
      },
      {
        category: "Chicken",
        name: "Jamaican Chicken",
        price: 580,
        description: "1:1 - Chicken maryland boneless with skin marinated with lightly spicy sauce topped with a drop of lemon juice & kind pepper",
        image: "image10.webp",
      },
      {
        category: "Chicken",
        name: "Chicken Skewers",
        price: 580,
        description: "1:1 - Tender pcs of marinated chicken grilled to perfection on skewers for smoky flavor & textures",
        image: "image11.webp",
      },
      {
        category: "Chicken",
        name: "Cheese Buldak",
        price: 780,
        description: "1:1 - Super spicy chicken thigh boneless strips flame with fresh red chili & spicy sauce",
        image: "image12.webp",
      },
      {
        category: "Chicken",
        name: "Jerk Chicken",
        price: 630,
        description: "1:1 - Caribbean dish featuring marinade chicken with a perfect balance of heat, smoky flavors & aromatic spices",
        image: "image13.webp",
      },
      {
        category: "Chicken",
        name: "Peri Peri Chicken",
        price: 580,
        description: "1:1 - Fiery grilled chicken dish bursting with vibrant flavor of african inspired peri peri marinade",
        image: "image14.webp",
      },
      {
        category: "Chicken",
        name: "Parmesan Chicken",
        price: 630,
        description: "1:1 - Rich, thick, marinated with light garlic sauce & little spices & topped with permesan cheese",
        image: "image15.webp",
      },
      {
        category: "Chicken",
        name: "Moroccan Chicken",
        price: 580,
        description: "1:1 - Tender chicken cooked in a savory blend of spices, herbs & a harmonious blend of north african & mediterranean influences",
        image: "image16.webp",
      },
      {
        category: "Chicken",
        name: "Pan Seared Chicken",
        price: 580,
        description: "1:1 - Deep marinated chicken thigh with special tangy garlic sauce",
        image: "image17.webp",
      },
    ],
  });

  console.log("✅ Menu seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
