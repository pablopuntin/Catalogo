// import { api } from './api';

// type QuoteItem = {
//   productId: string;
//   quantity: number;
// };

// type CreateQuotePayload = {
//   items: QuoteItem[];
//   notes?: string;
// };

// export const quotesService = {
//   create: (payload: CreateQuotePayload) =>
//     api.post<void>('/quotes', payload),
// };


//ref
import { api } from './api';

type QuoteItem = {
  productId: string;
  quantity: number;
};

type CreateQuotePayload = {
  items: QuoteItem[];
  notes?: string;
};

export type QuoteMetrics = {
  today: number;
  week: number;
  month: number;
  topProducts: {
    productId: string;
    name: string;
    totalQuantity: number;
  }[];
};

export type Quote = {
  id: string;
  customerName: string | null;
  customerPhone: string | null;
  customerEmail: string | null;
  notes: string | null;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: string;
      brand: { name: string };
    };
  }[];
};

export const quotesService = {
  create: (payload: CreateQuotePayload) =>
    api.post<void>('/quotes', payload),

  findAll: (token: string) =>
    api.get<Quote[]>('/quotes', token),

  getMetrics: (
    token: string,
    params?: { from?: string; to?: string; limit?: number },
  ) => {
    const query = new URLSearchParams();
    if (params?.from) query.set('from', params.from);
    if (params?.to) query.set('to', params.to);
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    return api.get<QuoteMetrics>(
      `/quotes/metrics${qs ? `?${qs}` : ''}`,
      token,
    );
  },
};