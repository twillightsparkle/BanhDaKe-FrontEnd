import { useTranslation as useI18nTranslation } from 'react-i18next';

// Custom hook with better TypeScript support for our translation keys
export const useTranslation = () => {
  return useI18nTranslation();
};

// Type-safe translation function
export type TranslationKey = 
  | 'navigation.home'
  | 'navigation.products'
  | 'navigation.cart'
  | 'navigation.checkout'
  | 'navigation.language'
  | 'common.welcome'
  | 'common.loading'
  | 'common.error'
  | 'common.success'
  | 'common.add'
  | 'common.edit'
  | 'common.delete'
  | 'common.save'
  | 'common.cancel'
  | 'common.confirm'
  | 'common.back'
  | 'common.next'
  | 'common.search'
  | 'common.filter'
  | 'common.sort'
  | 'common.price'
  | 'common.quantity'
  | 'common.total'
  | 'common.subtotal'
  | 'home.title'
  | 'home.subtitle'
  | 'home.featuredProducts'
  | 'home.shopNow'
  | 'home.viewAll'
  | 'products.title'
  | 'products.addToCart'
  | 'products.outOfStock'
  | 'products.inStock'
  | 'products.viewDetails'
  | 'products.sizes'
  | 'products.colors'
  | 'products.description'
  | 'products.specifications'
  | 'products.reviews'
  | 'products.relatedProducts'
  | 'cart.title'
  | 'cart.empty'
  | 'cart.continueShopping'
  | 'cart.removeItem'
  | 'cart.updateQuantity'
  | 'cart.proceedToCheckout'
  | 'cart.itemsInCart'
  | 'checkout.title'
  | 'checkout.billingInfo'
  | 'checkout.shippingInfo'
  | 'checkout.paymentMethod'
  | 'checkout.orderSummary'
  | 'checkout.placeOrder'
  | 'checkout.firstName'
  | 'checkout.lastName'
  | 'checkout.email'
  | 'checkout.phone'
  | 'checkout.address'
  | 'checkout.city'
  | 'checkout.zipCode'
  | 'checkout.country'
  | 'checkout.cardNumber'
  | 'checkout.expiryDate'
  | 'checkout.cvv'
  | 'checkout.cardholderName'
  | 'errors.required'
  | 'errors.invalidEmail'
  | 'errors.invalidPhone'
  | 'errors.networkError'
  | 'errors.serverError'
  | 'errors.productNotFound'
  | 'errors.addToCartFailed'
  | 'errors.checkoutFailed'
  | 'success.addedToCart'
  | 'success.orderPlaced'
  | 'success.profileUpdated';

export default useTranslation;
