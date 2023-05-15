<template>
  <v-container fluid class="pa-0" >
    <v-row class="pa-10 loginScreen bg-grey-lighten-4" align="center" justify="center">
      <v-col cols="12" class="text-center">
        <v-img src="@/assets/logo.png" height="200" class="animate__animated animate__flipInX animate__fast" />
        <p class="LeagueFont pb-3 text-primary">Login {{ route.path==='/login-peserta' ? 'Peserta Ujian' : '' }}</p>
        <div class="loginPanel mx-auto">
          <v-sheet class=" pa-8 rounded-lg elevation-1">
            <v-form fast-fail @submit.prevent="submit">
              <v-text-field
                v-model="email"
                label="Email"
                type="text"
                variant="outlined"
                class="pb-2"
                :rules="emailRules"
                :disabled="loading"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                variant="outlined"
                type="password"
                class="pb-2"
                :rules="passwordRules"
                :disabled="loading"
              ></v-text-field>

              <v-btn :loading="loading" type="submit" block class="mt-2 elevation-0" color="primary">Masuk</v-btn>
            </v-form>
          </v-sheet>
        </div>
        <v-snackbar
          v-model="snackbar"
          multi-line
          :timeout="2000"
          color="red-lighten-1"
        >
          {{ errorMessage }}
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
  
</template>

<script setup>
import { ref, onMounted } from 'vue'
import 'animate.css';
import { useRoute, useRouter } from 'vue-router';
import { auth } from '@/plugins/firebase'
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, signOut } from "firebase/auth";
import { get, set } from '@/plugins/firebasedb';
import { useUserStore } from '@/store/user';




const email = ref('')
const emailRules = [
  value => {
    var patternEmail = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
  
    if(value && patternEmail.test(value)) return true
    else if(value) return 'Format isian harus berupa email'
    return 'Email tidak boleh kosong'
  },
]
const password = ref('')
const passwordRules = [
  value => {
    if (value) return true
    return 'Password tidak boleh kosong.'
  },
]

const router = useRouter()
const snackbar = ref(false)
const errorMessage = ref('')
const loading = ref(false)
const userStore = useUserStore()
const route = useRoute();

const submit = async () =>{
  loading.value = true;
  if(email.value !== '' && password.value !== ''){
    try{
      await setPersistence(auth, browserLocalPersistence).then(async ()=>{
        await signInWithEmailAndPassword(auth, email.value, password.value);
        let getUser = await get('/users', 'email', email.value);
        if(getUser !== null){
          let idUser = Object.keys(getUser)[0];
          if(getUser[idUser].status === 'Pending'){
            getUser[idUser].status = 'Aktif'
            await set('users/' + idUser, getUser[idUser])
          }else if(getUser[idUser].status === 'Deleted'){
            signOut(auth);
            errorMessage.value = 'Email atau Password Salah';
            snackbar.value = true;
            return;
          }
          
          if(getUser !== null && getUser[idUser].level_user_key === '-NQUa76pkOfJQB8mJuDb'){
            // cek login dari link apa
            if(route.path==='/login'){
              // arahkan ke unduh safe exam
              router.push('/unduh-safeexambrowser')
              return;
            }else{
              // cek apakah sudah punya model wajah
              let cekWajah = await get('/wajah', 'user_key', idUser);
              if(cekWajah === null){
                router.push('/setup-peserta')
                return;
              }else{
                router.push('/daftar-ujian')
                return;
              }
            }

            
            
          }
        }
        // router.push('/dashboard')
        router.push('/kelola-ujian')
      })
      
    }catch(error){
      console.log(error)
      errorMessage.value = 'Email atau Password Salah';
      snackbar.value = true;
    }
    // router.push('/dashboard')
  }
  loading.value = false;
}
</script>

<style scoped>
.loginPanel{
  max-width: 600px;
}
</style>
