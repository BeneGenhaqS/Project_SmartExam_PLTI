<template>
  <v-container fluid class="bg-grey-lighten-6 h-100 lembarsoal bg-white rounded-lg elevation-4 my-3 pa-10">
    <v-row align="center" justify="center" v-if="loadingDataset===false">
      <v-col>

        <div class="videoPIP" id="videoWebCam">
          <WebCam 
            v-if="dataSet!==null"
            class="mx-auto" 
            :width="300" 
            :height="200" 
            :interval="1000" 
            :minConfidanceRate="0.5"
            mode="detectMultipleFace"
            :data-set-wajah="dataSet"
            :label="user !== null ? user.nama : 'Peserta'"
            :distanceRecognition="0.5"
          ></WebCam>  <!-- kalau mau akurat, distanceRecognition dikecilin mendekati 0 -->
          <div class="indikatorKecurangan" id="indikatorCheating" :class="indikatorWarning ?  'warning' : ''">
            {{ indikatorMessage }}
          </div>
        </div>

        
        
        <div class="text-center text-h4 text-uppercase font-weight-bold text-primary">
          {{ ujian ? `Ujian ${ujian.nama}` : '' }}<br/>
          <span class="text-h5">{{ ujian ? `Waktu: ${ujian.mulai} s/d ${ujian.selesai}` : ''}}</span><br/>
          <span class="text-body-1">{{ user ? `Nama: ${user.nama}` : ''}}</span>
          <span class="text-body-1">{{ kelas ? `, Kelas: ${kelas.nama}` : ''}}</span>
        </div>
        <div v-for="(soal, idx) in listSoal" class="mx-3 my-2">

          <v-divider class="my-10"></v-divider>
          <div class="animate__animated animate__fadeIn">
            <h4 class="mb-2">
              <v-chip color="primary">Nomor {{ idx + 1 }}</v-chip>
            </h4>
            <div class="mx-1 mt-1 mb-3" v-html="soal.pertanyaan"></div>
            <div class="mt-5 mb-5">
              <v-row v-for="(opsi, idx_opsi) in soal.opsi_jawaban">
                <v-col cols="12">
                  <v-checkbox v-model="listJawaban[soal.key]" style="margin-bottom: -48px; margin-top: -24px" :label="opsi.jawaban" :value="idx_opsi"></v-checkbox>
                </v-col>
              </v-row>
            </div>
            
          </div>
        </div>

        <div v-if="listSoal.length > 0" align="center" class="mt-10">
          <v-divider></v-divider>
          <div class="ml-auto mt-10">
            <v-btn :disabled="loading || !ready_state" color="red" variant="tonal" @click="batal">Batal Ujian</v-btn>
            <v-btn type="submit" :loading="loading" :disabled="!ready_state" color="primary" variant="tonal" @click="simpan" class="ml-3"><v-icon>mdi-send</v-icon>&nbsp; Kirim Hasil Ujian</v-btn>
          </div>
        </div>
        <v-dialog
          v-model="dialogWaktuUjianBerakhir"
          width="100%"
          max-width="600px"
          persistent
          scrollable
        >
          <v-card>
            <v-card-title class="pa-0">
              <v-toolbar flat color="primary" title="Perhatian"></v-toolbar>
            </v-card-title>
            <v-card-text class="">
              <v-row class="pa-2 dialogPanel no-gutters" align="center" justify="center">
                <v-col cols="12" class="text-center">
                  
                  <div class="dialogPanel mx-auto">
                    Waktu Ujian Telah Berakhir, Anda harus segera mengirim hasil pengerjaan ujian Anda
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="ml-auto">
              <v-btn type="submit" color="primary" @click="kirimJawaban">Kirim Jawaban</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="dialogSelesai"
          width="100%"
          max-width="500px"
          persistent
          scrollable
        >
          <v-card>
            <v-card-title class="pa-0">
              <v-toolbar flat color="primary" title="Perhatian"></v-toolbar>
            </v-card-title>
            <v-card-text class="">
              <v-row class="pa-2 dialogPanel no-gutters" align="center" justify="center">
                <v-col cols="12" class="text-center">
                  
                  <div class="dialogPanel mx-auto">
                    Anda yakin ingin mengirim hasil ujian Anda?
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="ml-auto">
              <v-btn :disabled="loadingSubmit" color="grey" @click="dialogSelesai = false">Batal</v-btn>
              <v-btn type="submit" color="primary" :loading="loadingSubmit" @click="kirimJawaban">Yakin</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="dialogWaktuUjianDiluarJangkauan"
          width="100%"
          max-width="600px"
          persistent
          scrollable
          class="dialogWaktuUjianDiluarJangkauan"
        >
          <v-card>
            <v-card-title class="pa-0">
              <v-toolbar flat color="primary" title="Perhatian"></v-toolbar>
            </v-card-title>
            <v-card-text class="">
              <v-row class="pa-2 dialogPanel no-gutters" align="center" justify="center">
                <v-col cols="12" class="text-center">
                  
                  <div class="dialogPanel mx-auto">
                    Ujian ini belum dimulai atau mungkin sudah berlalu, tidak bisa mengakses soal ini kembali
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="ml-auto">
              <v-btn type="submit" color="primary" @click="tidakAdaAkses">Tutup</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        

        <v-dialog
          v-model="successDialog"
          width="100%"
          max-width="500px"
          persistent
          scrollable
          class="dialogWaktuUjianDiluarJangkauan"
        >
          <v-card>
            <v-card-title class="pa-0">
              <v-toolbar flat color="primary" title="Sukses"></v-toolbar>
            </v-card-title>
            <v-card-text class="">
              <v-row class="pa-2 dialogPanel no-gutters" align="center" justify="center">
                <v-col cols="12" class="text-center">
                  
                  <div class="dialogPanel mx-auto">
                    Ujian Anda berhasil disimpan
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
        
      </v-col>
    </v-row>
    <v-dialog
      v-model="loadingDataset"
      :scrim="false"
      persistent
      width="auto"
    >
      <v-card
        color="primary"
      >
        <v-card-text>
          Sedang mempersiapkan ujian
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { convertGet, get, getWatch, push, remove, set } from '@/plugins/firebasedb';
import { useUserStore } from '@/store/user';
import { ref, onMounted, inject, onUnmounted, watch, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import WebCam from '@/components/WebCam.vue';

import { getWatch as watch_bc, get as get_data_bc, set as set_data_bc  } from '@/plugins/blockchain/firebasedb'
import Blockchain from '@/plugins/blockchain/blockchain'
import Block from '@/plugins/blockchain/block';
import { bc_network, loadPossibleNode, loginBlockChain, logoutBlockChain } from '@/plugins/blockchain/config_blockchain';

import repair_data from './repair_data';




onMounted(async () => {
  Object.keys(bc_network).forEach(async (key)=> {
    await loginBlockChain(bc_network[key].auth)
    subscribeList.value[key] = watch_bc(bc_network[key].db, '/', async (result)=>{
      // inisialisasi blockchain dari realtime database
      bc_network[key].blockchain = await Blockchain.convertFirebasetoBlockchain(bc_network[key].db, result);
    })
  })
})



const availableNodeBlockchain = ref([])
const loadingSubmit = ref(false)
watch(bc_network, async (val)=>{
  let blockchain_loaded = true;
  let keys_bc = Object.keys(val);
  for(let i=0; i<keys_bc.length; i++){
    blockchain_loaded = blockchain_loaded && typeof val[keys_bc[i]].blockchain === 'object'
  }
  if(blockchain_loaded && !loadingSubmit.value){
    // cek validity of blockchain
    availableNodeBlockchain.value = await loadPossibleNode(bc_network)
    // console.log('availableNodeBlockchain.value', availableNodeBlockchain.value)
  }
})

const addDataBlockchain = async (data) => {
  let result = {}
  const timestamp = Date.now();
  for(let i=0; i<availableNodeBlockchain.value.length; i++){
    let bc = bc_network[availableNodeBlockchain.value[i]].blockchain;
    let db = bc_network[availableNodeBlockchain.value[i]].db;
    let mineBlock = Block.mineBlock(bc.getLastBlock(), data, timestamp)
    
    let key = await bc.addBlock(db, mineBlock)
    let getData = await get_data_bc(db, '/' + key);
    
    getData.hash = Block.getHash(getData.timestamp, getData.lastHash, getData.data);
    await set_data_bc(db, '/' + key, getData);
    result[availableNodeBlockchain.value[i]] = key
  }
  return result;
}


const keepSticky_video = () => {
  var header = document.getElementById('videoWebCam');
  var sticky = 0;

  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// https://en.wikipedia.org/wiki/Fisher–Yates_shuffle
const shuffleSoal = (obj) => {
  // new obj to return
  let newObj = {};
  // create keys array
  var keys = Object.keys(obj);
  // randomize keys array
  keys.sort(function(a,b){return Math.random()- 0.5;});
  // save in new array
  keys.forEach(function(k) {
    newObj[k] = obj[k];
  });
  return newObj;
}

const subscribeList = ref({})
const user = ref(null)
const userStore = useUserStore();
const route = useRoute()
const ujian = ref(null)
const listSoal = ref([])
const listJawaban = ref({})
const kelas = ref(null)
const dialogWaktuUjianBerakhir = ref(false)
const dialogWaktuUjianDiluarJangkauan = ref(false)
const dialogSelesai = ref(false)
const intervalWwaktu = ref(null)
const emitter = inject('emitter')
const loadingDataset = ref(false)
const dataSet = ref(null)
const kumpulanKecurangan = ref({
  pesertaLebihDariSatu: [],
  pesertaTidakTerdeteksi: [],
  terlaluBerisik: [],
  wajahPesertaTidakCocok: [],
})
onMounted(async () => {
  loadingDataset.value = true;

  window.addEventListener('scroll', keepSticky_video)

  emitter.emit('toggleLogout', false)
  // load user
  let userLogin = await get('/users', 'email', userStore.user.email);
  let idUser = Object.keys(userLogin)[0]
  user.value = userLogin[idUser]
  user.value.key = idUser

  // load dataset wajah
  let dataSetWajah = await get('/wajah', 'user_key', idUser);
  let idWajah = Object.keys(dataSetWajah)[0]
  dataSet.value = dataSetWajah[idWajah].wajah;

  // load backup data ujian peserta jika sebelumnya mati lampu
  let getBackup = await get('/backup_jawaban_peserta/'+route.params.id+'/'+user.value.key);
  if(getBackup !== null){
    listJawaban.value = getBackup.jawaban;
    jumlahDetik.value = getBackup.jumlahDetik;
    kumpulanKecurangan.value = getBackup.kumpulanKecurangan
  }
  
  

  subscribeList.value.ujian = getWatch('/ujian/'+route.params.id, async (result)=>{
    let soal = convertGet(shuffleSoal(result.soal))
    listSoal.value = soal
    
    for(let i=0; i< listSoal.value.length; i++){
      if(listSoal.value[i].key in listJawaban.value){}
      else{
        listJawaban.value[listSoal.value[i].key] = false;
      }
    }
    Object.keys(listJawaban.value).forEach((key)=>{
      let exist = false;
      for(let i=0; i<listSoal.value.length; i++){
        if(listSoal.value[i].key===key) exist = true;
      }
      if(!exist){
        delete listJawaban.value[key]
      }
    })
    kelas.value = await get('/kelas/' + result.kelas_key);
    ujian.value = result;
    
  })

  intervalWwaktu.value = setInterval(()=>{


    // check waktu ujian
    dialogWaktuUjianBerakhir.value = false;
    dialogWaktuUjianDiluarJangkauan.value = false;

    let masihDiWaktuUjian = isWaktunyaUjian();
    if(masihDiWaktuUjian === false){
      // cek apakah ada jawaban yang dibuat
      let sudahMenjawab = true;
      let key = Object.keys(listJawaban.value);
      for(let i=0; i<key.length; i++){
        if(listJawaban.value[key[i]] === false){
          sudahMenjawab = false;
          break;
        }
      }
      emitter.emit('stopWebcam')
      
      if(sudahMenjawab){
        dialogWaktuUjianBerakhir.value = true;
      }else{
        dialogWaktuUjianDiluarJangkauan.value = true;
      }
    }
  }, 1000)



  // disable back button
  history.pushState(null, null, document.URL);
  window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL);
  });

  loadingDataset.value = false
})

