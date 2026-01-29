import API from './api';

export const productsAPI = {
  getCategories: () => API.get('/products/categories/'),
  getCategory: (slug) => API.get(`/products/categories/${slug}/`),
  getProducts: (params) => API.get('/products/products/', { params }),
  getProduct: (slug) => API.get(`/products/products/${slug}/`),
  searchProducts: (query) => API.get('/products/search/', { params: { q: query } }),
  getColors: () => API.get('/products/colors/'),
  getSizes: () => API.get('/products/sizes/'),
  getBanners: () => API.get('/products/banners/'),
};