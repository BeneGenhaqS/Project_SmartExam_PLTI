// Style
import './assets/style.css'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

import { onAuthStateChanged } from '@firebase/auth';
import { auth } from '@/plugins/firebase';
import { useUserStore } from './store/user';

// emitter
import mitt from 'mitt'
const emitter = mitt()

let app = '';
let storeUser = '';
onAuthStateChanged(auth, async (user) => {
  if(!app){
    app = createApp(App)
    registerPlugins(app)
    storeUser = useUserStore();
    app.provide('emitter', emitter)
    app.mount('#app')
  }
  
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    console.log('signed in')
    storeUser.$patch({ user: user })
    // ...
  } else {
    // User is signed out
    // ...
    console.log('signed out')
    localStorage.removeItem('user_profile')
    storeUser.$patch({ user: null })
  }
});