onUnmounted(async ()=>{
  window.removeEventListener('scroll', keepSticky_video)
  clearInterval(intervalWwaktu.value)
  let node_bc = Object.keys(bc_network);
  for(let i=0; i<node_bc.length; i++){
    try{
      await logoutBlockChain(bc_network[node_bc[i]].auth);
    }catch(errLogout){
      console.error('gagal logout bc', errLogout)
    }
    
  }
  Object.keys(subscribeList.value).forEach(function(key) {
    subscribeList.value[key]();
  });

})


const isWaktunyaUjian = () => {
  if(ujian.value === null) return null
  let currentdate = new Date();
  let yyyy = currentdate.getFullYear();
  let mm = (currentdate.getMonth()+1).toString().padStart(2, '0');
  let dd = currentdate.getDate().toString().padStart(2, '0');
  let yyyyMMdd_today = `${yyyy}-${mm}-${dd}`;
  let h = currentdate.getHours().toString().padStart(2, '0');
  let m = currentdate.getMinutes().toString().padStart(2, '0');
  let hhMM_today = `${h}:${m}`;
  if(yyyyMMdd_today === ujian.value.tanggal && hhMM_today >= ujian.value.mulai && hhMM_today <= ujian.value.selesai){
    return true
  }
  return false
}

const router = useRouter();


