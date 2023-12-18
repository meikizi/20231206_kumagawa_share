<template>
    <div class="index">
      {{user}}
        <SideNav :user_uid="user_uid"></SideNav>
        <div class="index__container">
          <h2 class="index-title">ホーム</h2>
          <Message></Message>
        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged, } from '@firebase/auth';

import '~/assets/css/reset.css'
import '~/assets/css/index.css'
import '~/assets/css/nav.css'
import '~/assets/css/message.css'

export default {
  data() {
    return {
      authInitialized: false,
      user_uid: "",
    };
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user_uid = user.uid;
        this.authInitialized = true;
      }
    });
  },
}
</script>
