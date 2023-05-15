<template>
  <v-container fluid class="pa-0" >
    <v-row class="bg-grey-lighten-4 pa-10" align="center" justify="center">
      <v-col>
        <!-- <WebCam :width="300" :height="200" :interval="100" /> -->
        <p class="my-5 text-center text-h5 font-weight-bold text-primary">Penyelesaian Registrasi</p>
        <Wizard
          card-background
          :showProgress="true"
          :nextButton="nextButtonOptions"
          :doneButton="doneButtonOptions"
          :custom-tabs="[
            {
              id: 0,
              title: 'Permintaan Hak Akses Perangkat',
            },
            {
              id: 1,
              title: 'Pembuatan Model Pengenalan Wajah',
            }
          ]"
          :beforeChange="onTabBeforeChange"
          @change="onChangeCurrentTab"
          @complete:wizard="wizardCompleted"
        >
          <template #back>
            &nbsp;
          </template>
          <v-divider class="mb-10"></v-divider>
          <div class="mb-5">
            <div v-if="currentTabIndex === 0" class="text-center">
              <div class="text-caption mb-3">Anda harus mengizinkan akses terhadap kamera webcam dan microphone agar fungsionalitas aplikasi ini dapat berjalan dengan baik</div>
              <div class="text-left mx-auto" style="width: 200px">
                <dl>
                  <dt>
                    <v-icon 
                      color="white" 
                      :class="accessCameraAndMicrophone ? 'bg-primary' : 'bg-red-lighten-1'" 
                      class="rounded mr-2 mb-2"
                    >
                      {{ accessCameraAndMicrophone ? 'mdi-check' : 'mdi-close' }}
                    </v-icon> Akses WebCam
                  </dt>
                  <dt>
                    <v-icon 
                      color="white" 
                      :class="accessCameraAndMicrophone ? 'bg-primary' : 'bg-red-lighten-1'" 
                      class="rounded mr-2"
                    >
                      {{ accessCameraAndMicrophone ? 'mdi-check' : 'mdi-close' }}
                    </v-icon> Akses Microphone
                  </dt>
                </dl>
              </div>
              <div class="text-center mt-5">
                <v-btn 
                  color="primary" 
                  variant="tonal" 
                  size="small" 
                  @click="getUserMediaSupported" 
                  :loading="loadingPermission"
                  :disabled="accessCameraAndMicrophone"
                >Beri Akses</v-btn>
              </div>
            </div>
            <div v-if="currentTabIndex === 1" class="text-center">
              <div class="text-caption mb-3">
                Setelah menekan tombol di bawah, menghadaplah ke kamera selama ± 5 detik untuk direkam wajah Anda.<br/>
                Jika wajah tidak terdeteksi, pastikan pencahayaan tercukupi.<br/>
                Perekaman ini bertujuan agar sistem dapat mengenali wajah Anda pada saat ujian nanti.
              </div>
              <WebCam 
                class="mx-auto" 
                :width="480" 
                :height="360" 
                :interval="intervalCaptureFrame" 
                :minConfidanceRate="0.8"
                mode="detectSingleFace"
              ></WebCam>
              <v-btn 
                color="primary" 
                variant="tonal" 
                size="small" 
                class="mt-5" 
                :disabled="(!faceDetected && !loading) || faceCollected.length===maksFrame" 
                :loading="loading" 
                @click="mengambilWajah"
              >
                <v-icon v-if="faceCollected.length===maksFrame">mdi-check</v-icon>&nbsp;
                Ambil Model Wajah
              </v-btn>

            </div>
          </div>

        </Wizard>
        <v-snackbar
          v-model="snackbar"
          multi-line
          :timeout="2000"
          color="green-darken-1"
        >
          Anda sudah berhasil menyelesaikan registrasi
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import WebCam from '@/components/WebCam.vue'
import 'form-wizard-vue3/dist/form-wizard-vue3.css'
import Wizard from 'form-wizard-vue3'
import { ref, inject, computed, onMounted } from 'vue';
import { get, push } from '@/plugins/firebasedb';
import { useUserStore } from '@/store/user';
import { useRouter } from 'vue-router';

