import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { getBaseUrl } from '@/@core/composable/createUrl';

export const usePostStore = defineStore('post', () => {
  const posts = ref<any[]>([]);

  async function fetchPosts() {
    const res = await axios.get(`${getBaseUrl('DATA')}/post/all`);
    posts.value = res.data.datas.map((item: any) => ({
      ...item,
      userAvatar: `https://randomuser.me/api/portraits/men/${
        Math.floor(Math.random() * 99) + 1
      }.jpg`,
    }));
  }

  function prependPost(post: any) {
    posts.value.unshift(post);
  }

  return { posts, fetchPosts, prependPost };
});
