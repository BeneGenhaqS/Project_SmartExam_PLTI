<template>
  <v-container fluid class="bg-grey-lighten-6 h-100">
    <v-row align="center" justify="center">
      <v-col>
        Selamat Datang di Prototipe Smart Exam
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { get } from '@/plugins/firebasedb'
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import { useRouter } from 'vue-router';

const user = ref(null)
const userStore = new useUserStore()
const router = useRouter()

onMounted(async () => {
  // load user
  let userLogin = await get('/users', 'email', userStore.user.email);
  let idUser = Object.keys(userLogin)[0]
  user.value = userLogin[idUser]
  user.value.key = idUser;

   if(user.value.level_user_key === "-NQUa76pkOfJQB8mJuDb"){
    router.push('/unduh-safeexambrowser')
   }else{
    router.push('/kelola-ujian')
   }
})
</script>