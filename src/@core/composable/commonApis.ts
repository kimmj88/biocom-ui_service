import Cookies from 'js-cookie';
import { getBaseUrl } from './createUrl';
import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

interface Tokens {
  idToken: string;
  accessToken: string;
}

export async function getTokensByRefresh(
  authStore: ReturnType<typeof useAuthStore>
): Promise<Tokens> {
  const refreshToken = Cookies.get('refreshToken');
  let tokens: Tokens = { idToken: '', accessToken: '' };
  try {
    const res = await axios.post(
      `${getBaseUrl('AUTH')}/auth/refresh-token/microsoft`,
      { refreshToken },
      { withCredentials: true }
    );

    tokens = { accessToken: res.data.accessToken as string, idToken: res.data.idToken as string };
    authStore.setTokens(res.data.accessToken, res.data.idToken);

    return tokens;
  } catch (error) {
    return tokens;
  }
}
