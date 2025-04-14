<!-- src/pages/PaymentComplete.vue -->
<template>
  <v-container
    class="d-flex flex-column align-center justify-center text-center"
    style="height: 80vh"
  >
    <v-icon size="64" color="green">mdi-check-circle-outline</v-icon>
    <h2 class="mt-4 mb-2">결제가 완료되었습니다</h2>
    <p class="text-grey text-body-2 mb-6">주문이 성공적으로 접수되었습니다.</p>
    <v-btn color="primary" @click="goToShop">쇼핑 계속하기</v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goToShop() {
  router.push('/shop');
}
</script>
