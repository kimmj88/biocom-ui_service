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
      userAvatar: getRandomAvatar(),
    }));
  }

  async function fetchPostsByUserId(creator_id: number) {
    const res = await axios.post(`${getBaseUrl('DATA')}/post/list`, { creator_id: creator_id });
    posts.value = res.data.datas.map((item: any) => ({
      ...item,
      userAvatar: getRandomAvatar(),
    }));
  }

  function prependPost(post: any) {
    posts.value.unshift(post);
  }

  function clearPosts() {
    posts.value = [];
  }

  function getRandomAvatar() {
    return `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 99) + 1}.jpg`;
  }

  return { posts, fetchPosts, fetchPostsByUserId, prependPost, clearPosts };
});
