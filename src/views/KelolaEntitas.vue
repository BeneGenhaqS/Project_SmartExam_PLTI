<template>
  <v-container fluid class="bg-grey-lighten-6 h-100">
    <v-row align="center" justify="center">
      <v-col>
        <h3 class="pl-4"> Kelola Institusi </h3>
        
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
                    Nama
                  </th>
                  <th class="text-left">
                    Alamat
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
                  <td>{{ item.alamat }}</td>
                  <td class="text-center" style="min-width:200px">
                    <div v-if="item.key !== '-NQUWcFOHoCWcgZtnuo3'">
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
                  </div>
                    
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
            Tidak ada institusi
          </div> -->
        </div>
        <div class="fab bg-primary">
          <v-tooltip text="Tambah Institusi" location="top">
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
          max-width="400px"
          persistent
          scrollable
        >
          <v-card>
            <v-card-title class="pa-0">
              <v-toolbar flat color="primary" :title="modeDialog === 'add' ? 'Tambah Institusi' : 'Perbarui Institusi'"></v-toolbar>
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

                      <v-text-field
                        v-model="alamat"
                        label="Alamat"
                        type="text"
                        variant="outlined"
                        class="pb-2"
                        :rules="defaultRules"
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
              <v-toolbar flat color="red-lighten-1" title="Hapus Institusi"></v-toolbar>
            </v-card-title>
            <v-card-text>
              <v-row class="pa-2 dialogPanel" align="center" justify="center">
                <v-col cols="12" class="text-center">
                  <div class="dialogPanel mx-auto">
                    Yakin ingin menghapus {{ deleteEntitas !==null ? deleteEntitas.nama : '-' }}?
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
import { push, convertGet, getWatch, update, remove, get } from '@/plugins/firebasedb';

const dataTable = ref([]);
const dataTable_master = ref([])
const constructDataTable = (mainTable) =>{
  loading.value = true;
  if(mainTable && Object.keys(mainTable).length > 0){
    let convert = convertGet(mainTable);
    convert = convert.filter(x => {
      return x.key !== '-NQUWcFOHoCWcgZtnuo3'
    })
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
onMounted(async ()=>{
  loading.value = true;
  subscribeList.value.entitas = getWatch('/entitas', (result)=>{
    constructDataTable(result);
  });
})
onUnmounted(()=>{
  Object.keys(subscribeList.value).forEach(function(key) {
    subscribeList.value[key]();
  });
})

const nama = ref('')
const alamat = ref('')
const defaultRules = [
  value => {
    if (value) return true
    return 'Isian ini tidak boleh kosong'
  },
]
const clearAnswer = () => {
  nama.value = '';
  alamat.value = '';
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
      alamat: alamat.value
    }
    if(editId.value !== null){
      await update('/entitas/' + editId.value, postData)
      editId.value = null
    }else{
      await push('/entitas', postData)
    }
    dialog.value = false;
  }

  loadingDialog.value = false;
}

const editDialog = (key, item) => {
  nama.value = item.nama;
  alamat.value = item.alamat
  modeDialog.value = 'edit';
  editId.value = key
  dialog.value = true
}

const dialogDelete = ref(false)
const deleteId = ref(null)
const deleteEntitas = computed(() => {
  if(deleteId.value !== null){
    let confirmEntitas = dataTable.value.filter(x => x.key === deleteId.value)[0];
    if(confirmEntitas) return confirmEntitas
    return null;
  }
  return null;
})

const snackbar = ref(false);
const errorMessage = ref('')
const deleteDialog = async () => {
  loadingDialog.value = true;
  errorMessage.value = '';
  let cekUsers = await get('/users', 'entitas_key', deleteEntitas.value.key)
  if(cekUsers !== null){
    errorMessage.value = `Entitas ${deleteEntitas.value.nama} tidak bisa dihapus karena memiliki pengguna aktif`;
    snackbar.value = true;
  }else{
    await remove('/entitas/' + deleteId.value)
  }
  dialogDelete.value = false;
  loadingDialog.value = false;
}
const confirmDialog = (key) =>{
  deleteId.value = key
  dialogDelete.value = true;
}


</script>

<style scoped>
.dialogPanel{
  max-width: 600px;
}
</style>