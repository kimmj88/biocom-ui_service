<template>
  <v-app>
    <v-container style="background-color: #1e1e2f; min-height: 60px" fluid>
      <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <img :src="logo" alt="로고" style="height: 40px; filter: invert(1) brightness(2)" />
        </v-col>
        <!-- 오른쪽 유저메뉴 -->
        <v-col cols="auto">
          <v-menu>
            <template #activator="{ props }">
              <v-btn v-bind="props" color="primary" variant="text">
                <v-avatar size="28" class="mr-2">
                  <v-icon>mdi-account</v-icon>
                </v-avatar>
                <span class="text-body-2 font-weight-medium">김민재</span>
                <v-icon right size="18">mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item title="설정" @click="" />
              <v-list-item title="로그아웃" @click="logout" />
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-container>
    <v-layout>
      <v-main>
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>

<script lang="ts" setup>
import logo from '@/assets/CI_AUTOCRYPT.png';
import { useAuthStore } from '@/stores/useAuthStore';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();
async function logout() {
  Cookies.remove('refreshToken');
  auth.logout();
  router.push('/login');
}
</script>
