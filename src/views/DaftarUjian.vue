<template>
  <v-container fluid class="bg-grey-lighten-6 h-100">
    <v-row align="center" justify="center">
      <v-col>
        <h3 class="pl-4"> Daftar Ujian </h3>
        
        <div class="rounded-lg mt-4">
          <v-table
            fixed-header
            height="calc(100vh - 210px)"
          >
            <template #top>
              <v-row align="center" justify="center">
                <v-col class="mx-auto text-center py-2 px-5">
                  <v-text-field v-model="queryPencarian" variant="outlined" label="Pencarian"></v-text-field>
                </v-col>
              </v-row>
            </template>
            <template #default>
              <thead>
                <tr>
                  <th class="text-left">
                    Nama Ujian
                  </th>
                  <th class="text-left">
                    Kelas
                  </th>
                  <th class="text-left">
                    Pelaksanaan
                  </th>
                  <th class="text-left">
                    Jumlah Soal
                  </th>
                  <th class="text-left">
                    Skor Ujian
                  </th>
                  <th class="text-left">
                    Keputusan
                  </th>
                  <th class="text-center">
                    
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in dataTable"
                  :key="item.key"
                >
                  <td>{{ item.nama }}</td>
                  <td>{{ listKelas[item.kelas_key].nama }}</td>
                  <td>{{ item.tanggal }} {{ item.mulai }}-{{ item.selesai }}</td>
                  <td>{{ item.soal ? Object.keys(item.soal).length : 0 }}</td>
                  <td v-html="getSkorUjian(item.key)"></td>
                  <td>{{ hasil_ujian && typeof hasil_ujian[item.key] !== 'undefined' ? hasil_ujian[item.key].result : '-' }}</td>
                  <td class="text-right">
                    <v-tooltip text="Kerjakan Soal" location="top" v-if="isWaktunyaUjian(item)">
                      <template v-slot:activator="{ props }">
                        <v-btn :disabled="hasil_ujian && typeof hasil_ujian[item.key] !== 'undefined'" v-bind="props" size="small" variant="plain" @click="kerjakanSoal(item.key, item)">
                          <v-icon class="text-primary" size="x-large">mdi-clock-fast</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                    
                    
                  </td>
                </tr>
              </tbody>
              
            </template>
            
          </v-table>
          <!-- <div v-else-if="loading" class="ma-2 bg-white py-5 px-4 rounded-lg font-italic text-center justify-center align-center" >
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
          <div v-else class="ma-2 bg-white py-5 px-4 rounded-lg font-italic text-center justify-center align-center" >
            Tidak ada ujian
          </div> -->
        </div>
        
        <v-dialog
          v-model="dialog"
          width="100%"
          max-width="600px"
          persistent
          scrollable
        >
          <v-card>
            <v-card-title class="pa-0">
              <v-toolbar flat color="primary" title="Perhatikan Ini Sebelum Ujian"></v-toolbar>
            </v-card-title>
            <v-card-text class="">
              <v-row class="pa-2 dialogPanel no-gutters" align="center" justify="center">
                <v-col cols="12" class="text-center">
                  
                  <div class="dialogPanel mx-auto">
                    Ujian {{ choosenUjian.nama }} akan berlangsung dari jam {{ choosenUjian.mulai }} s/d jam {{ choosenUjian.selesai }}. 
                    Selama ujian, <b>kamera dan mikrofon komputer Anda wajib diaktifkan</b> serta <b>pastikan komputer Anda sambil dilakukan pengisian daya atau masih memiliki daya baterai yang penuh</b>. 
                    
                    <br/><br/>Anda diharapkan selalu hadir di depan layar selama ujian dan Anda harus mengerjakan ujian di dalam ruangan tertutup yang minim suara. 
                    Segala bentuk tindak kecurangan akan terekam pada aplikasi ini dan akan menjadi bahan pertimbangan lebih lanjut bagi penyelenggara ujian.<br/><br/>
                    Apakah Anda siap untuk memulai ujian?
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="ml-auto">
              <v-btn color="grey" @click="dialog = false">Batal</v-btn>
              <v-btn type="submit" color="primary" @click="mulaiUjian">Mulai</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted, computed, onUnmounted, inject } from 'vue'