const emitter = inject('emitter')
const user = ref(null)
const userStore = useUserStore();
onMounted(async () => {
  let userLogin = await get('/users', 'email', userStore.user.email);
  let idUser = Object.keys(userLogin)[0]
  user.value = userLogin[idUser]
  user.value.key = idUser;
})

const currentTabIndex = ref(0)
const onChangeCurrentTab = (index, oldIndex) => {
  if(typeof oldIndex !== 'undefined'){
    currentTabIndex.value = index;
  }
  
}
const onTabBeforeChange = () => {
  if (currentTabIndex.value === 1) {
    nextButtonOptions.value.text = 'Simpan'
  }
}
const loadingUploadWajah = ref(false);
const router = useRouter();
const snackbar = ref(false)
const wizardCompleted = async () => {
  loadingUploadWajah.value = true;
  // upload ke firebase
  await push('/wajah/', {
    user_key: user.value.key,
    wajah: faceCollected.value
  })
  snackbar.value = true;
  setTimeout(()=>{
    router.replace('/daftar-ujian');
    loadingUploadWajah.value = false;
  }, 2000)
  


}
const nextButtonOptions = computed(() => {
  return {
    text: 'Selanjutnya',
    disabled: accessCameraAndMicrophone.value ? false : true
  }
  
})

const doneButtonOptions = computed(() => {
  return {
    text: loadingUploadWajah.value ? 'Sedang Diproses' : 'Simpan',
    disabled: faceCollected.value.length === maksFrame && !loadingUploadWajah.value ? false : true
  }
})

const accessCameraAndMicrophone = ref(false)
const loadingPermission = ref(false)
const getUserMediaSupported = () => {
  loadingPermission.value = true;
  navigator.mediaDevices.getUserMedia({ audio: true, video: true})
   .then(function (stream) {
      if (stream.getVideoTracks().length > 0 && stream.getAudioTracks().length > 0){
        accessCameraAndMicrophone.value = true;
        stream.getTracks().forEach(function(track) {
          track.stop();
        });

        loadingPermission.value = false;
      } else {
        accessCameraAndMicrophone.value = false;
        loadingPermission.value = false;
      }
   })
  .catch(function (error) { 
    accessCameraAndMicrophone.value = false;
    loadingPermission.value = false;
   });
}

const faceDetected = ref(false)
const faceCollected = ref([]);
const intervalCaptureFrame = 100; //ms
const maksFrame = 10;
const loading = ref(false);
const selesaiCapture = ref(false)
emitter.on('faceDetectionResult', async ({detection, cameraCapture}) => {
  // console.log(detection)
  if(typeof detection === 'undefined') faceDetected.value = false
  else{
    faceDetected.value = true
    if(loading.value && faceCollected.value.length < maksFrame){
      faceCollected.value.push(detection.images[0])
    }else if(faceCollected.value.length >= maksFrame && !selesaiCapture.value){
      loading.value = false;
      selesaiCapture.value = true;
      // console.log(faceCollected.value)
    }
  }
})
const mengambilWajah = () => {
  loading.value = true;
}

</script>

<style scoped>
.form-wizard-vue :deep(.fw-step-active) {
  background: #0171BA!important;
  color: #fff!important;
}
.form-wizard-vue :deep(span.fw-step-title){
  margin-top: 15px !important
}
.form-wizard-vue :deep(.fw-body-list li .fw-list-wrapper-icon){
  cursor: default !important;
}
.form-wizard-vue :deep(.fw-step-checked) {
  border: 2px solid #26c407 !important;
}
.form-wizard-vue :deep(.fw-body-list .fw-list-progress-active) {
  background: #0171BA;
  border-radius: 10px;
}
.form-wizard-vue :deep(.fw-body-list .fw-list-progress) {
  border-radius: 10px;
}
.form-wizard-vue :deep(.fw-btn){
  background: #0171BA !important;
}
</style>
