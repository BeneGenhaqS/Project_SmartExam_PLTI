<template>
  <v-app>
    <v-layout>
      <v-app-bar color="primary" id="headerApp">
        <template v-slot:prepend>
          <v-img src="@/assets/logo-mini.png" :width="64"></v-img>
        </template>

        <v-app-bar-title class="LeagueFont">Smart Exam</v-app-bar-title>

        <v-spacer></v-spacer>

        <v-tabs
          v-model="tab"
          color="deep-blue-accent-4"
          align-tabs="center"
        >
          <v-tab :value="'/beranda'">Beranda</v-tab>
          <!-- <v-tab :value="'/kontak-kami'">Kontak Kami</v-tab> -->
          <v-tab :value="'/login'">Login</v-tab>
          <v-tab v-if="route.path === '/pengguna-baru'" :value="'/pengguna-baru'">Registrasi</v-tab>
        </v-tabs>
      </v-app-bar>

      <v-main class="main-body bg-grey-lighten-4" >
        <router-view /> 
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter();
const tab = computed({
  get(){
    return route.path
  },
  set(newValue) {
    router.push(newValue)
  }
})

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
