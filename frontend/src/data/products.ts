/**
 * Product Data for VastraVerse
 * Sample products with Indian fashion items
 */

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating?: number;
  description?: string;
  sizes?: string[];
  image: string;
  brand?: string;
  gender?: string;
  stock?: number;
  images?: string[];
  discounted_price?: number;
  discount_percentage?: number;
  base_colour?: string;
  season?: string;
  usage?: string;
  colors?: Array<{ name: string; hex: string }>;
  related?: number[];
  reviews?: Array<{
    id: number;
    user: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Royal Blue Kurta Set",
    category: "Men's Ethnic Wear",
    price: 1499,
    rating: 4.7,
    description:
      "Elegant royal blue cotton kurta with white churidar pants. Perfect for festive and traditional occasions.",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1620794341550-6c89e6b8d1ab?w=600&auto=format"
  },
  {
    id: 2,
    name: "Silk Saree with Zari Border",
    category: "Women's Traditional Wear",
    price: 2599,
    rating: 4.8,
    description:
      "Beautiful red silk saree with intricate golden zari border and pallu work. Ideal for weddings and festivals.",
    sizes: ["Free Size"],
    image:
      "https://images.unsplash.com/photo-1582651051604-58d7f6f3e8a4?w=600&auto=format"
  },
  {
    id: 3,
    name: "Cotton Printed Shirt",
    category: "Men's Casual Wear",
    price: 999,
    rating: 4.4,
    description:
      "Soft and breathable cotton shirt with Indian block print pattern. Pairs well with jeans or chinos.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    image:
      "https://images.unsplash.com/photo-1520975922203-27d7c9691a49?w=600&auto=format"
  },
  {
    id: 4,
    name: "Floral Anarkali Gown",
    category: "Women's Ethnic Wear",
    price: 1899,
    rating: 4.6,
    description:
      "Graceful floor-length Anarkali gown with floral prints and soft georgette fabric. A perfect festive outfit.",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1616469829960-18aef209d661?w=600&auto=format"
  },
  {
    id: 5,
    name: "Indigo Denim Jacket",
    category: "Men's Western Wear",
    price: 1799,
    rating: 4.5,
    description:
      "Trendy indigo blue denim jacket with stitched pocket design. Ideal for cool casual outings.",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1593032465171-8f0b7a0b78cd?w=600&auto=format"
  },
  {
    id: 6,
    name: "Pastel Lehenga Choli",
    category: "Women's Bridal Wear",
    price: 3299,
    rating: 4.9,
    description:
      "Pastel pink lehenga choli set with mirror work and embroidered dupatta. Lightweight and elegant.",
    sizes: ["S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1622021830629-066c09ad248c?w=600&auto=format"
  },
  {
    id: 7,
    name: "Handloom Kurta",
    category: "Men's Ethnic Wear",
    price: 1399,
    rating: 4.6,
    description:
      "Classic beige handloom cotton kurta with mandarin collar and wooden buttons. Comfortable daily ethnic wear.",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1621786860304-1b1a0a0197a1?w=600&auto=format"
  },
  {
    id: 8,
    name: "Chikankari Kurti",
    category: "Women's Ethnic Wear",
    price: 1099,
    rating: 4.5,
    description:
      "Beautiful white chikankari embroidered kurti, handcrafted from Lucknow. Perfect for summer wear.",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1617034182210-91e5336b4999?w=600&auto=format"
  },
  {
    id: 9,
    name: "Graphic T-Shirt",
    category: "Men's Casual Wear",
    price: 699,
    rating: 4.3,
    description:
      "Comfortable cotton T-shirt with trendy printed design. A must-have for youth fashion.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    image:
      "https://images.unsplash.com/photo-1618354691213-39d1f1aa8d1e?w=600&auto=format"
  },
  {
    id: 10,
    name: "Embroidered Dupatta",
    category: "Women's Accessories",
    price: 599,
    rating: 4.4,
    description:
      "Soft chiffon dupatta with zari embroidery and tassels. Adds elegance to any ethnic outfit.",
    sizes: ["Free Size"],
    image:
      "https://images.unsplash.com/photo-1622021830567-4d07da4d7959?w=600&auto=format"
  }
];