const tidakAdaAkses = () => {
  router.push('/daftar-ujian')
}


const batal = () => {
  emitter.emit('toggleLogout', true)
  router.push('/daftar-ujian')
}

const loading = ref(false)
const simpan = async () => {
  dialogSelesai.value = true;
  
}


const indikatorMessage = ref('-- Sedang Mengawasi --')
const indikatorWarning = ref(false)
const jumlahDetik = ref(0)
const fileSuara = ref('')
const ready_state = ref(false)
emitter.on('getRecorderSound', (base64sound)=>{
  fileSuara.value = base64sound
})
emitter.on('faceDetectionResult', async ({detection, cameraCapture, recorder}) => {
  ready_state.value = true;

  // console.log({detection, cameraCapture, recorder})
  
  jumlahDetik.value++;

  
  
  if(typeof detection === 'undefined' || detection.length === 0){
    indikatorMessage.value = 'Peserta tidak terdeteksi'
    indikatorWarning.value = true;

    if(typeof kumpulanKecurangan.value.pesertaTidakTerdeteksi === 'undefined')
      kumpulanKecurangan.value.pesertaTidakTerdeteksi = []

    kumpulanKecurangan.value.pesertaTidakTerdeteksi.push({
      detikKe: jumlahDetik.value,
      image: cameraCapture
    })
  }else if(detection.detection.length > 1){
    indikatorMessage.value = 'Peserta lebih dari satu'
    indikatorWarning.value = true;

    if(typeof kumpulanKecurangan.value.pesertaLebihDariSatu === 'undefined')
      kumpulanKecurangan.value.pesertaLebihDariSatu = []

    kumpulanKecurangan.value.pesertaLebihDariSatu.push({
      detikKe: jumlahDetik.value,
      image: detection.detection[0].images[0]
    })
    // console.log(detection.detection[0].images[0])
  }else if(detection.detection.length === 1 && detection.recognition[0].label === 'unknown'){
    indikatorMessage.value = 'Wajah peserta tidak dikenali'
    indikatorWarning.value = true;

    if(typeof kumpulanKecurangan.value.wajahPesertaTidakCocok === 'undefined')
      kumpulanKecurangan.value.wajahPesertaTidakCocok = []

    kumpulanKecurangan.value.wajahPesertaTidakCocok.push({
      detikKe: jumlahDetik.value,
      image: detection.detection[0].images[0]
    })
  }else if(typeof recorder !== 'undefined' && recorder.decibel > 60){
    indikatorMessage.value = 'Ruangan peserta terlalu berisik'
    indikatorWarning.value = true;

    if(typeof kumpulanKecurangan.value.terlaluBerisik === 'undefined')
      kumpulanKecurangan.value.terlaluBerisik = []

    kumpulanKecurangan.value.terlaluBerisik.push({
      detikKe: jumlahDetik.value,
      sound: recorder
    })
  }else{
    indikatorWarning.value = false;
    indikatorMessage.value = '-- Sedang Mengawasi --'
  }

  // console.log(kumpulanKecurangan.value)
  await set('/backup_jawaban_peserta/'+route.params.id+'/'+user.value.key, {
    jawaban: listJawaban.value,
    jumlahDetik: jumlahDetik.value,
    kumpulanKecurangan: kumpulanKecurangan.value
  })
})


