<template>
  <v-container fluid class="pa-4 ml-drawer">
    <v-row>
      <v-col v-for="product in allProduct" :key="product.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="product-card" elevation="2" @click="goToDetail(product.id)">
          <v-img :src="product.image" height="200" cover />

          <v-card-title class="text-subtitle-1 font-weight-medium">
            {{ product.name }}
          </v-card-title>

          <v-card-text class="text-body-2">
            <div v-if="product.original_price !== product.final_price">
              <s class="text-grey text-caption mr-2"
                >{{ product.original_price.toLocaleString() }} 원</s
              >
              <span class="text-red">{{ product.final_price.toLocaleString() }} 원</span>
            </div>
            <div v-else>{{ product.original_price.toLocaleString() }} 원</div>
          </v-card-text>

          <v-card-actions class="justify-end">
            <v-btn size="small" color="primary" @click.stop="buyNow(product.id)">구매하기</v-btn>
            <v-btn size="small" color="secondary" @click.stop="addToCart(product.id)"
              >장바구니</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { getBaseUrl } from '@/@core/composable/createUrl';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/stores/useAccountStore';
const accountStore = useAccountStore();

const router = useRouter();
const allProduct = ref<any[]>([]);

onMounted(async () => {
  try {
    const response = await axios.get(`${getBaseUrl('DATA')}/product/all`);
    allProduct.value = response.data.datas.map((item: any) => ({
      ...item,
    }));
  } catch (error) {
    console.error('상품 목록 불러오기 실패:', error);
  }
});

function goToDetail(id: number) {
  router.push(`/product/${id}`);
}

function buyNow(id: number) {
  console.log(`🛒 즉시 구매: 상품 ID ${id}`);
  // 구매 로직 또는 페이지 이동
}

async function addToCart(product_id: number) {
  try {
    const res = await axios.post(`${getBaseUrl('DATA')}/cart/create`, {
      account_id: accountStore.id,
      product_id: product_id,
    });
    console.log(`🛒 장바구니 담기 성공`);
  } catch (error) {
    console.error('상품 목록 불러오기 실패:', error);
  }

  // 장바구니 추가 API 호출 등
}
</script>

<style scoped>
.product-card {
  border-radius: 12px;
  transition: transform 0.2s ease;
  cursor: pointer;
}
.product-card:hover {
  transform: translateY(-4px);
}
.ml-drawer {
  margin-left: 260px;
}
.text-red {
  color: #f44336;
  font-weight: bold;
}
</style>
