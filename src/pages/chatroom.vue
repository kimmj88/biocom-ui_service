<template>
  <v-container fluid class="pa-0 d-flex chat-layout-container">
    <!-- 채팅방 리스트 -->
    <v-sheet width="320" class="pa-4" color="#121212" elevation="2">
      <h3 class="text-white text-subtitle-1 mb-4">메시지</h3>
      <v-list density="compact" nav>
        <v-list-item
          v-for="room in allChatroom"
          :key="room.id"
          @click="goToChat(room.id)"
          class="chat-room-item"
        >
          <template #prepend>
            <v-avatar size="48">
              <v-img :src="room.avatar" />
            </v-avatar>
          </template>

          <v-list-item-title class="text-white text-body-2">
            {{ room.name }}
          </v-list-item-title>

          <v-list-item-subtitle class="text-grey-lighten-1 text-caption">
            {{ room.last_message }}
          </v-list-item-subtitle>

          <template #append>
            <div class="text-grey-lighten-1 text-caption ml-2">
              {{ room.last_time }}
            </div>
          </template>
        </v-list-item>
      </v-list>
    </v-sheet>

    <!-- 오른쪽: 선택 전 메시지 -->
    <v-sheet class="d-flex align-center justify-center flex-grow-1" color="#1e1e1e">
      <div class="text-center">
        <v-icon size="64" color="grey">mdi-message-text-outline</v-icon>
        <p class="mt-4 text-grey">대화를 시작하려면 채팅방을 선택하세요</p>
      </div>
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import { getBaseUrl } from '@/@core/composable/createUrl';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();

const router = useRouter();

const chatRooms = ref([
  {
    id: 1,
    name: 'eunsol jeong',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    lastMessage: '안녕하세요',
    time: '1분 전',
  },
  {
    id: 2,
    name: '대전미용실 유상구...',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    lastMessage: '오늘 시간 되시나요?',
    time: '14분 전',
  },
  {
    id: 3,
    name: '이자은',
    avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
    lastMessage: '콤콤 • 3년',
    time: '3년 전',
  },
  {
    id: 3,
    name: '대전미용실 유상구...',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    lastMessage: '오늘 시간 되시나요?',
    time: '14분 전',
  },
  {
    id: 4,
    name: '대전미용실 유상구...',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    lastMessage: '오늘 시간 되시나요?',
    time: '14분 전',
  },
]);

function goToChat(room_id: number) {
  router.push(`/chat/${Number(route.params.id)}/${room_id}`);
}

const allChatroom = ref<any[]>([]);

onMounted(async () => {
  try {
    debugger;
    const response = await axios.post(`${getBaseUrl('DATA')}/chatroom/list`, {
      account_id: Number(route.params.id),
    });
    allChatroom.value = response.data.datas.map((item: any) => ({
      ...item,
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    }));
  } catch (error) {
    console.error('상품 목록 불러오기 실패:', error);
  }
});
</script>

<style scoped>
.chat-room-item {
  border-radius: 8px;
  cursor: pointer;
  padding: 8px 12px;
}
.chat-room-item:hover {
  background-color: #2a2a2a;
}
.chat-layout-container {
  margin-left: 251px; /* drawer width와 동일하게 */
}
</style>