const cloneObject = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}


const successDialog = ref(false)
const kirimJawaban = async () =>{
  loadingSubmit.value = true;
  
  let detikPengerjaan = jumlahDetik.value;
  let catatanKecurangan = cloneObject(kumpulanKecurangan.value);
  let jawaban = cloneObject(listJawaban.value);
  let pertanyaan = cloneObject(listSoal.value); 

  // hitung nilai
  let betul = 0;
  for(let i=0; i<pertanyaan.length; i++){
    let key = pertanyaan[i].key;
    let kunci_betul = -1;
    for(let j=0; j<pertanyaan[i].opsi_jawaban.length; j++){
      if(pertanyaan[i].opsi_jawaban[j].isTrue){
        kunci_betul = j;
        break;
      }
    }

    if(jawaban[key] === kunci_betul) betul++;
  }
  let skor = (Math.round((betul / pertanyaan.length) * 100)).toFixed(2);

  // hitung persentase kecurangan
  let persentaseKecurangan = {};
  Object.keys(catatanKecurangan).forEach((key)=>{
    persentaseKecurangan[key] = (Math.round((catatanKecurangan[key].length / detikPengerjaan) * 100)).toFixed(2);
  })

  // matikan web cam dll
  emitter.emit('stopRecording')
  let rekamanSuara = fileSuara.value;
  while(rekamanSuara===''){
    await new Promise(r => setTimeout(r, 300));
    rekamanSuara = fileSuara.value
  }
  

  // DICEK LAGI AGAR SETIAP KECURANGAN, ADA BUKTI FOTONYA 
  let user_key = user.value.key;
  let ujian_key = route.params.id;
  let data = {catatanKecurangan, detikPengerjaan, jawaban, persentaseKecurangan, pertanyaan, rekamanSuara, skor, ujian_key, user_key}
  // console.log(data)

  
  // simpan ke block chain (ke semua node)
  let result_bc = await addDataBlockchain(data)

  // ambil informasi key di blockchainnya supaya bisa diakses lebih cepat
  await push('/hasil_ujian', {
    detail: result_bc,
    user_key: user.value.key,
    ujian_key: route.params.id,
    result: 'Pending'
  })

  // hapus data ujian sementara
  await remove(`/backup_jawaban_peserta/${route.params.id}/${user.value.key}`)

  let node_bc = Object.keys(bc_network);
  for(let i=0; i<node_bc.length; i++){
    try{
      await logoutBlockChain(bc_network[node_bc[i]].auth);
    }catch(errLogout){
      console.error('gagal logout bc', errLogout)
    }
    
  }

  // matikan web cam dll
  emitter.emit('stopWebcam')
  emitter.emit('toggleLogout', true)

  // back ke halaman daftar ujian
  loadingSubmit.value = false;
  successDialog.value = true;
  setTimeout(()=>{
    router.push('/daftar-ujian')
  }, 2000)
  
  
}


