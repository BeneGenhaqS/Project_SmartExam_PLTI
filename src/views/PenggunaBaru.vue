<template>
  <v-container fluid class="pa-0" >
    <v-row class="pa-10 loginScreen bg-grey-lighten-4" align="center" justify="center">
      <v-col cols="12" class="text-center" v-if="mode==='resetPassword'">
        <v-img src="@/assets/logo.png" height="200" class="animate__animated animate__flipInX animate__fast" />
        <p class="LeagueFont pb-3 text-primary">Registrasi</p>
        <div class="loginPanel mx-auto">
          <v-sheet class=" pa-8 rounded-lg elevation-1">
            <v-form fast-fail @submit.prevent="submit">

              <v-text-field
                v-model="password"
                label="Password"
                variant="outlined"
                type="password"
                class="pb-2"
                :rules="passwordRules"
                :disabled="loading"
              ></v-text-field>

              <v-text-field
                v-model="password_repeat"
                label="Konfirmasi Password"
                variant="outlined"
                type="password"
                class="pb-2"
                :rules="password_repeatRules"
                :disabled="loading"
              ></v-text-field>

              <v-btn 
                :loading="loading" 
                :disabled="password === '' || password_repeat === '' || password!== password_repeat" 
                type="submit" 
                block 
                class="mt-2 elevation-0" 
                color="primary"
              >Simpan</v-btn>
            </v-form>
          </v-sheet>
        </div>
        <v-snackbar
          v-model="snackbar"
          multi-line
          :timeout="5000"
          color="red-lighten-1"
        >
          {{ errorMessage }}
        </v-snackbar>
        <v-snackbar
          v-model="snackbar_success"
          multi-line
          :timeout="5000"
          color="green-darken-1"
        >
          Anda telah berhasil melakukan registrasi dan sudah dapat Login pada Smart Exam
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
  
</template>

<script setup>
import { ref } from 'vue'
import 'animate.css';
import { useRoute, useRouter } from 'vue-router';
import { auth } from '@/plugins/firebase'
import { confirmPasswordReset } from "firebase/auth";

const mode = ref('')
const oobCode = ref('')
const route = useRoute();
const router = useRouter()
if(Object.keys(route.query).length >= 2 && route.query.mode && route.query.oobCode){
  mode.value = route.query.mode;
  oobCode.value = route.query.oobCode;
}else{
  router.push('/beranda')
}

const password = ref('')
const password_repeat = ref('')
const passwordRules = [
  value => {
    if (value) return true
    return 'Password tidak boleh kosong.'
  },
]
const password_repeatRules = [
  value => {
    if (value === password.value && value) return true
    if(!value) return 'Password tidak boleh kosong'
    return 'Konfirmasi password harus sama'
  },
]


const snackbar = ref(false)
const snackbar_success = ref(false)
const errorMessage = ref('')
const loading = ref(false)
const submit = async () =>{
  loading.value = true;
  if(password.value !== ''){
    try{
      await confirmPasswordReset(auth, oobCode.value, password.value)
      snackbar_success.value = true;
      setTimeout(()=>{
        router.push('/login')
        loading.value = false;
      }, 6000)
    }catch(error){
      console.log(error)
      errorMessage.value = 'Tautan ini sudah kedaluarsa, silakan ajukan kepada admin untuk mengundang ulang Anda';
      snackbar.value = true;
      setTimeout(()=>{
        router.push('/beranda')
        loading.value = false;
      }, 6000)
    }
    
  }
  
}
</script>

<style scoped>
.loginPanel{
  max-width: 600px;
}
</style>