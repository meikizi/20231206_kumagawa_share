import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, } from '@firebase/auth';

const middleware = ({ route, store, redirect }) => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    // ログインしていなければ、 /login へリダイレクトする
    if (!user && route.name !== 'login') {
      if (route.name !== 'register') redirect('/login')
    }
  })
}

export default middleware
