export interface ShippingFee {
  _id: string;
  country: string;
  baseFee: number;
  perKgRate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingFeeChoice {
  _id: string;
  country: string;
  baseFee: number;
  perKgRate: number;
}