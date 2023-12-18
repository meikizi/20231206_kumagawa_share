<template>
  <div class="login">
    <AuthHeader></AuthHeader>
    <div class="login__container">
      <h1 class="login-title">ログイン</h1>
      <input v-model="email" class="email" id="email" type="email" name="email" placeholder="メールアドレス" />
      <input v-model="password" class="password" id="password" type="password" name="password" placeholder="パスワード" />
      <button @click="login" class="login-btn">ログイン</button>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from '@firebase/auth';
import AuthHeader from "../components/AuthHeader"
import '~/assets/css/login.css'
import '~/assets/css/header.css'

export default {
  name: 'LoginPage',
  data() {
    return {
      email: null,
      password: null,
    };
  },
  methods: {
    // メールアドレスでログイン
    async login() {
      if (!this.email || !this.password) {
        alert('メールアドレスまたはパスワードが入力されていません。')
        return
      }
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password)
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
          alert('メールアドレスの形式が違います。')
          break
          case 'auth/user-disabled':
          alert('ユーザーが無効になっています。')
          break
          case 'auth/user-not-found':
          alert('ユーザーが存在しません。')
          break
          case 'auth/wrong-password':
          alert('パスワードが間違っております。')
          break
          default:
          alert('エラーが起きました。しばらくしてから再度お試しください。')
          break
        }
        location.reload();
      });
      const user = {
        uid: userCredential.user.uid,
      };

      await this.$axios.get('sanctum/csrf-cookie');

      this.$auth.loginWith('laravelSanctum', {
        withCredential: true,
        data: user,
      });

      this.$router.push('/')
    },
  },
  components: {
    AuthHeader,
  },
  middleware: 'loggedInIsRedirects',
}
</script>
