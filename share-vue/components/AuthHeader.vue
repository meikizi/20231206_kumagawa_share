<template>
    <div class="auth-header">
      <div class="header__container">
        <img src="~/assets/image/logo.png" class="logo">
        <nav class="link-area">
          <ul class="menu-group">
            <li class="menu-item" v-if="!isLogin">
              <NuxtLink to="/register" class="link">新規登録</NuxtLink>
            </li>
            <li class="menu-item" v-if="!isLogin">
              <NuxtLink to="/login" class="link">ログイン</NuxtLink>
            </li>
            <li class="menu-item" v-if="isLogin">
              <button @click="logout" class="logout">ログアウト</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
</template>

<script>
// signInWithEmailAndPassword→EmailとPasswordでログインする為の関数
// signOut→ログアウトする為の関数
// onAuthStateChanged→現在ログインしているユーザーの監視・情報を取得する関数
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, } from '@firebase/auth';

import '~/assets/css/reset.css'
export default {
  data() {
    return {
      authInitialized: false,
      isLogin: false,
    };
  },
  methods: {
    async logout() {
      const auth = getAuth();
      await signOut(auth).then(() => {
        this.$router.replace("/login");
      }).catch((error) => {
        console.log(error);
      });
    },
  },
  async mounted () {
    const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
          // ユーザ登録やログイン、ログアウトをすることここが呼び出される。
          // ページをロードした直後もここが呼び出される。

          // ログイン中であっても、ページがいったん表示されてからここが呼び出されるようで、
          // 表示上は一瞬は未ログインの状態になってしまう。
          // 未ログインであれば user=null でここが呼び出される。
          this.isLogin = user;

          this.authInitialized = true; // 一瞬未ログイン状態で表示されてしまうのを防ぐためのフラグ
      });
  },
};
</script>
