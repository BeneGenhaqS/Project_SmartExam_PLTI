<template>
  <v-app>
    <v-layout>
      <v-app-bar color="primary" id="headerApp">
        <template v-slot:prepend>
          <v-img src="@/assets/logo-mini.png" :width="64"></v-img>
        </template>

        <v-app-bar-title class="LeagueFont">Smart Exam</v-app-bar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="logout" v-if="userStore.user !== null && toggleLogout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-app-bar>

      <v-main class="main-body bg-grey-lighten-4" >
        <router-view /> 
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { signOut } from "firebase/auth";
import { auth } from '@/plugins/firebase'
import { useUserStore } from '@/store/user';
import { get } from '@/plugins/firebasedb';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const user = ref(null)
const logout = async () => {
  // load user
  let userLogin = await get('/users', 'email', userStore.user.email);
  let idUser = Object.keys(userLogin)[0]
  user.value = userLogin[idUser]
  if(user.value.level_user_key === '-NQUa76pkOfJQB8mJuDb' && route.path !== '/unduh-safeexambrowser'){
    await signOut(auth)
    router.replace('/login-peserta')
    return;
  }

  await signOut(auth)
  router.replace('/beranda')
}

// https://www.w3schools.com/howto/howto_js_sticky_header.asp
const keepSticky = () => {
  var header = document.getElementById("headerApp");
  var sticky = header.offsetTop;

  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

const toggleLogout = ref(true)
const emitter = inject('emitter')
emitter.on('toggleLogout', (val)=>{
  toggleLogout.value = val
})

onMounted(()=>{
  window.addEventListener('scroll', keepSticky)
})

onUnmounted(()=>{
  window.removeEventListener('scroll', keepSticky)
})




</script>

<style>
.main-body{
  /* height: calc(100% - 64px); */
  width: 100%;
}
.sticky {
  position: fixed !important;
  top: 0;
  width: 100%
}
</style>
