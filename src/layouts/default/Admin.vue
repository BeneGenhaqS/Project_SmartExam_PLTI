<template>
  <v-app>
    <v-layout>
      <v-app-bar color="primary" id="headerApp">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-app-bar-title class="LeagueFont">Smart Exam</v-app-bar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        location="left"
      >
        <v-list>
          <v-list-item
            :prepend-avatar="profile"
            :title="nama"
            :subtitle="entitas"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list nav>
          <!-- <v-list-item v-if="level_user_key !== '' && level_user_key!=='-NQUa76pkOfJQB8mJuDb'" active-color="primary" prepend-icon="mdi-view-dashboard" title="Dashboard" to="/dashboard"></v-list-item> -->
          <v-list-item v-if="level_user_key !== '' && level_user_key!=='-NQUa76pkOfJQB8mJuDb'" :active="route.path.includes('/hasil-ujian') || route.path.includes('/editor-soal') || route.path.includes('/kelola-ujian')" active-color="primary" prepend-icon="mdi-chair-school" title="Kelola Ujian" to="/kelola-ujian"></v-list-item>
          <v-list-item v-if="level_user_key !== '' && level_user_key!=='-NQUa76pkOfJQB8mJuDb'" active-color="primary" prepend-icon="mdi-google-classroom" title="Kelola Kelas" to="/kelola-kelas"></v-list-item>
          <v-list-item v-if="level_user_key !== '' && level_user_key!=='-NQUa76pkOfJQB8mJuDb'" active-color="primary" prepend-icon="mdi-account-school" title="Kelola Peserta" to="/kelola-peserta"></v-list-item>
          <v-list-item v-if="level_user_key !== '' && (level_user_key==='-NQUa75BeXo4mHE4ONGv' || level_user_key==='-NQUa75p8J8UkcdGKgpS')" active-color="primary" prepend-icon="mdi-account-cog" title="Kelola Admin" to="/kelola-admin"></v-list-item>
          <v-list-item v-if="entitas_key==='-NQUWcFOHoCWcgZtnuo3'" active-color="primary" prepend-icon="mdi-town-hall" title="Kelola Institusi" to="/kelola-entitas"></v-list-item>

          <v-list-item v-if="level_user_key !== '' && level_user_key==='-NQUa76pkOfJQB8mJuDb'" active-color="primary" prepend-icon="mdi-google-classroom" title="Daftar Ujian" to="/daftar-ujian"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main class="main-body bg-grey-lighten-4" >
        <router-view /> 
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { signOut } from "firebase/auth";
import { auth } from '@/plugins/firebase'
import { useUserStore } from '@/store/user';
import { get } from '@/plugins/firebasedb';
import profile from '@/assets/profile.png'

const route = useRoute()
const router = useRouter();
const drawer = ref(true);
const userStore = useUserStore();

const logout = async () => {
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

const subscribeList = ref({})
const nama = ref('')
const entitas = ref('')
const level_user_key = ref('')
const entitas_key = ref('')
onMounted(async ()=>{
  window.addEventListener('scroll', keepSticky)
  
  // load user
  let userLogin = await get('/users', 'email', userStore.user.email);
  let idUser = Object.keys(userLogin)[0]
  let user_complete = userLogin[idUser]

  user_complete.entitas = (await get('/entitas/' + user_complete.entitas_key)).nama
  user_complete.level_user = (await get('/level_user/' + user_complete.level_user_key)).nama

  nama.value = user_complete.nama;
  entitas.value = user_complete.entitas;
  level_user_key.value = user_complete.level_user_key;
  entitas_key.value = user_complete.entitas_key;

})

onUnmounted(()=>{
  window.removeEventListener('scroll', keepSticky);
  Object.keys(subscribeList.value).forEach(function(key) {
    subscribeList.value[key]();
  });
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
