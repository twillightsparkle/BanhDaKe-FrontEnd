export type LocalizedString = {
  en: string;
  vi: string;
};

export type ProductSpecification = {
  key: LocalizedString;
  value: LocalizedString;
};

export type Product = {
  _id: string; // MongoDB ObjectId as string
  name: LocalizedString;
  price: number;
  image: string;
  images: string[];
  shortDescription: LocalizedString;
  detailDescription: LocalizedString;
  sizes: string[];
  specifications: ProductSpecification[];
  inStock: boolean;
  weight: number; // in grams
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