import {  convertGet, getWatch,  get } from '@/plugins/firebasedb';
import { useUserStore } from '@/store/user';
import { useRouter } from 'vue-router';
import { getWatch as watch_bc  } from '@/plugins/blockchain/firebasedb'
import { bc_network, getDataBlockchain, loginBlockChain, logoutBlockChain } from '@/plugins/blockchain/config_blockchain';
import debounce from '@/plugins/debounce'


const subscribeList = ref({})
const listKelas = ref(null)
const masterUjian = ref({})
const masterKelas = ref({})
const user = ref(null)
const userStore = useUserStore();
const queryPencarian = ref('')
const emitter = inject('emitter')
const hasil_ujian = ref({})
const data_bc_clean = ref(undefined)

const tellBlockchainReady = async () => {
  let blockchain_loaded = true;
  let bc_node = Object.keys(bc_network);
  for(let i=0; i<bc_node.length; i++){
    blockchain_loaded = blockchain_loaded && typeof bc_network[bc_node[i]].ujian_key === 'object' //&& Object.keys(bc_network[bc_node[i]].ujian_key).length > 0
  }
  if(blockchain_loaded===true){
    data_bc_clean.value = await getDataBlockchain(bc_network)
    // console.log(data_bc_clean.value)
  }
}

const getSkorUjian = (ujian_key) => {
  // console.log(data_bc_clean.value)
  if(user.value !== null){
    if(typeof data_bc_clean.value !== 'undefined'){

      if(Object.keys(data_bc_clean.value).length > 0){
        let data = data_bc_clean.value[ujian_key];
        if(typeof data !== 'undefined')
          return data.data.data.skor
      }
      return '-'
    }else{
      return '-'
    }
  }
  return '<i>- memuat -</i>'
}

