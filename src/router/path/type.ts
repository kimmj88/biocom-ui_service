export const PROFILE_PATH = {
  MODIFY: (id: string | number = ':id') => `/profile/${id}`,
};

export const CART_PATH = {
  MODIFY: (id: string | number = ':id') => `/cart/${id}`,
};

export const SHOP_PATH = {
  VIEW: (id: string | number = ':id') => `/shop/${id}`,
};

export const CHAT_PATH = {
  VIEW: (id: string | number = ':id') => `/chat/${id}`,
  ROOM: (id: string | number = ':id', room_id: string | number = ':room_id') =>
    `/chat/${id}/${room_id}`,
};
