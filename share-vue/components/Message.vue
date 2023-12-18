<template>
    <div class="message">
      <ul v-if="home">
        <li v-for="post in postLists" :key="post.id" class="message-list">
          <div class="message__container">
            <p class="user-name">{{ post.name }}</p>
            <ul>
              <li v-for="likes in likesLists" :key="likes">
                <button v-if="likes.like === 0 && likes.post_id === post.id" @click="like(user_uid, post.id)" class="btn"><img src="~/assets/image/heart.png" class="like"></button>
                <button v-if="likes.like !== 0 && likes.post_id === post.id" @click="deleteLike(user_uid, post.id)" class="btn"><img src="~/assets/image/heart.png" class="like"></button>
                <span v-if="likes.post_id === post.id" class="like-counts">{{ likes.likes_count }}</span>
              </li>
            </ul>
            <button v-if="post.user_uid === user_uid" @click="deletePost(post.id)" class="btn"><img src="~/assets/image/cross.png" class="cross"></button>
            <NuxtLink :to="/posts/ + post.id" class="link"><img src="~/assets/image/detail.png" class="detail"></NuxtLink>
          </div>
          <p class="message-text">{{ post.post }}</p>
        </li>
      </ul>
      <div v-if="!home && postList !== ''" class="message-detail">
        <div class="message__container">
          <p class="user-name">{{ postList.name }}</p>
          <button v-if="likeList.like === 0" @click="like(user_uid, postList.id)" class="btn"><img src="~/assets/image/heart.png" class="like"></button>
          <button v-if="likeList.like !== 0" @click="deleteLike(user_uid, postList.id)" class="btn"><img src="~/assets/image/heart.png" class="like"></button>
          <span class="like-counts">{{ likeList.likes_count }}</span>
          <button v-if="postList.user_uid === user_uid" @click="deletePost(postList.id)" class="btn"><img src="~/assets/image/cross.png" class="cross"></button>
        </div>
        <p class="message-text">{{ postList.post }}</p>
      </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged, } from '@firebase/auth';
export default {
  data() {
    return {
      authInitialized: false,
      user_uid: "",
      postLists: [],
      post_id: this.$route.params.id,
      likesCountsLists: [],
      postList: "",
      likeList: "",
      like_user_id: "",
    };
  },
  methods: {
    async getData() {
      const url = `/api/`
      const user_uid = this.user_uid
      const postsDate = await this.$axios.get(url + user_uid);
      this.postLists = postsDate.data.posts;
      this.likesLists = postsDate.data.likes;
    },
    async getDetailData() {
      const url = `/api/posts/`
      const user_uid = this.user_uid
      const post_id = this.post_id
      const postsDate = await this.$axios.get(url + user_uid + "/" + post_id);
      this.postList = postsDate.data.post;
      this.likeList = postsDate.data.like_list;
      this.like_user_uid = this.likeList.like.user_uid;
    },
    async like(user_uid, post_id) {
      const url = `/api/like/`
      await this.$axios.post(url + user_uid + "/" + post_id);
      this.getData();
      this.getDetailData();
    },
    async deleteLike(user_uid, post_id) {
      const url = `/api/unlike/`
      await this.$axios.delete(url + user_uid + "/" + post_id);
      this.getData();
      this.getDetailData();
    },
    async deletePost(post_id) {
      const url = `/api/`
      await this.$axios.delete(url + post_id);
      location.reload();
    },
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user_uid = user.uid;
        this.authInitialized = true;
        this.getData();
        this.getDetailData();
      }
    });
  },
  computed: {
    home() {
      return $nuxt.$route.path.match(/\/$/);
    }
  },
};
</script>
