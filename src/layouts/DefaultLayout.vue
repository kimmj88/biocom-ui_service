<template>
  <v-app>
    <v-container style="background-color: #1e1e2f; min-height: 60px" fluid>
      <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <img :src="logo" alt="로고" style="height: 70px" />
        </v-col>
        <!-- 오른쪽 유저메뉴 -->
        <v-col cols="auto">
          <v-menu>
            <template #activator="{ props }">
              <v-btn v-bind="props" color="primary" variant="text">
                <v-avatar size="28" class="mr-2">
                  <v-icon>mdi-account</v-icon>
                </v-avatar>
                <span class="text-body-2 font-weight-medium">{{ account_name }}</span>
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
      <v-navigation-drawer :width="251" permanent>
        <v-list-item title="Menu" subtitle="BIOCOM" />
        <v-divider />

        <v-list nav>
          <v-list-item title="Home" to="/home" link prepend-icon="mdi-home" />
          <!-- <v-list-item title="Search" link prepend-icon="mdi-magnify" /> -->
          <!-- <v-list-item title="Explore" link prepend-icon="mdi-compass-outline" /> -->
          <!-- <v-list-item title="Reels" link prepend-icon="mdi-filmstrip-box-multiple" /> -->
          <v-list-item title="Message" link prepend-icon="mdi-message-text-outline" />
          <v-list-item title="Notifications" link prepend-icon="mdi-heart-outline" />
          <v-list-item
            title="Add"
            link
            prepend-icon="mdi-plus-box-outline"
            @click="openAddPostDialog"
          />
          <v-list-item title="Profile" link prepend-icon="mdi-account-circle-outline" />
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <router-view />
      </v-main>
    </v-layout>
  </v-app>

  <v-dialog v-model="addPostDialog" max-width="600">
    <v-card>
      <v-card-title>새 게시물 만들기</v-card-title>
      <v-card-text>
        <v-img :src="newPost.image" height="300" cover class="mb-4" />

        <v-textarea v-model="newPost.description" label="설명 작성" rows="3" variant="outlined" />
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="grey" variant="text" @click="addPostDialog = false">취소</v-btn>
        <v-btn color="primary" variant="elevated" @click="submitNewPost">공유</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { getTokensByRefresh } from '@/@core/composable/commonApis';
import { getBaseUrl } from '@/@core/composable/createUrl';
import logo from '@/assets/biocom-logo-transparent-final.png';
import { useAccountStore } from '@/stores/useAccountStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePostStore } from '@/stores/usePostSotre';
import axios from 'axios';
import Cookies from 'js-cookie';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const account_name = ref<string>('');
const authStore = useAuthStore();
const accountStore = useAccountStore();

const router = useRouter();
async function logout() {
  Cookies.remove('refreshToken');
  authStore.logout();
  router.push('/login');
}

const addPostDialog = ref(false);
const newPost = ref({
  image: '',
  description: '',
});

function openAddPostDialog() {
  newPost.value = {
    image: 'https://picsum.photos/800/600?random=' + Math.random(),
    description: '',
  };
  addPostDialog.value = true;
}

const postStore = usePostStore();

async function submitNewPost() {
  if (!newPost.value.description.trim()) return;
  debugger;
  try {
    const response = await axios.post(`${getBaseUrl('DATA')}/post/create`, {
      creator_id: accountStore.id,
      description: newPost.value.description,
      image_url: newPost.value.image,
    });

    await postStore.fetchPosts();

    // 실제 게시물 목록에 바로 반영하려면 여기에 로직 추가 가능
    console.log('✅ 게시물 등록 성공:', response.data);
    addPostDialog.value = false;
    newPost.value.description = '';
  } catch (error) {
    console.error('❌ 게시물 등록 실패', error);
  }
}

onMounted(async () => {
  if (!authStore.idToken) {
    try {
      const tokens = await getTokensByRefresh(authStore);
      authStore.setTokens(tokens.idToken, tokens.accessToken);
    } catch (e) {
      console.error('idToken 재발급 실패', e);
    }
  }

  if (authStore.idToken) {
    try {
      const response = await axios.get(`${getBaseUrl('DATA')}/account/me`, {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      });

      accountStore.setAccount(
        response.data.datas.result.id,
        response.data.datas.result.email,
        response.data.datas.result.name
      );
      account_name.value = response.data.datas.result.name;
    } catch (e) {
      debugger;
      console.error('사용자 정보 요청 실패', e);
    }
  }
});
</script>
