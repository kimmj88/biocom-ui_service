<template>
  <v-container class="py-6" style="max-width: 960px">
    <!-- 상단: 유저 정보 -->
    <v-row>
      <v-col cols="3" class="text-center">
        <v-avatar size="100">
          <v-img :src="user.avatar" />
        </v-avatar>
        <div class="text-subtitle-2 mt-2">{{ accountStore.name }}</div>
      </v-col>
      <v-col cols="9" class="d-flex align-center">
        <div>
          <div class="d-flex align-center mb-2">
            <h3 class="mr-4">{{ accountStore.email }}</h3>
          </div>
          <div class="d-flex gap-4">
            <span>게시물 {{ posts.length }}</span>
            <span>팔로워 {{ user.followers }}</span>
            <span>팔로우 {{ user.following }}</span>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <!-- 게시물 그리드 -->
    <div v-if="!loading && posts.length">
      <v-row>
        <v-col v-for="(post, i) in posts" :key="i" cols="4">
          <v-img :src="post.image_url" height="300" cover class="rounded" />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAccountStore } from '@/stores/useAccountStore';
import { usePostStore } from '@/stores/usePostSotre';
import { useRoute } from 'vue-router';

const route = useRoute();
const accountStore = useAccountStore();
const postStore = usePostStore();

const user = ref({
  name: '김민재',
  username: 'daialop88',
  avatar: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 99)}.jpg`,
  followers: 59,
  following: 76,
});
const loading = ref(true);
const posts = computed(() => postStore.posts);

onMounted(async () => {
  loading.value = true;
  const id = Number(route.params.id); // path에서 :id 추출
  if (!isNaN(id)) {
    await postStore.fetchPostsByUserId(id);
  }
  loading.value = false;
});
</script>

<style scoped>
.gap-4 > * {
  margin-right: 20px;
}
</style>
