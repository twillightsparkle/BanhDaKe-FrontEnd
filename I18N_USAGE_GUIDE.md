# BanhdakeShop Internationalization (i18n) Usage Guide

## Overview
The BanhdakeShop frontend now supports both English and Vietnamese languages using react-i18next.

## Features
- ✅ English and Vietnamese translations
- ✅ Language switcher component
- ✅ Browser language detection
- ✅ LocalStorage persistence
- ✅ Type-safe translation keys

## File Structure
```
src/
├── i18n/
│   ├── index.ts         # i18n configuration
│   ├── en.json          # English translations
│   └── vi.json          # Vietnamese translations
├── components/
│   └── LanguageSwitcher.tsx  # Language switcher component
└── hooks/
    └── useTranslation.ts     # Custom hook with TypeScript support
```

## How to Use

### 1. In Components
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.subtitle')}</p>
      <button>{t('products.addToCart')}</button>
    </div>
  );
}
```

### 2. With Pluralization
```tsx
// For cart items count
{t('cart.itemsInCart', { count: itemCount })}
```

### 3. Language Switching
The `LanguageSwitcher` component is already integrated into the `Navbar`. Users can:
- Select language from dropdown (🇺🇸 English / 🇻🇳 Tiếng Việt)
- Language preference is saved to localStorage
- Auto-detection based on browser language

## Available Translation Keys

### Navigation
- `navigation.home` - Home / Trang chủ
- `navigation.products` - Products / Sản phẩm
- `navigation.cart` - Cart / Giỏ hàng
- `navigation.checkout` - Checkout / Thanh toán

### Common
- `common.loading` - Loading... / Đang tải...
- `common.error` - Error / Lỗi
- `common.success` - Success / Thành công
- `common.price` - Price / Giá
- `common.quantity` - Quantity / Số lượng

### Products
- `products.title` - Our Products / Sản phẩm của chúng tôi
- `products.addToCart` - Add to Cart / Thêm vào giỏ
- `products.outOfStock` - Out of Stock / Hết hàng
- `products.inStock` - In Stock / Còn hàng

### Cart
- `cart.title` - Shopping Cart / Giỏ hàng
- `cart.empty` - Your cart is empty / Giỏ hàng của bạn đang trống
- `cart.continueShopping` - Continue Shopping / Tiếp tục mua sắm
- `cart.proceedToCheckout` - Proceed to Checkout / Tiến hành thanh toán

### Checkout
- `checkout.title` - Checkout / Thanh toán
- `checkout.billingInfo` - Billing Information / Thông tin thanh toán
- `checkout.placeOrder` - Place Order / Đặt hàng

### Errors & Success Messages
- `errors.required` - This field is required / Trường này là bắt buộc
- `errors.networkError` - Network error. Please try again. / Lỗi mạng. Vui lòng thử lại.
- `success.addedToCart` - Item added to cart successfully! / Đã thêm sản phẩm vào giỏ hàng thành công!

## Adding New Translations

1. Add the key-value pair to both `en.json` and `vi.json`
2. Use the translation in your component with `t('your.new.key')`
3. For TypeScript support, add the key to the `TranslationKey` type in `hooks/useTranslation.ts`

## Configuration Details

### Language Detection
- Priority: localStorage → browser language → fallback to English
- Persistence: Language choice saved to localStorage as `banhdake_language`

### Supported Languages
- `en` - English (default)
- `vi` - Vietnamese

### Fallback Strategy
- If a translation key is missing in the selected language, it falls back to English
- If the key doesn't exist in English either, the key name is displayed

## Testing the Implementation

1. Start the development server: `npm run dev`
2. Navigate to the application
3. Use the language switcher in the navbar
4. Verify translations update across all pages
5. Check that language preference persists on page reload

## Next Steps

To further enhance the i18n implementation:
1. Add more languages (e.g., Chinese, Japanese)
2. Implement RTL (Right-to-Left) support for Arabic languages
3. Add number and date formatting localization
4. Create translation management workflow for content updates
