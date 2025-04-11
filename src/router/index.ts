/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto';
import { routes } from 'vue-router/auto-routes';
import Home from '@/pages/Home.vue';
import Profile from '@/pages/Profile.vue';
//DefaultLayout
import DefaultLayout from '@/layouts/DefaultLayout.vue';

//Login
import Login from '@/pages/login/index.vue';

import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/stores/useAuthStore';

import { getBaseUrl } from '@/@core/composable/createUrl';
import { PROFILE_PATH } from './path/type';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: Login, // ❗ 로그인은 레이아웃 없이 단독으로
    },
    {
      path: '/',
      component: DefaultLayout,
      children: [
        { path: '/home', component: Home },
        //{ path: '/profile', component: Profile },
        { path: PROFILE_PATH.MODIFY(':id').slice(1), component: Profile, props: true },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  const refreshToken = Cookies.get('refreshToken');
  let accessToken = auth.$state.accessToken || null;
  let idToken = auth.$state.idToken || null;

  Cookies.remove('accessToken');
  Cookies.remove('idToken');

  if (to.path === '/login') {
    if (refreshToken) {
      return next('/');
    }
    return next();
  }

  if (refreshToken && (!accessToken || !idToken)) {
    try {
      const res = await axios.post(
        `${getBaseUrl('AUTH')}/auth/refresh-token/microsoft`,
        { refreshToken },
        { withCredentials: true }
      );

      accessToken = res.data.accessToken;
      idToken = res.data.idToken;
      auth.setTokens(idToken as string, accessToken as string);
    } catch (error) {
      console.error('토큰 재발급 실패:', error);
      return next('/login');
    }
  }

  // ✅ 토큰이 유효하면 요청 페이지로 계속 진행
  if (accessToken && idToken) {
    return next();
  }

  // ✅ 토큰이 없는 경우 로그인 페이지로 이동
  return next('/login');
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

export default router;
