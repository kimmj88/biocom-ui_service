<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-6" elevation="10" rounded="lg">
          <v-card-title class="text-h5 font-weight-bold justify-center"> Sign In </v-card-title>

          <v-card-text>
            <v-form ref="formRef" v-model="valid">
              <v-text-field v-model="email" label="E-mail" prepend-inner-icon="mdi-email" type="email" :rules="[rules.required, rules.email]" density="comfortable" required />
              <v-text-field v-model="password" label="Password" prepend-inner-icon="mdi-lock" type="password" :rules="[rules.required]" density="comfortable" required />

              <v-btn color="primary" block class="mt-4" @click="login"> Login </v-btn>

              <!-- 소셜 로그인 영역 -->
              <v-divider class="my-4" />

              <v-btn color="indigo-darken-2" class="mb-2" block @click="redirectToMicrosoft">
                <v-icon left>mdi-microsoft</v-icon>
                Microsoft
              </v-btn>

              <!-- 추후 구글 로그인 버튼 여기에 -->
              <!--
              <v-btn color="red" block @click="loginWithGoogle">
                <v-icon left>mdi-google</v-icon>
                Google 로그인
              </v-btn>
              -->
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-snackbar v-model="snackbar.visible" :color="'error'" timeout="3000">
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import { getBaseUrl } from '@/@core/composable/createUrl';

const router = useRouter();

const valid = ref(false);
const formRef = ref();

const email = ref('');
const password = ref('');

const snackbar = ref({
  visible: false,
  message: '',
});

const rules = {
  required: (v: string) => !!v || 'Required field.',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Enter a valid email address.',
};

async function redirectToMicrosoft() {
  location.href = `${getBaseUrl('AUTH')}/auth/redirect/microsoft`;
  Cookies.remove('accessToken');
  Cookies.remove('idToken');
}

async function login() {
  const { valid: isValid } = await formRef.value?.validate();
  if (!isValid) return;

  try {
    const response = await axios.post(
      `${getBaseUrl('AUTH')}/auth/signin`,
      {
        email: email.value,
        password: password.value,
      },
      { withCredentials: true }
    );

    if (response.data.result) {
      Cookies.remove('accessToken');
      Cookies.remove('idToken');
      router.push(response.data.redirectUrl);
    } else {
      snackbar.value.message = 'Invalid username or password.';
      snackbar.value.visible = true;
    }
  } catch (error) {
    console.error('기업 추가 실패:', error);
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
