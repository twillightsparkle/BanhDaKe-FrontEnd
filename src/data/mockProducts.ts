import type { Product } from '../types/product';
import { createLocalizedString } from '../types/product';

export const mockProducts: Product[] = [
  {
    _id: '1',
    name: createLocalizedString(
      'Nike Air Max 270',
      'Nike Air Max 270'
    ),
    price: 1500000,
    originalPrice: 1800000,
    image: '/src/assets/shoe1.jpg',
    images: ['/src/assets/shoe1.jpg', '/src/assets/shoe2.jpg'],
    shortDescription: createLocalizedString(
      'Comfortable and stylish running shoes with Air Max technology',
      'Giày chạy bộ thoải mái và phong cách với công nghệ Air Max'
    ),
    detailDescription: createLocalizedString(
      'The Nike Air Max 270 delivers visible comfort with the tallest Air unit yet. The engineered mesh upper provides breathability while the foam midsole adds lightweight cushioning.',
      'Nike Air Max 270 mang đến sự thoải mái rõ ràng với đơn vị Air cao nhất từ trước đến nay. Phần upper bằng lưới kỹ thuật mang lại khả năng thông thoáng trong khi phần đệm giữa bằng foam thêm đệm nhẹ.'
    ),
    sizes: ['38', '39', '40', '41', '42', '43'],
    specifications: [
      {
        key: createLocalizedString('Material', 'Chất liệu'),
        value: createLocalizedString('Mesh and Synthetic', 'Lưới và Synthetic')
      },
      {
        key: createLocalizedString('Sole Type', 'Loại đế'),
        value: createLocalizedString('Rubber Outsole', 'Đế ngoài cao su')
      },
      {
        key: createLocalizedString('Technology', 'Công nghệ'),
        value: createLocalizedString('Air Max 270', 'Air Max 270')
      },
      {
        key: createLocalizedString('Weight', 'Trọng lượng'),
        value: createLocalizedString('300g (per shoe)', '300g (mỗi chiếc)')
      }
    ],
    inStock: true,
    stock: 25,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    _id: '2',
    name: createLocalizedString(
      'Adidas Ultraboost 22',
      'Adidas Ultraboost 22'
    ),
    price: 1800000,
    originalPrice: 2100000,
    image: '/src/assets/shoe2.jpg',
    images: ['/src/assets/shoe2.jpg', '/src/assets/shoe1.jpg'],
    shortDescription: createLocalizedString(
      'Premium running shoes with BOOST technology for maximum energy return',
      'Giày chạy bộ cao cấp với công nghệ BOOST cho khả năng hoàn trả năng lượng tối đa'
    ),
    detailDescription: createLocalizedString(
      'The Adidas Ultraboost 22 features a Primeknit upper that adapts to your foot and BOOST midsole technology that returns energy with every step. Perfect for long distance running.',
      'Adidas Ultraboost 22 có phần upper Primeknit thích ứng với bàn chân và công nghệ đệm giữa BOOST hoàn trả năng lượng với mỗi bước chạy. Hoàn hảo cho việc chạy đường dài.'
    ),
    sizes: ['39', '40', '41', '42', '43', '44'],
    specifications: [
      {
        key: createLocalizedString('Material', 'Chất liệu'),
        value: createLocalizedString('Primeknit Upper', 'Upper Primeknit')
      },
      {
        key: createLocalizedString('Sole Type', 'Loại đế'),
        value: createLocalizedString('Continental Rubber', 'Cao su Continental')
      },
      {
        key: createLocalizedString('Technology', 'Công nghệ'),
        value: createLocalizedString('BOOST Midsole', 'Đệm giữa BOOST')
      },
      {
        key: createLocalizedString('Drop', 'Độ chênh gót - mũi'),
        value: createLocalizedString('10mm', '10mm')
      }
    ],
    inStock: true,
    stock: 15,
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z'
  },
  {
    _id: '3',
    name: createLocalizedString(
      'Converse Chuck Taylor All Star',
      'Converse Chuck Taylor All Star'
    ),
    price: 800000,
    image: '/src/assets/shoe1.jpg',
    images: ['/src/assets/shoe1.jpg'],
    shortDescription: createLocalizedString(
      'Classic canvas sneakers with timeless style',
      'Giày sneaker canvas cổ điển với phong cách vượt thời gian'
    ),
    detailDescription: createLocalizedString(
      'The iconic Converse Chuck Taylor All Star features a durable canvas upper, metal eyelets, and the classic rubber toe cap. A timeless design that goes with everything.',
      'Converse Chuck Taylor All Star mang tính biểu tượng với phần upper canvas bền bỉ, lỗ kim loại và nắp mũi cao su cổ điển. Thiết kế vượt thời gian phù hợp với mọi trang phục.'
    ),
    sizes: ['36', '37', '38', '39', '40', '41', '42'],
    specifications: [
      {
        key: createLocalizedString('Material', 'Chất liệu'),
        value: createLocalizedString('Canvas Upper', 'Upper Canvas')
      },
      {
        key: createLocalizedString('Sole Type', 'Loại đế'),
        value: createLocalizedString('Rubber Sole', 'Đế cao su')
      },
      {
        key: createLocalizedString('Style', 'Phong cách'),
        value: createLocalizedString('High Top', 'Cổ cao')
      },
      {
        key: createLocalizedString('Closure', 'Kiểu đóng'),
        value: createLocalizedString('Lace-up', 'Buộc dây')
      }
    ],
    inStock: true,
    stock: 30,
    createdAt: '2025-01-03T00:00:00Z',
    updatedAt: '2025-01-03T00:00:00Z'
  }
];

export default mockProducts;
