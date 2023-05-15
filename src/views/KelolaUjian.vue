<template>
  <v-container fluid class="bg-grey-lighten-6 h-100">
    <v-row align="center" justify="center">
      <v-col>
        <h3 class="pl-4"> Kelola Ujian </h3>
        
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
              <div v-if="loading" class="mx-auto text-center">
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </div>
              <thead v-if="!loading">
                <tr>
                  <th class="text-left">
                    Nama Ujian
                  </th>
                  <th class="text-left">
                    Kelas
                  </th>
                  <th class="text-left">
                    Entitas
                  </th>
                  <th class="text-left">
                    Pelaksanaan
                  </th>
                  <th class="text-left">
                    Jumlah Soal
                  </th>
                  <th class="text-center">
                    
                  </th>
                </tr>
              </thead>
              <tbody v-if="!loading">
                <tr
                  v-for="item in dataTable"
                  :key="item.key"
                >
                  <td>{{ item.nama }}</td>
                  <td>{{ listKelas[item.kelas_key].nama }}</td>
                  <td>{{ listEntitas[item.entitas_key].nama }}</td>
                  <td> {{ item.tanggal }} {{ item.mulai }}-{{ item.selesai }}</td>
                  <td>{{ item.soal ? Object.keys(item.soal).length : 0 }}</td>
                  <td class="text-right" style="min-width:250px">
                    <v-tooltip text="Lihat Soal" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" size="small" variant="plain" @click="listSoal(item.key)">
                          <v-icon class="text-primary" size="x-large">mdi-list-status</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                    <v-tooltip v-if="item.hasilUjian !== null" text="Lihat Hasil Ujian" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" size="small" variant="plain" @click="lihatHasilUjian(item.key)">
                          <v-icon class="text-primary" size="x-large">mdi-scoreboard</v-icon> 
                        </v-btn>
                      </template>
                    </v-tooltip>
                    <v-tooltip v-else text="Lihat Hasil Ujian" location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" class="text-grey mx-4" size="small">mdi-scoreboard</v-icon> 
                      </template>
                    </v-tooltip>
                    <v-tooltip text="Ubah Rincian" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" size="small" variant="plain" @click="editDialog(item.key, item)">
                          <v-icon class="text-primary" size="x-large">mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                    <v-tooltip text="Hapus" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" size="small" variant="plain" @click="confirmDialog(item.key)">
                          <v-icon class="text-primary" size="x-large">mdi-delete</v-icon>
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
        <div class="fab bg-primary">
          <v-tooltip text="Tambah Ujian" location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon variant="text" @click="showDialog">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          
        </div>
        <v-dialog
          v-model="dialog"
          width="100%"
          max-width="500px"
          persistent
          scrollable
        >
          <v-card>
            <v-card-title class="pa-0">
              <v-toolbar flat color="primary" :title="modeDialog === 'add' ? 'Tambah ujian' : 'Perbarui rincian ujian'"></v-toolbar>
            </v-card-title>
            <v-card-text class="">
              <v-row class="pa-2 dialogPanel no-gutters" align="center" justify="center">
                <v-col cols="12" class="text-center">
                  
                  <div class="dialogPanel mx-auto">
                    <v-form ref="form" @submit.prevent="simpanDialog">

                      <v-text-field
                        v-model="nama"
                        label="Nama Ujian"
                        type="text"
                        variant="outlined"
                        class="pb-2"
                        :rules="defaultRules"
                        :disabled="loadingDialog"
                      ></v-text-field>


                      <v-select
                        v-model="entitas"
                        :items="dataEntitas"
                        :rules="defaultSelectRules"
                        :disabled="loadingDialog"
                        variant="outlined"
                        item-title="nama"
                        item-value="key"
                        label="Entitas"
                        v-if="user.entitas_key === '-NQUWcFOHoCWcgZtnuo3'"
                      ></v-select>

                      <v-select
                        v-model="kelas"
                        :items="dataKelas"
                        :rules="defaultSelectRules"
                        :disabled="loadingDialog"
                        variant="outlined"
                        item-title="nama"
                        item-value="key"
                        label="Kelas"
                      ></v-select>

                      <v-text-field
                        v-model="tanggal"
                        label="Tanggal"
                        type="date"
                        variant="outlined"
                        class="pb-2"
                        :rules="defaultRules"
                        :disabled="loadingDialog"
                        :min="(new Date().toISOString().split('T')[0])"
                      ></v-text-field>

                      <v-text-field
                        v-model="mulai"
                        label="Mulai"
                        type="time"
                        variant="outlined"
                        class="pb-2"
                        :rules="defaultRules"
                        :disabled="loadingDialog"
                      ></v-text-field>

                      <v-text-field
                        v-model="selesai"
                        label="Selesai"
                        type="time"
                        variant="outlined"
                        class="pb-2"
                        :rules="selesaiTimeRules"
                        :disabled="loadingDialog"
                        
                      ></v-text-field>

                      
                    </v-form>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="ml-auto">
              <v-btn :disabled="loadingDialog" color="grey" @click="dialog = false">Batal</v-btn>
              <v-btn type="submit" :loading="loadingDialog" color="primary" @click="simpanDialog">{{ modeDialog === 'add' ? 'Simpan' : 'Perbarui' }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="dialogDelete"
          width="100%"
          max-width="400px"
          persistent
          scrollable=""
        >
          <v-card>
            <v-card-title class="pa-0">
              <v-toolbar flat color="red-lighten-1" title="Hapus Ujian"></v-toolbar>
            </v-card-title>
            <v-card-text>
              <v-row class="pa-2 dialogPanel" align="center" justify="center">
                <v-col cols="12" class="text-center">
                  <div class="dialogPanel mx-auto">
                    Yakin ingin menghapus ujian {{ deleteUjian !==null ? deleteUjian.nama : '-' }}?
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="ml-auto">
              <v-btn :disabled="loadingDialog" color="grey" @click="dialogDelete = false">Batal</v-btn>
              <v-btn type="submit" :loading="loadingDialog" color="primary" @click="deleteDialog">Hapus</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-snackbar
          v-model="snackbar"
          multi-line
          :timeout="2000"
          color="green-darken-1"
        >
          {{ infoMessage }}
        </v-snackbar>

        <v-snackbar
          v-model="snackbarError"
          multi-line
          :timeout="2000"
          color="red-lighten-1"
        >
          Tidak bisa menghapus ujian karena sudah ada peserta yang melakukan submit pada ujian ini
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted, computed, onUnmounted } from 'vue'
import debounce from '@/plugins/debounce'
import { push, convertGet, getWatch, update, get, remove } from '@/plugins/firebasedb';
import { useUserStore } from '@/store/user';
import { useRouter } from 'vue-router';