onMounted(async ()=>{
  loading.value = true;

  // load user
  let userLogin = await get('/users', 'email', userStore.user.email);
  let idUser = Object.keys(userLogin)[0]
  user.value = userLogin[idUser]
  user.value.key = idUser

  

  // load hasil ujian
  let getHasilUjian = await get('/hasil_ujian', 'user_key', idUser);
  if(getHasilUjian !== null){
    let ujian_key = Object.keys(getHasilUjian);
    for(let i=0; i<ujian_key.length; i++){
      hasil_ujian.value[getHasilUjian[ujian_key[i]].ujian_key] = getHasilUjian[ujian_key[i]];
    }
  }

  // load data pada Blockchain
  let hasil_ujian_key = Object.keys(hasil_ujian.value);
  for(let i=0; i<hasil_ujian_key.length; i++){
    let bc_saved_node = Object.keys(hasil_ujian.value[hasil_ujian_key[i]].detail);
    for(let j=0; j<bc_saved_node.length; j++){
      await loginBlockChain(bc_network[bc_saved_node[j]].auth);
      let key_data_bc = hasil_ujian.value[hasil_ujian_key[i]].detail[bc_saved_node[j]];
      subscribeList.value[key_data_bc] = watch_bc(bc_network[bc_saved_node[j]].db, '/' + key_data_bc, async (result)=>{

        // ini harus diisi data per blockchain per key
        if(typeof bc_network[bc_saved_node[j]].ujian_key === 'undefined') bc_network[bc_saved_node[j]].ujian_key = {}
        if(result !== null) bc_network[bc_saved_node[j]].ujian_key[hasil_ujian_key[i]] = result;
        await tellBlockchainReady()
      })
    }
  }
  

  // cek kelas
  let kelas = await get('/kelas', 'entitas_key', user.value.entitas_key);
  if(kelas === null){
    loading.value = false
  }else{
    let kelas_key = Object.keys(kelas);
    let not_found = 0;
    for(let i=0; i<kelas_key.length; i++){
      // cek apakah dia peserta di dalamnya
      let cekterdaftar = await get(`/kelas/${kelas_key[i]}/peserta`);
      if(cekterdaftar !== null && cekterdaftar.includes(idUser)===true){
        subscribeList.value.entitas = getWatch('/kelas/' + kelas_key[i], (result)=>{
          masterKelas.value[kelas_key[i]] = result;
        });

        subscribeList.value[`ujian_${kelas_key[i]}`] = getWatch('/ujian', (result)=>{
          masterUjian.value[kelas_key[i]] = result;
        }, 'kelas_key', kelas_key[i]);
      }else{
        not_found++;
      }
    } 
    if(not_found === kelas_key.length){
      loading.value = false
    }
  }
  

  // disable back button
  history.pushState(null, null, document.URL);
  window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL);
  });
})
onUnmounted(async ()=>{
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


const dataUjian = computed(() => {
  let keyDaftar = Object.keys(masterUjian.value);
  if(keyDaftar.length === 0) return [];
  let result = [];
  for(let i=0; i< keyDaftar.length; i++){
    let convert = convertGet(masterUjian.value[keyDaftar[i]]);
    Array.prototype.push.apply(result,convert); 
  }
  return result;
})

const dataTable = ref([]);
const dataTable_master = ref([])
const loading = ref(false)
watch(dataUjian, (val) => {
  loading.value = true;
  if(val.length > 0){
    dataTable_master.value = JSON.parse(JSON.stringify(val));
    if(queryPencarian.value === ''){
      dataTable.value = JSON.parse(JSON.stringify(dataTable_master.value))
    }else{
      filterTable(queryPencarian.value);
    }
  }else{
    dataTable.value = [];
    dataTable_master.value = [];
  }
  loading.value = false;
})

const filterTable = (val) => {
  loading.value = true;
  let newData = dataTable_master.value.filter(function(item){
    return item.nama.toLowerCase().includes(val.toLowerCase()) 
  });
  dataTable.value = JSON.parse(JSON.stringify(newData))
  loading.value = false;
}

watch(queryPencarian,debounce((val)=>{
  filterTable(val)
}, 500))

const dialog = ref(false)
const itemUjian = ref(null)
const choosenUjian = computed({
  get(){
    return itemUjian.value !== null ? itemUjian.value : {
      nama: '-',
      tanggal: '-',
      mulai: '-',
      selesai: '-'
    }
  },
  set(val){
    itemUjian.value = val;
  }
})
const kerjakanSoal = (key, item) => {
  let prepareUjian = JSON.parse(JSON.stringify(item))
  prepareUjian.key = key
  itemUjian.value = prepareUjian;
  dialog.value = true;
}

const isWaktunyaUjian = (item) => {
  let currentdate = new Date();
  let yyyy = currentdate.getFullYear();
  let mm = (currentdate.getMonth()+1).toString().padStart(2, '0');
  let dd = currentdate.getDate().toString().padStart(2, '0');
  let yyyyMMdd_today = `${yyyy}-${mm}-${dd}`;
  let h = currentdate.getHours().toString().padStart(2, '0');
  let m = currentdate.getMinutes().toString().padStart(2, '0');
  let hhMM_today = `${h}:${m}`;
  if(yyyyMMdd_today === item.tanggal && hhMM_today >= item.mulai && hhMM_today <= item.selesai){
    return true
  }
  return false
}


const dataKelas = computed(()=>{
  let keyDaftar = Object.keys(masterKelas.value);
  if(keyDaftar.length === 0) return [];
  let data = [];
  for(let i=0; i< keyDaftar.length; i++){
    masterKelas.value[keyDaftar[i]].key = keyDaftar[i];
    data.push(masterKelas.value[keyDaftar[i]]);
  }
  return data;
})

watch(dataKelas, (val) =>{
  if(val.length > 0){
    let obj = {};
    for(let i=0; i< val.length; i++){
      obj[val[i].key] = val[i]
    }
    listKelas.value = JSON.parse(JSON.stringify(obj))
  }else{
    listKelas.value = {}
  }
})


const router = useRouter();

const mulaiUjian = () => {
  dialog.value = false;
  emitter.emit('toggleLogout', false)
  router.push({
    name: 'Pengerjaan Soal',
    params: {
      id: itemUjian.value.key
    }
  })
}

</script>

<style scoped>
.dialogPanel{
  max-width: 700px;
}
</style>