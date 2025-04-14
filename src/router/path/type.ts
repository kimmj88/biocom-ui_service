export const PROFILE_PATH = {
  MODIFY: (id: string | number = ':id') => `/profile/${id}`,
};

export const CART_PATH = {
  MODIFY: (id: string | number = ':id') => `/cart/${id}`,
};

export const SHOP_PATH = {
  VIEW: (id: string | number = ':id') => `/shop/${id}`,
};