const dataTable = ref([]);
const dataTable_master = ref([])
const constructDataTable = async (mainTable) =>{
  loading.value = true;
  if(mainTable && Object.keys(mainTable).length > 0){
    let convert = convertGet(mainTable);
    for(let i=0; i<convert.length; i++){
      convert[i].hasilUjian = await cekHasilUjian(convert[i].key);
    }
    dataTable_master.value = JSON.parse(JSON.stringify(convert));
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
}

const subscribeList = ref({})
const listEntitas = ref(null)
const listKelas = ref(null)
const user = ref(null)
const userStore = useUserStore();
onMounted(async ()=>{
  loading.value = true;
  // load user
  let userLogin = await get('/users', 'email', userStore.user.email);
  let idUser = Object.keys(userLogin)[0]
  user.value = userLogin[idUser]

  subscribeList.value.entitas = getWatch('/entitas', (result)=>{
    listEntitas.value = result;
  });

  if(user.value.entitas_key === '-NQUWcFOHoCWcgZtnuo3'){
    subscribeList.value.entitas = getWatch('/kelas', (result)=>{
      listKelas.value = result;
    });

    subscribeList.value.users = getWatch('/ujian', (result)=>{
      constructDataTable(result);
    });
  }else{
    subscribeList.value.entitas = getWatch('/kelas', (result)=>{
      listKelas.value = result;
    }, 'entitas_key', user.value.entitas_key);

    subscribeList.value.users = getWatch('/ujian', (result)=>{
      constructDataTable(result);
    }, 'entitas_key', user.value.entitas_key);
  }

  
})
onUnmounted(()=>{
  Object.keys(subscribeList.value).forEach(function(key) {
    subscribeList.value[key]();
  });
})

const nama = ref('')
const kelas = ref(null)
const entitas = ref(null)
const tanggal = ref('')
const mulai = ref('')
const selesai = ref('')
const defaultRules = [
  value => {
    if (value) return true
    return 'Isian ini tidak boleh kosong'
  },
]
const defaultSelectRules = [
  value => {
    if (value) return true
    return 'Isian ini tidak boleh kosong'
  },
]
const selesaiTimeRules = [
  value => {
    if (value && value > mulai.value) return true
    if (value <= mulai.value) return 'Jam selesai ujian harus setelah jam mulai'
    return 'Isian ini tidak boleh kosong'
  },
]
const clearAnswer = () => {
  nama.value = '';
  kelas.value = null;
  entitas.value = null;
  tanggal.value = '';
  mulai.value = '';
  selesai.value = '';
}

const queryPencarian = ref('');
const loading = ref(false)
const filterTable = (val) => {
  loading.value = true;
  let newData = dataTable_master.value.filter(function(item){
    return item.nama.toLowerCase().includes(val.toLowerCase()) || item.tanggal.toLowerCase().includes(val.toLowerCase())
  });
  dataTable.value = JSON.parse(JSON.stringify(newData))
  loading.value = false;
}
watch(queryPencarian,debounce((val)=>{
  filterTable(val)
}, 500))

const dialog = ref(false)
const modeDialog = ref('add')
const editId = ref(null)
const showDialog = () => {
  clearAnswer();
  modeDialog.value = 'add';
  editId.value = null;
  editDialog.value = null
  if(user.value.entitas_key !== '-NQUWcFOHoCWcgZtnuo3'){
    entitas.value = user.value.entitas_key;
  }
  dialog.value = true
}
const loadingDialog = ref(false)
const form = ref(null)
const snackbar = ref(false)
const snackbarError = ref(false)
const infoMessage = ref('')
const simpanDialog = async () => {
  loadingDialog.value = true;
  const { valid } = await form.value.validate()
  if(valid){
    let postData = {
      nama: nama.value,
      kelas_key: kelas.value,
      entitas_key: entitas.value,
      tanggal: tanggal.value,
      mulai: mulai.value,
      selesai: selesai.value
    }
    if(editId.value !== null){
      await update('/ujian/' + editId.value, postData)
      editId.value = null
      dialog.value = false;
    }else{
      await push('/ujian', postData)
      dialog.value = false;
    }
    
  }

  loadingDialog.value = false;
}

const editDialog = (key, item) => {
  nama.value = item.nama;
  kelas.value = item.kelas_key;
  entitas.value =item.entitas_key;
  mulai.value = item.mulai;
  tanggal.value = item.tanggal;
  selesai.value = item.selesai;
  modeDialog.value = 'edit';
  editId.value = key
  dialog.value = true
}

const router = useRouter();
const listSoal = (key) => {
  router.push({
    name: 'Editor Soal',
    params: {
      id: key
    }
  })
}
const lihatHasilUjian = (key) => {
  router.push({
    name: 'Hasil Ujian Peserta',
    params: {
      id: key
    }
  })
}

const dialogDelete = ref(false)
const deleteId = ref(null)
const deleteUjian = computed(() => {
  if(deleteId.value !== null){
    let confirmUjian = dataTable.value.filter(x => x.key === deleteId.value)[0];
    if(confirmUjian) return confirmUjian
    return null;
  }
  return null;
})
const deleteDialog = async () => {
  loadingDialog.value = true;
  // cek apakah ujian sudah memiliki hasil yang disubmit peserta
  let cek = await cekHasilUjian(deleteId.value);
  if(cek !== null) {
    snackbarError.value = true;
  }else{
    await remove('/ujian/' + deleteId.value)
  }
  dialogDelete.value = false;
  loadingDialog.value = false;
}
const cekHasilUjian = async (id) => {
  let cek = await get('/hasil_ujian', 'ujian_key', id);
  return cek
}
const confirmDialog = (key) =>{
  deleteId.value = key
  dialogDelete.value = true;
}


const dataEntitas = computed(()=>{
  let data = listEntitas.value === null ? [] : convertGet(listEntitas.value);
  // dropdown yang muncul harus sesuai dengan hak aksesnya
  if(data.length > 0) data = data.filter((x) => {
    if(user.value.entitas_key !== '-NQUWcFOHoCWcgZtnuo3')
      return x.key === user.value.entitas_key;
    return x.key !== '-NQUWcFOHoCWcgZtnuo3'
  })
  return data;
})

const dataKelas = computed(()=>{
  let data = listKelas.value === null ? [] : convertGet(listKelas.value);
  // dropdown yang muncul harus sesuai dengan hak aksesnya
  if(data.length > 0) data = data.filter((x) => {
    if(user.value.entitas_key !== '-NQUWcFOHoCWcgZtnuo3')
      return x.entitas_key === user.value.entitas_key;
    return x.entitas_key === entitas.value
  })
  return data;
})

</script>

<style scoped>
.dialogPanel{
  max-width: 700px;
}
</style>