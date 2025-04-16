<template>
  <v-container fluid class="pa-0 d-flex chat-layout-container">
    <!-- 채팅방 리스트 -->
    <!-- <v-sheet width="320" class="pa-4 chat-room-list" color="#121212" elevation="2">
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
    </v-sheet> -->

    <!-- 메시지 화면 -->
    <v-sheet class="chat-wrapper flex-grow-1 d-flex flex-column" color="#1e1e1e">
      <div ref="chatArea" class="chat-messages flex-grow-1 overflow-y-auto px-4 py-2">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="d-flex mb-2"
          :class="{
            'justify-end': msg.senderId === myId,
            'justify-start': msg.senderId !== myId,
          }"
        >
          <div
            class="pa-3 rounded-xl"
            :class="{
              'bg-blue text-white': msg.senderId === myId,
              'bg-grey-darken-2 text-white': msg.senderId !== myId,
            }"
            style="max-width: 55%; word-break: break-word"
          >
            {{ msg.message }}
          </div>
        </div>
      </div>

      <!-- 하단 입력창 -->
      <div class="chat-input d-flex align-center px-3 py-2">
        <v-text-field
          v-model="newMessage"
          density="comfortable"
          hide-details
          variant="outlined"
          placeholder="메시지 입력..."
          class="flex-grow-1 mr-2"
          @keyup.enter="sendMessage"
        />
        <v-btn icon color="primary" @click="sendMessage">
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </div>
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import { getBaseUrl } from '@/@core/composable/createUrl';
import { onMounted, ref, nextTick, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { io } from 'socket.io-client';
const socket = io('http://localhost:3001/chat');

const route = useRoute();
const router = useRouter();
const myId = Number(route.params.id);

const messages = ref<{ senderId: number; message: string }[]>([]);

const newMessage = ref('');
const chatArea = ref<HTMLElement | null>(null);

function sendMessage() {
  if (!newMessage.value.trim()) return;

  const message = {
    chat_room_id: Number(route.params.room_id),
    account_id: myId,
    message: newMessage.value,
  };

  socket.emit('sendMessage', message); // ✅ 이거 추가
  newMessage.value = '';
}

function scrollToBottom() {
  nextTick(() => {
    if (chatArea.value) {
      chatArea.value.scrollTop = chatArea.value.scrollHeight;
    }
  });
}

const allChatroom = ref<any[]>([]);

function goToChat(room_id: number) {
  router.push(`/chat/${myId}/${room_id}`);
}

const loadChatMessages = async () => {
  try {
    const res = await axios.post(`${getBaseUrl('DATA')}/chatmessage/list`, {
      chat_room_id: Number(route.params.room_id),
    });

    messages.value = res.data.datas.map((msg: any) => ({
      senderId: msg.account.id,
      message: msg.message,
    }));

    scrollToBottom();
  } catch (e) {
    console.error('기존 채팅 메시지 불러오기 실패', e);
  }
};

onMounted(async () => {
  socket.emit('joinRoom', {
    chat_room_id: Number(route.params.room_id), // route.params.room_id는 router에서 정의된 param
  });

  socket.on('receiveMessage', (msg) => {
    debugger;
    messages.value.push({
      senderId: msg.account.id,
      message: msg.message,
    });
    scrollToBottom();
  });

  debugger;
  await loadChatMessages();

  try {
    const response = await axios.post(`${getBaseUrl('DATA')}/chatroom/list`, {
      account_id: myId,
    });
    allChatroom.value = response.data.datas.map((item: any) => ({
      ...item,
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    }));
  } catch (error) {
    console.error('채팅방 목록 불러오기 실패:', error);
  }

  scrollToBottom();
});

onBeforeUnmount(() => {
  socket.off('receiveMessage');
});
</script>

<style scoped>
.chat-layout-container {
  height: 100vh;
  background-color: #121212;
  overflow: hidden; /* x, y 둘 다 제거 */
  margin-left: 256px;
  display: flex;
  max-width: calc(100vw - 256px); /* 좌측 drawer 제외한 최대 너비 제한 */
  box-sizing: border-box;
}

.chat-wrapper {
  background-color: #1e1e1e;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 1;
  min-width: 0;
  box-sizing: border-box;
  padding-right: 12px; /* 오른쪽 여백만 살짝 */
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
}

.chat-input {
  background-color: #1e1e1e;
  border-top: 1px solid #2a2a2a;
  padding: 8px 16px;
}

.chat-room-item {
  border-radius: 8px;
  cursor: pointer;
  padding: 8px 12px;
}

.chat-room-item:hover {
  background-color: #2a2a2a;
}
</style>
