<template>
    <div class="post">
        <SideNav :user_uid="user_uid"></SideNav>
        <div class="post__container">
          <h2 class="post-title">コメント</h2>
          <Message :user_uid="user_uid"></Message>
          <div class="comment__area">
            <h3 class="comment-title">コメント</h3>
            <div class="comments">
              <ul>
                <li v-for="comments in commentLists" :key="comments.id" class="comment-list">
                  <p class="comments-username">{{ comments.name }}</p>
                  <p class="comments-text">{{ comments.comment }}</p>
                </li>
              </ul>
            </div>
            <div class="comment-post">
              <validation-observer ref="obs" v-slot="ObserverProps">
              <validation-provider v-slot="{ errors }" rules="required|max:120">
                <input v-model="comment" class="input--comment" type="text" name="comment">
                <div class="error">{{ errors[0] }}</div>
              </validation-provider>
              <button @click="insertComment" class="comment-btn" :disabled="ObserverProps.invalid || !ObserverProps.validated">コメント</button>
              </validation-observer>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged, } from '@firebase/auth';

import '~/assets/css/reset.css'
import '~/assets/css/post.css'
import '~/assets/css/nav.css'
import '~/assets/css/message.css'
export default {
  data() {
    return {
      authInitialized: false,
      user_uid: "",
      post_id: this.$route.params.id,
      comment: "",
      commentLists: [],
    };
  },
  methods: {
    async getComment() {
      const url = `/api/comments/`
      const post_id = this.post_id
      const postsDate = await this.$axios.get(url + post_id);
      this.commentLists = postsDate.data.comments;
      console.log(this.commentLists)
    },
    async insertComment() {
      const sendData = {
        user_uid: this.user_uid,
        post_id: this.post_id,
        comment: this.comment,
      };
      const url = `/api/comments/`
      await this.$axios.post(url, sendData);
      location.reload();
    },
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user_uid = user.uid;
        this.authInitialized = true;
      }
    })
    this.getComment();
  },
  validate ({ params }){
    return /^\d+$/.test(params.id)
  },
};
</script>
