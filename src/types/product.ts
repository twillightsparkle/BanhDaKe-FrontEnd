export type Product = {
    _id: string; // MongoDB ObjectId as string
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    images: string[];
    shortDescription: string;
    detailDescription: string;
    sizes: string[];
    specifications: { [key: string]: string };
    inStock: boolean;
    stock: number; // Add stock field to match backend
    createdAt: string; // MongoDB timestamps
    updatedAt: string;
};
