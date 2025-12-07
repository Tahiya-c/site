export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'steak' | 'appetizer' | 'chicken';
  image?: string;
  badge?: 'bestseller' | 'premium' | 'popular';
}

export const menuItems: MenuItem[] = [
  // 🥩 STEAK
  {
    id: "grilled-red-snapper",
    name: "Grilled Red Snapper",
    description: "400 gm - Tender & flaky red snapper with smokey & savory flavor that will tantalise your taste buds",
    price: 1200,
    category: "steak",
    image: "/menu/image1.webp",
  },
  {
    id: "giant-spare-ribs",
    name: "Giant Spare Ribs",
    description: "1000 gm - Smoked giant ribs slow cooked to fall off the bone glazed with BBQ sauce",
    price: 2850,
    category: "steak",
    image: "/menu/image2.webp",
    badge: "premium",
  },
  {
    id: "king-prawn",
    name: "King Prawn",
    description: "4 pcs - Succulent jumbo shrimps, lightly seasoned & cooked to perfection",
    price: 1150,
    category: "steak",
    image: "/menu/image3.webp",
  },

  // 🍟 APPETIZER
  {
    id: "spicy-mushroom",
    name: "Spicy Mushroom",
    description: "Evenly cut mushrooms sautéed with spicy sauce & garlic butter",
    price: 320,
    category: "appetizer",
    image: "/menu/image4.webp",
  },
  {
    id: "chicken-wings",
    name: "Chicken Wings",
    description: "6 pcs - Hot wings topped with rich & savory BBQ sauce",
    price: 300,
    category: "appetizer",
    image: "/menu/image5.webp",
    badge: "popular",
  },
  {
    id: "poutine",
    name: "Poutine",
    description: "Crispy potato topped with rich beef sauce & mozzarella baked",
    price: 450,
    category: "appetizer",
    image: "/menu/image6.webp",
  },
  {
    id: "bacon-cordon",
    name: "Bacon Cordon",
    description: "Crispy roll wrapped with mozzarella & beef bacon",
    price: 350,
    category: "appetizer",
    image: "/menu/image7.webp",
  },
  {
    id: "southern-cube",
    name: "Southern Cube",
    description: "Deep fried potato & marinated beef cubes with American cheese",
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

  // 🍗 CHICKEN
  {
    id: "jamaican-chicken",
    name: "Jamaican Chicken",
    description: "Boneless chicken Maryland marinated with light spicy sauce topped with lemon & pepper",
    price: 580,
    category: "chicken",
    image: "/menu/image10.webp",
  },
  {
    id: "chicken-skewers",
    name: "Chicken Skewers",
    description: "Tender marinated chicken grilled to perfection on skewers",
    price: 580,
    category: "chicken",
    image: "/menu/image11.webp",
  },
  {
    id: "cheese-buldak",
    name: "Cheese Buldak",
    description: "Super spicy chicken thigh strips flamed with fresh chili & spicy sauce",
    price: 780,
    category: "chicken",
    image: "/menu/image12.webp",
  },
  {
    id: "jerk-chicken",
    name: "Jerk Chicken",
    description: "Caribbean dish featuring marinated chicken with a balance of heat & smoky flavor",
    price: 630,
    category: "chicken",
    image: "/menu/image13.webp",
  },
  {
    id: "peri-peri-chicken",
    name: "Peri Peri Chicken",
    description: "Fiery grilled chicken bursting with African peri peri flavors",
    price: 580,
    category: "chicken",
    image: "/menu/image14.webp",
  },
  {
    id: "parmesan-chicken",
    name: "Parmesan Chicken",
    description: "Marinated chicken with garlic sauce & spices topped with parmesan cheese",
    price: 630,
    category: "chicken",
    image: "/menu/image15.webp",
  },
  {
    id: "moroccan-chicken",
    name: "Moroccan Chicken",
    description: "Savory blend of spices, herbs & Mediterranean influences",
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
