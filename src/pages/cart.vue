<template>
  <v-container class="pa-6">
    <v-row class="align-center justify-space-between mb-4">
      <h2 class="text-h5 font-weight-bold">카트</h2>
      <v-btn variant="text" color="primary" to="/shop">쇼핑 계속하기</v-btn>
    </v-row>

    <v-divider class="mb-6" />

    <v-row v-for="item in allCart" :key="item.id" class="mb-6">
      <v-col cols="12" md="8" class="d-flex">
        <v-img :src="item.image" height="100" width="100" class="mr-4" />
        <div>
          <div class="text-body-1 font-weight-medium">{{ item.name }}</div>
          <div class="text-caption">
            <template v-if="item.original_price !== item.final_price">
              <s class="text-grey text-caption mr-2">
                {{ item.original_price.toLocaleString() }} 원
              </s>
              <span class="text-red"> {{ item.final_price.toLocaleString() }} 원 </span>
            </template>
            <template v-else> {{ item.final_price.toLocaleString() }} 원 </template>
          </div>
        </div>
      </v-col>

      <v-col cols="6" md="2" class="d-flex align-center">
        <v-btn icon variant="outlined" @click="decrease(item)"><v-icon>mdi-minus</v-icon></v-btn>
        <div class="mx-2">{{ item.quantity }}</div>
        <v-btn icon variant="outlined" @click="increase(item)"><v-icon>mdi-plus</v-icon></v-btn>
      </v-col>

      <v-col cols="6" md="2" class="d-flex align-center justify-end">
        <div class="mr-4">{{ item.final_price * item.quantity }} 원</div>
        <v-btn icon @click="removeItem(item)"><v-icon color="red">mdi-delete</v-icon></v-btn>
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <v-row class="justify-end">
      <v-col cols="12" md="4" class="text-right">
        <div class="mb-2">
          <span class="font-weight-medium">예상 총액</span>
          <span class="ml-2">{{ totalPrice }} 원</span>
        </div>
        <div class="text-caption text-grey mb-4">
          결제 시 세금, 할인 및 <span class="text-decoration-underline">배송료</span>가 계산됩니다.
        </div>
        <v-btn @click="paymentItem()" color="warning" block to="/payment">결제</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { getBaseUrl } from '@/@core/composable/createUrl';
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { useAccountStore } from '@/stores/useAccountStore';
const accountStore = useAccountStore();

const cartItems = ref([
  {
    id: 1,
    title: '# 5 Persian by st diagrams+photodiagrams',
    price: 6.0,
    image: 'https://picsum.photos/100?random=1',
    quantity: 1,
  },
  {
    id: 2,
    title: '# 5 Persian by st paper package [Paperback + Digital Edition]',
    price: 6.0,
    image: 'https://picsum.photos/100?random=2',
    quantity: 1,
  },
]);

const increase = (item: any) => {
  item.quantity++;
};

const decrease = (item: any) => {
  if (item.quantity > 1) item.quantity--;
};

const removeItem = async (item: any) => {
  allCart.value = allCart.value.filter((i) => i.id !== item.id);
  const response = await axios.post(`${getBaseUrl('DATA')}/cart/delete`, {
    id: item.id,
  });
};

const paymentItem = async () => {
  try {
    for (const item of allCart.value) {
      await axios.post(`${getBaseUrl('DATA')}/receipt/create`, {
        id: item.id,
        account_id: accountStore.id,
        product_id: item.product_id,
        quantity: item.quantity,
        discount_type: item.discount_type,
        discount_value: item.discount_value,
      });

      await removeItem(item);
    }

    console.log('✅ 결제 정보 생성 완료');
    // 결제 완료 페이지로 이동 등
  } catch (error) {
    console.error('❌ 결제 처리 중 오류 발생:', error);
  }
};

const totalPrice = computed(() => {
  return allCart.value.reduce((sum, item) => sum + item.final_price * item.quantity, 0);
});

const allCart = ref<any[]>([]);

onMounted(async () => {
  try {
    const response = await axios.post(`${getBaseUrl('DATA')}/cart/list`, {
      account_id: accountStore.id,
    });
    allCart.value = response.data.datas.map((item: any) => ({
      ...item,
      quantity: 1,
    }));
    console.log('카트 불러오기');
  } catch (error) {
    console.error('상품 목록 불러오기 실패:', error);
  }
});
</script>

<style scoped>
.text-right {
  text-align: right;
}
</style>
