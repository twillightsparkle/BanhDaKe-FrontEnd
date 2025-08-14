export type LocalizedString = {
  en: string;
  vi: string;
};

export type ProductSpecification = {
  key: LocalizedString;
  value: LocalizedString;
};

// Size option for each variation
export type SizeOption = {
  size: number;
  price: number;
  stock: number;
};

// Variation for color and size options
export type ProductVariation = {
  color: LocalizedString;
  image?: string;
  sizeOptions: SizeOption[];
};

export type Product = {
  _id: string; // MongoDB ObjectId as string
  name: LocalizedString;
  image: string;
  images: string[];
  shortDescription?: LocalizedString; // optional
  detailDescription: LocalizedString;
  specifications: ProductSpecification[];
  weight: number; // in kilograms (kg)
  variations: ProductVariation[];
  inStock: boolean;
  createdAt: string; // MongoDB timestamps
  updatedAt: string;
};

// Utility functions for working with localized strings
export const getLocalizedString = (
  localizedString: LocalizedString, 
  currentLanguage: string = 'en'
): string => {
  return localizedString[currentLanguage as keyof LocalizedString] || localizedString.en;
};

// Helper function to create a localized string
export const createLocalizedString = (en: string, vi: string): LocalizedString => ({
  en,
  vi,
});
