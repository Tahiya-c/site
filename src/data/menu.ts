export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'steaks' | 'chicken' | 'sides' | 'drinks';
  image?: string;
  badge?: 'bestseller' | 'premium' | 'popular';
}

export const menuItems: MenuItem[] = [
  {
    id: 'sirloin',
    name: 'Premium Sirloin Steak',
    description: 'Perfectly aged, char-grilled to your preference, served with roasted vegetables',
    price: 1850,
    category: 'steaks',
    badge: 'bestseller'
  },
  {
    id: 'striploin',
    name: 'Striploin Perfection',
    description: 'Tender, juicy cuts expertly seasoned and grilled',
    price: 1650,
    category: 'steaks',
    badge: 'premium'
  },
  {
    id: 'chicken',
    name: 'Signature Chicken',
    description: 'Pan-seared chicken with bold flavors, lime, and aromatic spices',
    price: 950,
    category: 'chicken',
    badge: 'popular'
  },
];
