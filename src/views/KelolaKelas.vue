<template>
  <v-container fluid class="bg-grey-lighten-6 h-100">
    <v-row align="center" justify="center">
      <v-col>
        <h3 class="pl-4"> Kelola Kelas </h3>
        
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
                    Kelas
                  </th>
                  <th class="text-left">
                    Jumlah Peserta
                  </th>
                  <th class="text-left">
                    Entitas
                  </th>
                  <th class="text-right">
                    
                  </th>
                </tr>
              </thead>
              <tbody v-if="!loading">
                <tr
                  v-for="item in dataTable"
                  :key="item.key"
                >
                  <td>{{ item.nama }}</td>
                  <td>{{ item.peserta ? item.peserta.length : 0 }}</td>
                  <td>{{ listEntitas[item.entitas_key].nama }}</td>
                  <td class="text-right" style="min-width:200px">
                    <v-tooltip text="Lihat Peserta" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" size="small" variant="plain" @click="viewPeserta(item.key, item)">
                          <v-icon class="text-primary" size="x-large">mdi-eye</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                    <v-tooltip text="Ubah" location="top">
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
            Tidak ada kelas
          </div> -->
        </div>
        <div class="fab bg-primary">
          <v-tooltip text="Tambah Kelas" location="top">
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
              <v-toolbar flat color="primary" :title="modeDialog === 'add' ? 'Tambah Kelas' : 'Perbarui Kelas'"></v-toolbar>
            </v-card-title>
            <v-card-text class="">
              <v-row class="pa-2 dialogPanel no-gutters" align="center" justify="center">
                <v-col cols="12" class="text-center">
                  
                  <div class="dialogPanel mx-auto">
                    <v-form ref="form" @submit.prevent="simpanDialog">
                      <v-text-field
                        v-model="nama"
                        label="Nama"
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
                        :disabled="loadingDialog || modeDialog==='edit'"
                        variant="outlined"
                        item-title="nama"
                        item-value="key"
                        label="Entitas"
                        v-if="user.entitas_key === '-NQUWcFOHoCWcgZtnuo3'"
                      ></v-select>
                      
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
          v-model="dialogPeserta"
          width="100%"
          max-width="500px"
          persistent
          scrollable
        >
          <v-card>
            <v-card-title class="pa-0">
              <v-toolbar flat color="primary" title="Daftar Peserta"></v-toolbar>
            </v-card-title>
            <v-card-text class="">
              <v-row class="pa-2 dialogPanel no-gutters" align="center" justify="center">
                <v-col cols="12" class="text-left">
                  
                  <div class="dialogPanel mx-auto">
                    <v-text-field v-model="filterPeserta" variant="outlined" label="Pencarian" density="compact"/>
                    <v-divider class="mb-4"></v-divider>
                    <v-checkbox
                      v-for="item in listUser"
                      v-model="listPeserta"
                      :label="`${item.nama} (${item.email})`"
                      :value="item.key"
                      density="compact"
                    ></v-checkbox>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="ml-auto">
              <v-btn color="grey" @click="dialogPeserta = false; kelasId = false">Tutup</v-btn>
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
              <v-toolbar flat color="red-lighten-1" title="Hapus Kelas"></v-toolbar>
            </v-card-title>
            <v-card-text>
              <v-row class="pa-2 dialogPanel" align="center" justify="center">
                <v-col cols="12" class="text-center">
                  <div class="dialogPanel mx-auto">
                    Yakin ingin menghapus kelas {{ deleteKelas !==null ? deleteKelas.nama : '-' }}?
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
          color="red-lighten-1"
        >
          {{ errorMessage }}
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted, computed, onUnmounted } from 'vue'
import debounce from '@/plugins/debounce'
import { push, convertGet, getWatch, update, get, remove, set } from '@/plugins/firebasedb';
import { useUserStore } from '@/store/user';


