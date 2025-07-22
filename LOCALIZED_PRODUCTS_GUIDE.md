# Localized Product Data Implementation Guide

## Overview
Your BanhdakeShop now supports fully localized product data with both UI translations and product content in English and Vietnamese.

## Key Features Implemented

### ✅ 1. Product Type System
```typescript
// Localized string type
export type LocalizedString = {
  en: string;
  vi: string;
};

// Product specifications with localized keys and values
export type ProductSpecification = {
  key: LocalizedString;
  value: LocalizedString;
};

// Updated Product type with localized fields
export type Product = {
  _id: string;
  name: LocalizedString;           // ✅ Localized
  shortDescription: LocalizedString; // ✅ Localized
  detailDescription: LocalizedString; // ✅ Localized
  specifications: ProductSpecification[]; // ✅ Localized
  // ... other fields remain the same
};
```

### ✅ 2. Utility Functions
```typescript
// Get localized string based on current language
export const getLocalizedString = (
  localizedString: LocalizedString, 
  currentLanguage: string = 'en'
): string => {
  return localizedString[currentLanguage as keyof LocalizedString] || localizedString.en;
};

// Helper to create localized strings
export const createLocalizedString = (en: string, vi: string): LocalizedString => ({
  en,
  vi,
});
```

### ✅ 3. Custom Hook
```typescript
// Hook that combines i18n with localized product data
export const useLocalizedContent = () => {
  const { i18n } = useTranslation();
  
  const getLocalized = (localizedString: LocalizedString): string => {
    return getLocalizedString(localizedString, i18n.language);
  };

  return {
    getLocalized,
    currentLanguage: i18n.language,
  };
};
```

### ✅ 4. Updated Components
- **Products.tsx** - Shows localized product names
- **ProductDetail.tsx** - Full localized product information including specifications
- **Mock data** - Sample products with Vietnamese/English content

## How to Use in Components

### Basic Usage
```tsx
import { useLocalizedContent } from '../hooks/useLocalizedContent';
import type { Product } from '../types/product';

function ProductCard({ product }: { product: Product }) {
  const { getLocalized } = useLocalizedContent();
  
  return (
    <div className="product-card">
      <h2>{getLocalized(product.name)}</h2>
      <p>{getLocalized(product.shortDescription)}</p>
      <img src={product.image} alt={getLocalized(product.name)} />
    </div>
  );
}
```

### Product Specifications
```tsx
function ProductSpecs({ product }: { product: Product }) {
  const { getLocalized } = useLocalizedContent();
  
  return (
    <table>
      <tbody>
        {product.specifications.map((spec, index) => (
          <tr key={index}>
            <td>{getLocalized(spec.key)}</td>
            <td>{getLocalized(spec.value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Sample Data Structure

### English Product Data
```json
{
  "name": { "en": "Nike Air Max 270", "vi": "Nike Air Max 270" },
  "shortDescription": {
    "en": "Comfortable and stylish running shoes with Air Max technology",
    "vi": "Giày chạy bộ thoải mái và phong cách với công nghệ Air Max"
  },
  "specifications": [
    {
      "key": { "en": "Material", "vi": "Chất liệu" },
      "value": { "en": "Mesh and Synthetic", "vi": "Lưới và Synthetic" }
    },
    {
      "key": { "en": "Technology", "vi": "Công nghệ" },
      "value": { "en": "Air Max 270", "vi": "Air Max 270" }
    }
  ]
}
```

## Backend Integration

### Creating Products with Localized Data
```javascript
// Example for your backend API
const newProduct = {
  name: {
    en: "Nike Air Max 270",
    vi: "Nike Air Max 270"
  },
  shortDescription: {
    en: "Comfortable running shoes",
    vi: "Giày chạy bộ thoải mái"
  },
  detailDescription: {
    en: "Premium running shoes with advanced Air Max technology...",
    vi: "Giày chạy bộ cao cấp với công nghệ Air Max tiên tiến..."
  },
  specifications: [
    {
      key: { en: "Material", vi: "Chất liệu" },
      value: { en: "Mesh Upper", vi: "Upper lưới" }
    }
  ]
};
```

### Database Schema (MongoDB)
```javascript
const productSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    vi: { type: String, required: true }
  },
  shortDescription: {
    en: { type: String, required: true },
    vi: { type: String, required: true }
  },
  detailDescription: {
    en: { type: String, required: true },
    vi: { type: String, required: true }
  },
  specifications: [{
    key: {
      en: { type: String, required: true },
      vi: { type: String, required: true }
    },
    value: {
      en: { type: String, required: true },
      vi: { type: String, required: true }
    }
  }],
  // ... other fields
});
```

## Complete System Benefits

### 🎯 User Experience
- Seamless language switching
- Native content in both languages
- Consistent experience across all pages
- Professional product presentation

### 🔧 Developer Experience
- Type-safe localized content
- Easy-to-use utility functions
- Consistent patterns across components
- Future-ready for more languages

### 📊 Business Benefits
- Proper Vietnamese product descriptions
- Better SEO in both languages
- Professional appearance for Vietnamese market
- Scalable for additional languages

## Testing the Implementation

1. **Start the dev server**: `npm run dev`
2. **Switch languages** using the dropdown in navbar
3. **Navigate to Products page** - see localized product names
4. **Open Product Detail** - see localized descriptions and specifications
5. **Verify persistence** - language choice should persist on reload

## Next Steps for Enhancement

1. **Add more product fields**: brand, category, colors with localization
2. **Image alt text localization**: Different alt texts per language
3. **SEO meta tags**: Localized page titles and descriptions
4. **Search functionality**: Search in localized content
5. **Admin panel**: Interface for managing localized product data

Your BanhdakeShop now has a professional, scalable internationalization system that supports both UI translations and localized product content! 🚀
