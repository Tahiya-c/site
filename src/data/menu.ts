export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'steak' | 'appetizer' | 'chicken';
  image: string;
  badge?: 'bestseller' | 'premium' | 'popular';
}

export const menuItems: MenuItem[] = [
  // STEAKS
  {
    id: "grilled-red-snapper",
    name: "Grilled Red Snapper",
    description: "400 gm - Tender & flaky red snapper with a smokey & savory flavor",
    price: 1200,
    category: "steak",
    image: "/menu/image1.webp",
  },
  {
    id: "giant-spare-ribs",
    name: "Giant Spare Ribs",
    description: "1000 gm - Smoked giant ribs slow cooked to fall off the bone, glazed with bbq sauce",
    price: 2850,
    category: "steak",
    image: "/menu/image2.webp",
    badge: "premium",
  },
  {
    id: "king-prawn",
    name: "King Prawn",
    description: "4 pcs - Succulent jumbo shrimps, lightly seasoned & cooked to perfection on the grill",
    price: 1150,
    category: "steak",
    image: "/menu/image3.webp",
  },

  // APPETIZERS
  {
    id: "spicy-mushroom",
    name: "Spicy Mushroom",
    description: "Evenly cut slices of mushrooms sautéed with spicy sauce & garlic butter",
    price: 320,
    category: "appetizer",
    image: "/menu/image4.webp",
  },
  {
    id: "chicken-wings",
    name: "Chicken Wings",
    description: "6 pcs - Hot chicken wings topped with rich & savory bbq sauce",
    price: 300,
    category: "appetizer",
    image: "/menu/image5.webp",
    badge: "popular",
  },
  {
    id: "poutine",
    name: "Poutine",
    description: "Crispy potato topped with rich beef sauce & milky mozzarella baked",
    price: 450,
    category: "appetizer",
    image: "/menu/image6.webp",
  },
  {
    id: "bacon-cordon",
    name: "Bacon Cordon",
    description: "Crispy roll wrapped with milky mozzarella & beef bacon",
    price: 350,
    category: "appetizer",
    image: "/menu/image7.webp",
  },
  {
    id: "southern-cube",
    name: "Southern Cube",
    description: "Deep fried potato cubes & marinated beef cubes drizzled with american cheese",
    price: 450,
    category: "appetizer",
    image: "/menu/image8.webp",
  },
  {
    id: "meat-envelope",
    name: "Meat Envelope",
    description: "5 pcs - Crispy envelope stuffed with smoked cheesy chicken",
    price: 350,
    category: "appetizer",
    image: "/menu/image9.webp",
  },

  // CHICKEN
  {
    id: "jamaican-chicken",
    name: "Jamaican Chicken",
    description: "Boneless chicken maryland with skin marinated with lightly spicy sauce, topped with lemon juice & kind pepper",
    price: 580,
    category: "chicken",
    image: "/menu/image10.webp",
  },
  {
    id: "chicken-skewers",
    name: "Chicken Skewers",
    description: "Tender pieces of marinated chicken grilled to perfection on skewers for smoky flavor & texture",
    price: 580,
    category: "chicken",
    image: "/menu/image11.webp",
  },
  {
    id: "cheese-buldak",
    name: "Cheese Buldak",
    description: "Super spicy chicken thigh boneless strips flamed with fresh red chili & spicy sauce",
    price: 780,
    category: "chicken",
    image: "/menu/image12.webp",
  },
  {
    id: "jerk-chicken",
    name: "Jerk Chicken",
    description: "Caribbean dish featuring marinated chicken with a perfect balance of heat, smoky flavors & aromatic spices",
    price: 630,
    category: "chicken",
    image: "/menu/image13.webp",
  },
  {
    id: "peri-peri-chicken",
    name: "Peri Peri Chicken",
    description: "Fiery grilled chicken dish bursting with vibrant flavors of african inspired peri peri marinade",
    price: 580,
    category: "chicken",
    image: "/menu/image14.webp",
  },
  {
    id: "parmesan-chicken",
    name: "Parmesan Chicken",
    description: "Rich, thick chicken marinated with light garlic sauce & spices, topped with parmesan cheese",
    price: 630,
    category: "chicken",
    image: "/menu/image15.webp",
  },
  {
    id: "moroccan-chicken",
    name: "Moroccan Chicken",
    description: "Tender chicken cooked in a savory blend of spices, herbs & a harmonious blend of north african & mediterranean influences",
    price: 580,
    category: "chicken",
    image: "/menu/image16.webp",
  },
  {
    id: "pan-seared-chicken",
    name: "Pan Seared Chicken",
    description: "Deep marinated chicken thigh with special tangy garlic sauce",
    price: 580,
    category: "chicken",
    image: "/menu/image17.webp",
  },
];