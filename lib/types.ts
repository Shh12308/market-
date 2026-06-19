export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  images?: string[];
  category: string;
  condition: "new" | "like_new" | "excellent" | "good" | "fair";
  status: "active" | "ended" | "sold" | "pending";
  listingType: "buy_now" | "auction" | "both";
  auction?: {
    currentBid: number;
    bidsCount: number;
    timeLeft: string;
    reserveMet: boolean;
  };
  seller: Seller;
  chain: string;
  tokenPrice?: number;
  watchers: number;
  views: number;
  shipping: {
    free: boolean;
    price: number;
    estimatedDays: string;
  };
  createdAt: string;
  tags: string[];
  featured: boolean;
  isNew: boolean;
}

export interface Seller {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  feedbackScore: number;
  positivePercent: number;
  verified: boolean;
  totalSales: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
  productCount: number;
  image: string;
}

export interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
  pageSize: number;
}
