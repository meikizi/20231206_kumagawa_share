<template>
  <div class="register">
    <AuthHeader></AuthHeader>
    <div class="register__container">
      <h1 class="register-title">新規登録</h1>
      <validation-observer ref="obs" v-slot="ObserverProps">
        <validation-provider v-slot="{ errors }" rules="required|max:20">
          <input v-model="name" class="name" type="text" name="name" placeholder="ユーザーネーム" />
          <div class="error">{{ errors[0] }}</div>
        </validation-provider>
          <input v-model="email" class="email" type="email" name="email" placeholder="メールアドレス" />
          <input v-model="password" class="password" type="password" name="password" placeholder="パスワード" />
        <button @click="register" class="register-btn" :disabled="ObserverProps.invalid || !ObserverProps.validated">新規登録</button>
      </validation-observer>
    </div>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from '@firebase/auth';
import AuthHeader from "../components/AuthHeader"
import '~/assets/css/register.css'
import '~/assets/css/header.css'

export default {
  name: 'RegisterPage',
  data() {
    return {
      name: null,
      email: null,
      password: null,
    };
  },
  methods: {
    async register() {
      if (!this.email || !this.password) {
        alert("メールアドレスまたはパスワードが入力されていません。");
        return;
      }
      // Firebaseにユーザーを登録して、その認証情報(ユーザーUIDなど)を取得する。
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password)
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-email":
            alert("メールアドレスの形式が違います。");
            break;
          case "auth/email-already-exists":
            alert("このメールアドレスはすでに使われています。");
            break;
          case "auth/weak-password":
            alert("パスワードは6文字以上で入力してください。");
            break;
          default:
            alert("エラーが起きました。しばらくしてから再度お試しください。");
            break;
        }
        location.reload();
      });
      // Laravelに送信する用のuserオブジェクトを作成する。
      const user = {
        name: this.name,
        uid: userCredential.user.uid,
      };

      // CSRF保護の初期化とXSRF-TOKENクッキーの取得
      await this.$axios.get('sanctum/csrf-cookie');
      const url = `/api/auth/login/`
      await this.$axios.post(url, user);

      //Nuxt.jsでログイン処理
      await this.$auth.loginWith('laravelSanctum', {
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