onMounted(async () => {
  setTimeout(async ()=> {
    console.log('mulai')
    console.log(availableNodeBlockchain.value)
    return;
    // ini untuk jaga-jaga benerin data

    
    let len = Object.keys(repair_data);
    for(let i=0; i<len.length; i++){
      let data = repair_data[len[i]]

      // simpan ke block chain (ke semua node)
      // let result_bc = await addDataBlockchain(data.blockchain.data)
      let result_bc = {}
      const timestamp = data.blockchain.timestamp;
      let bc_list = ['bc1', 'bc2', 'bc3']
      for(let i=0; i<bc_list.length; i++){
        console.log('percobaan insert node ' + bc_list[i])
        let bc = bc_network[bc_list[i]].blockchain;
        let db = bc_network[bc_list[i]].db;
        // console.log(bc, db)
        // return
        let mineBlock = Block.mineBlock(bc.getLastBlock(), data.blockchain.data, timestamp)
        
        let key = await bc.addBlock(db, mineBlock)
        let getData = await get_data_bc(db, '/' + key);
        
        getData.hash = Block.getHash(getData.timestamp, getData.lastHash, getData.data);
        await set_data_bc(db, '/' + key, getData);
        result_bc[bc_list[i]] = key
      }
      // return result_bc;

      // ambil informasi key di blockchainnya supaya bisa diakses lebih cepat
      await push('/hasil_ujian', {
        detail: result_bc,
        user_key: data['db-utama'].user_key,
        ujian_key:  data['db-utama'].ujian_key,
        result: 'Pending'
      })

      // hapus data ujian sementara
      try{  
        await remove(`/backup_jawaban_peserta/${data['db-utama'].ujian_key}/${data['db-utama'].user_key}`)
      }catch(ex){
        console.error(ex)
      }
     

      // let node_bc = Object.keys(bc_network);
      // for(let i=0; i<node_bc.length; i++){
      //   try{
      //     await logoutBlockChain(bc_network[node_bc[i]].auth);
      //   }catch(errLogout){
      //     console.error('gagal logout bc', errLogout)
      //   }
        
      // }
      console.log('step ' + len[i] + ' berhasil')
    }
    console.log('selesai')
  }, 20000)
})

</script>

<style scoped>
.lembarsoal{
  width: 100%;
  max-width: 1024px;

}

.dialogWaktuUjianDiluarJangkauan :deep(.v-overlay__scrim) {
  background: white;
  opacity: 100%;
}

.videoPIP{
  width: 300px;
  height: 200px;
  background-color: black;
  position: absolute;
  top: 80px;
  right: 10px;
  z-index: 10;
}
.indikatorKecurangan{
  background-color: #0171BA;
  width: 300px;
  color: white;
  text-align: center;
  z-index: 10;
}
.indikatorKecurangan.warning{
  background-color: #af4154 !important;
}
.sticky {
  position: fixed !important;
}
</style>