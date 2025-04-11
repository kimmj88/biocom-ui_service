<template>
  <v-container>
    <v-btn color="primary" @click="addPost">Add</v-btn>

    <div v-for="(post, index) in allPosts" :key="index">
      <v-card class="instagram-card" flat>
        <!-- 헤더 -->
        <v-card-title class="d-flex align-center justify-space-between px-3 py-2">
          <div class="d-flex align-center">
            <v-avatar size="32">
              <v-img :src="post.userAvatar" />
            </v-avatar>
            <div class="ml-3">
              <div class="text-subtitle-2 font-weight-medium">{{ post.account.name }}</div>
              <div class="text-caption text-grey-lighten-1">{{ post.created_at.slice(0, 10) }}</div>
            </div>
          </div>
          <v-icon size="20">mdi-dots-horizontal</v-icon>
        </v-card-title>

        <!-- 이미지 -->
        <v-img :src="post.image_url" height="400" cover />

        <!-- 액션 -->
        <v-card-actions class="px-3 py-2">
          <v-btn icon variant="text"><v-icon>mdi-heart-outline</v-icon></v-btn>
          <v-btn icon variant="text" @click="openDialog(post)"
            ><v-icon>mdi-comment-outline</v-icon></v-btn
          >
          <v-btn icon variant="text"><v-icon>mdi-share-outline</v-icon></v-btn>
          <v-spacer />
          <v-btn icon variant="text"><v-icon>mdi-bookmark-outline</v-icon></v-btn>
        </v-card-actions>

        <!-- 본문 -->
        <v-card-text class="px-3 py-0">
          <!-- <div class="text-subtitle-2 font-weight-medium">{{ post.likes }}명 좋아합니다</div> -->
          <div class="text-body-2">
            <!-- <span class="font-weight-medium">{{ post.username }}</span> -->
            {{ post.description }}
          </div>
          <div class="text-caption text-grey">댓글 {{ post.post_comments.length }}개 모두 보기</div>
        </v-card-text>
      </v-card>
    </div>

    <v-dialog v-model="commentDialog" max-width="900">
      <v-card style="max-height: 90vh">
        <v-row no-gutters>
          <!-- 왼쪽: 이미지 -->
          <v-col cols="6">
            <v-img
              v-if="selectedPost"
              :src="selectedPost.image_url"
              height="100%"
              cover
              style="object-fit: cover"
            />
          </v-col>

          <!-- 오른쪽: 댓글 -->
          <v-col cols="6" class="d-flex flex-column">
            <v-card-title class="text-h6">댓글</v-card-title>
            <v-divider />
            <v-card-text class="flex-grow-1 overflow-y-auto" style="max-height: 300px">
              <div v-for="(comment, index) in selectedPost.post_comments" :key="index" class="mb-2">
                <strong>{{ comment.account.name }}</strong
                >: {{ comment.message }}
              </div>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-text-field
                v-model="newComment"
                label="댓글 입력"
                variant="plain"
                class="flex-grow-1"
                density="compact"
              />
              <v-btn variant="text" @click="submitComment(selectedPost)">게시</v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { getBaseUrl } from '@/@core/composable/createUrl';
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useAccountStore } from '@/stores/useAccountStore';
import { usePostStore } from '@/stores/usePostSotre';

interface Post {
  username: string;
  userAvatar: string;
  time: string;
  image: string;
  likes: number;
  caption: string;
  comments: number;
}

interface PostOption {
  id: number;
  description: string;
  created_at: string;
  updated_at: string;
}

const posts = ref<Post[]>([]);
//const allPosts = ref<any[]>([]);
const allPosts = computed(() => postStore.posts);
const accountStore = useAccountStore();

function addPost() {
  posts.value.unshift({
    username: 'juliusdein',
    userAvatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    time: '방금 전',
    image: 'https://picsum.photos/800/600?random=' + Math.random(),
    likes: Math.floor(Math.random() * 1000) + 1,
    caption: 'New Post! #awesome',
    comments: Math.floor(Math.random() * 200),
  });
}

const commentDialog = ref(false);
const newComment = ref('');
const selectedPost = ref<any>(null);

function openDialog(post: any) {
  selectedPost.value = post;
  commentDialog.value = true;
}

async function submitComment(item: any) {
  if (!newComment.value.trim()) return;

  try {
    const response = await axios.post(`${getBaseUrl('DATA')}/postcomment/create`, {
      post_id: item.id,
      account_id: accountStore.id,
      message: newComment.value,
    });

    selectedPost.value.post_comments.unshift(response.data.datas); // 맨 앞에 추가
    newComment.value = '';
  } catch (error: any) {
    console.error('댓글 등록 실패:', error);
  }
}

const postStore = usePostStore();

onMounted(async () => {
  postStore.fetchPosts();
});
</script>

<style scoped>
.instagram-card {
  background-color: #121212;
  color: #fff;
  border-radius: 12px;
  max-width: 500px;
  margin: 20px auto;
}
</style>
