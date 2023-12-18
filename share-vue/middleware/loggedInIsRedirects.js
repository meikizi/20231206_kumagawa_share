import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, } from '@firebase/auth';

const middleware = ({ route, store, redirect }) => {
  const auth = getAuth();
  const loggedInUserNotAccess = ['login', 'register'];
  onAuthStateChanged(auth, (user) => {
    // ログイン後ユーザーのリダイレクト処理
    if (user && loggedInUserNotAccess.includes(route.name)) redirect('/')
  })
}

export default middleware