const dataTable = ref([]);
const dataTable_master = ref([])
const constructDataTable = (mainTable) =>{
  loading.value = true;
  if(mainTable && Object.keys(mainTable).length > 0){
    let convert = convertGet(mainTable);
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
    subscribeList.value.users = getWatch('/kelas', (result)=>{
      constructDataTable(result);
    });
  }else{
    subscribeList.value.users = getWatch('/kelas', (result)=>{
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
const entitas = ref(null)
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
const clearAnswer = () => {
  nama.value = '';
  entitas.value = null
}

const queryPencarian = ref('');
const loading = ref(false)
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
const modeDialog = ref('add')
const editId = ref(null)
const showDialog = () => {
  clearAnswer();
  modeDialog.value = 'add';
  editId.value = null;
  editDialog.value = null

  if(user.value.entitas_key !== '-NQUWcFOHoCWcgZtnuo3'){
    entitas.value = user.value.entitas_key
  }
  dialog.value = true
}
const loadingDialog = ref(false)
const form = ref(null)
const simpanDialog = async () => {
  loadingDialog.value = true;
  const { valid } = await form.value.validate()
  if(valid){
    let postData = {
      nama: nama.value,
      entitas_key: entitas.value,
    }
    if(editId.value !== null){
      await update('/kelas/' + editId.value, postData)
      editId.value = null
      dialog.value = false;
    }else{
      postData.peserta = []
      await push('/kelas', postData)
      dialog.value = false;
    }
    
  }

  loadingDialog.value = false;
}

const editDialog = (key, item) => {
  nama.value = item.nama;
  entitas.value =item.entitas_key;
  modeDialog.value = 'edit';
  editId.value = key
  dialog.value = true
}

const kelasId = ref(null)
const dialogPeserta = ref(false)
const listUser = ref(null)
const listPeserta = ref([])
const listUser_master = ref([])
const filterPeserta = ref('')
const viewPeserta = async (key, item) => {
  kelasId.value = key
  let getCurrentPeserta = await get('/kelas/' + key + '/peserta');
  listPeserta.value = getCurrentPeserta ? getCurrentPeserta : []
  let getUser = convertGet(await get('/users', 'entitas_key', item.entitas_key))
  getUser = getUser.filter(x => x.level_user_key === '-NQUa76pkOfJQB8mJuDb');
  listUser_master.value = JSON.parse(JSON.stringify(getUser))
  listUser.value = JSON.parse(JSON.stringify(getUser))
  dialogPeserta.value = true
}

const filterListPeserta = (val) => {
  let newData = listUser_master.value.filter(function(item){
    return item.nama.toLowerCase().includes(val.toLowerCase()) 
  });
  listUser.value = JSON.parse(JSON.stringify(newData))
}
watch(filterPeserta,debounce((val)=>{
  filterListPeserta(val)
}, 500))

watch(listPeserta, async (val)=>{
  await set('/kelas/' + kelasId.value + '/peserta', val);
})

const dialogDelete = ref(false)
const deleteId = ref(null)
const deleteKelas = computed(() => {
  if(deleteId.value !== null){
    let confirmKelas = dataTable.value.filter(x => x.key === deleteId.value)[0];
    if(confirmKelas) return confirmKelas
    return null;
  }
  return null;
})

const snackbar = ref(false)
const errorMessage = ref('')
const deleteDialog = async () => {
  loadingDialog.value = true;
  // cek apakah sudah ada ujian
  let getUjian = await get('/ujian', 'kelas_key', deleteId.value);
  if(getUjian === null){
    await remove('/kelas/' + deleteId.value)
  }else{
    snackbar.value = true;
    errorMessage.value = 'Tidak bisa menghapus kelas ' + deleteKelas.value.nama + ' karena telah memiliki ujian'
  }
  dialogDelete.value = false;
  loadingDialog.value = false;
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



</script>

<style scoped>
.dialogPanel{
  max-width: 700px;
}
</style>