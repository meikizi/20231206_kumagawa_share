<template>
  <div class="side-nav">
    <img src="~/assets/image/logo.png" class="logo">
    <br />
    <p class="home-link">
      <NuxtLink to="/">
        <img src="~/assets/image/home.png" class="home">
        <span class="text">ホーム</span>
      </NuxtLink>
    </p>
    <br />
    <p class="logout-link" @click="logout">
      <img src="~/assets/image/logout.png" class="logout">
      <span class="text">ログアウト</span>
    </p>
    <validation-observer ref="obs" v-slot="ObserverProps">
    <validation-provider v-slot="{ errors }" rules="required|max:120">
      <label>
        シェア
        <br />
        <textarea v-model="post" class="textarea--post" type="text" name="post"></textarea>
      </label>
      <div class="error">{{ errors[0] }}</div>
    </validation-provider>
    <button @click="insertPost" class="nav-btn" :disabled="ObserverProps.invalid || !ObserverProps.validated">シェアする</button>
    </validation-observer>
  </div>
</template>

<script>
import { getAuth, signOut,} from '@firebase/auth';

export default {
  data() {
    return {
      post: "",
    };
  },
  props: ["user_uid"],
  methods: {
    async logout() {
      const auth = getAuth();
      await signOut(auth).then(() => {
        this.$router.replace("/login");
      }).catch((error) => {
        console.log(error);
      });
    },
    async insertPost() {
      const sendData = {
        user_uid: this.user_uid,
        post: this.post,
      };
      const url = `/api/`
      await this.$axios.post(url, sendData);
      location.reload();
    },
  },
};
</script>
