<template>
  <v-container fluid class="bg-grey-lighten-6 h-100">
    <v-row align="center" justify="center">
      <v-col>
        <h3 class="pl-4"> Kelola Admin </h3>
        
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
                    Email
                  </th>
                  <th class="text-left">
                    Entitas
                  </th>
                  <th class="text-left">
                    Level Pengguna
                  </th>
                  <th class="text-left">
                    Status
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
                  <td>{{ item.email }}</td>
                  <td>{{ listEntitas[item.entitas_key].nama }}</td>
                  <td>{{ listLevelUser[item.level_user_key].nama }}</td>
                  <td>{{ item.status }}</td>
                  <td class="text-right" style="min-width:200px">
                    <v-tooltip :text="item.status==='Pending' ? 'Kirim Ulang Undangan' : 'Reset Password'" location="top"  v-if="user.key !== item.key"> 
                      <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" size="small" variant="plain" @click="resendDialog(item.email)">
                          <v-icon class="text-primary" size="x-large">mdi-email-fast-outline</v-icon> 
                        </v-btn>
                      </template>
                    </v-tooltip>
                    <v-tooltip text="Ubah" location="top" v-if="user.key !== item.key"> 
                      <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" size="small" variant="plain" @click="editDialog(item.key, item)">
                          <v-icon class="text-primary" size="x-large">mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                    <v-tooltip text="Hapus" location="top" v-if="user.key !== item.key"> 
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
            Tidak ada admin
          </div> -->
        </div>
        <div class="fab bg-primary">
          <v-tooltip text="Tambah Pengguna" location="top">
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
              <v-toolbar flat color="primary" :title="modeDialog === 'add' ? 'Tambah Admin' : 'Perbarui Admin'"></v-toolbar>
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
                        v-model="email"
                        label="Email"
                        type="text"
                        variant="outlined"
                        class="pb-2"
                        :rules="emailRules"
                        :disabled="loadingDialog || modeDialog==='edit'"
                        :hint="modeDialog==='edit' ? '' : 'Undangan akan dikirim melalui email, pastikan isian benar'"
                        :persistent-hint="true"
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
                        v-model="leveluser"
                        :items="dataLevel"
                        :rules="defaultSelectRules"
                        :disabled="loadingDialog"
                        variant="outlined"
                        item-title="nama"
                        item-value="key"
                        label="Level Pengguna"
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
          v-model="dialogDelete"
          width="100%"
          max-width="400px"
          persistent
          scrollable=""
        >
          <v-card>
            <v-card-title class="pa-0">
              <v-toolbar flat color="red-lighten-1" title="Hapus Admin"></v-toolbar>
            </v-card-title>
            <v-card-text>
              <v-row class="pa-2 dialogPanel" align="center" justify="center">
                <v-col cols="12" class="text-center">
                  <div class="dialogPanel mx-auto">
                    Yakin ingin menghapus {{ deleteUser !==null ? deleteUser.nama : '-' }}?
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

        <v-dialog
          v-model="dialogEmail"
          width="100%"
          max-width="400px"
          persistent
          scrollable=""
        >
          <v-card>
            <v-card-title class="pa-0">
              <v-toolbar flat color="orange-darken-3" title="Kirim Ulang Undangan"></v-toolbar>
            </v-card-title>
            <v-card-text>
              <v-row class="pa-2 dialogPanel" align="center" justify="center">
                <v-col cols="12" class="text-center">
                  <div class="dialogPanel mx-auto">
                    Yakin ingin mengirim ulang undangan ke {{ emailUndangan }}?
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="ml-auto">
              <v-btn :disabled="loadingDialog" color="grey" @click="dialogEmail = false">Batal</v-btn>
              <v-btn type="submit" :loading="loadingDialog" color="primary" @click="emailDialog">Kirim</v-btn>
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
import { push, convertGet, getWatch, update, get, set } from '@/plugins/firebasedb';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signOut} from '@firebase/auth';
import { auth as auth_clone } from '@/plugins/firebase_clone';
import { useUserStore } from '@/store/user';

const dataTable = ref([]);
const dataTable_master = ref([])
const constructDataTable = (mainTable) =>{
  loading.value = true;
  if(mainTable && Object.keys(mainTable).length > 0){
    let convert = convertGet(mainTable);
    dataTable_master.value = JSON.parse(JSON.stringify(convert.filter(x => {
      if(user.value.entitas_key !== '-NQUWcFOHoCWcgZtnuo3')
        return x.entitas_key !== '-NQUWcFOHoCWcgZtnuo3' && x.entitas_key === user.value.entitas_key && x.level_user_key !== '-NQUa76pkOfJQB8mJuDb' && x.status !== 'Deleted';
      return x.entitas_key !== '-NQUWcFOHoCWcgZtnuo3' && x.level_user_key !== '-NQUa76pkOfJQB8mJuDb' && x.status !== 'Deleted';
    })));
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
const listLevelUser = ref(null)
const user = ref(null)
const userStore = useUserStore();
onMounted(async ()=>{
  loading.value = true;
  // load user
  let userLogin = await get('/users', 'email', userStore.user.email);
  let idUser = Object.keys(userLogin)[0]
  user.value = userLogin[idUser]
  user.value.key = idUser

  subscribeList.value.entitas = getWatch('/entitas', (result)=>{
    listEntitas.value = result;
  });

  subscribeList.value.level_user = getWatch('/level_user', (result)=>{
    listLevelUser.value = result;
  });

  subscribeList.value.users = getWatch('/users', (result)=>{
    constructDataTable(result);
  });

  
})
onUnmounted(()=>{
  Object.keys(subscribeList.value).forEach(function(key) {
    subscribeList.value[key]();
  });
})

const nama = ref('')
const email = ref('')
const entitas = ref(null)
const leveluser = ref(null)
const defaultRules = [
  value => {
    if (value) return true
    return 'Isian ini tidak boleh kosong'
  },
]
const emailRules = [
  value => {
    var patternEmail = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
  
    if(value && patternEmail.test(value)) return true
    else if(value) return 'Format isian harus berupa email'
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
  email.value = ''
  entitas.value = null
  leveluser.value = null
}

const queryPencarian = ref('');
const loading = ref(false)
const filterTable = (val) => {
  loading.value = true;
  let newData = dataTable_master.value.filter(function(item){
    return item.nama.toLowerCase().includes(val.toLowerCase()) 
      || item.email.toLowerCase().includes(val.toLowerCase())
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
const snackbar = ref(false)
const errorMessage = ref('')
const simpanDialog = async () => {
  loadingDialog.value = true;
  const { valid } = await form.value.validate()
  if(valid){
    let postData = {
      nama: nama.value,
      email: email.value,
      entitas_key: entitas.value,
      level_user_key: leveluser.value,
    }
    if(editId.value !== null){
      await update('/users/' + editId.value, postData)
      editId.value = null
      dialog.value = false;
    }else{
      // cek user dulu
      let cekUser = await get('/users', 'email', postData.email)
      if(cekUser !== null){
        let idUser = Object.keys(cekUser)[0];
        if(cekUser[idUser].status === 'Deleted'){
          postData.status = 'Pending'
          await set('/users/' + idUser, postData);
          await sendPasswordResetEmail(auth_clone, postData.email)
          dialog.value = false;
        }else{
          errorMessage.value = `Email ${postData.email} sudah pernah didaftarkan`;
          snackbar.value = true;
        }
        
      }else{
        postData.status = 'Pending'
        await push('/users', postData)
        let password = randomPasswordGenerator();
        await createUserWithEmailAndPassword(auth_clone, postData.email, password);
        await sendPasswordResetEmail(auth_clone, postData.email)
        await signOut(auth_clone);
        dialog.value = false;
      }

      
    }
    
  }

  loadingDialog.value = false;
}

const randomPasswordGenerator = () => {
  var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var passwordLength = 12;
  var password = "";
  for (var i = 0; i <= passwordLength; i++) {
   var randomNumber = Math.floor(Math.random() * chars.length);
   password += chars.substring(randomNumber, randomNumber +1);
  }
  return password;
}

const editDialog = (key, item) => {
  nama.value = item.nama;
  email.value = item.email;
  entitas.value =item.entitas_key;
  leveluser.value =item.level_user_key;
  modeDialog.value = 'edit';
  editId.value = key
  dialog.value = true
}

const dialogDelete = ref(false)
const deleteId = ref(null)
const deleteUser = computed(() => {
  if(deleteId.value !== null){
    let confirmUser = dataTable.value.filter(x => x.key === deleteId.value)[0];
    if(confirmUser) return confirmUser
    return null;
  }
  return null;
})
const deleteDialog = async () => {
  loadingDialog.value = true;
  let deletedUser = JSON.parse(JSON.stringify(deleteUser.value));
  delete deletedUser.key;
  deletedUser.status = 'Deleted'
  await set('/users/' + deleteId.value, deletedUser)
  // await remove('/users/' + deleteId.value)
  dialogDelete.value = false;
  loadingDialog.value = false;
}
const confirmDialog = (key) =>{
  deleteId.value = key
  dialogDelete.value = true;
}

const dialogEmail = ref(false)
const emailUndangan = ref('')
const emailDialog = async () => {
  loadingDialog.value = true;
  await sendPasswordResetEmail(auth_clone, emailUndangan.value)
  dialogEmail.value = false;
  loadingDialog.value = false;
}
const resendDialog = (email_) =>{
  emailUndangan.value = email_
  dialogEmail.value = true;
}


const dataEntitas = computed(()=>{
  let data = listEntitas.value === null ? [] : convertGet(listEntitas.value);
  // dropdown yang muncul harus sesuai dengan hak aksesnya
  if(data.length > 0) data = data.filter((x) => {
    if(user.value.entitas_key !== '-NQUWcFOHoCWcgZtnuo3')
      return x.key === user.value.entitas_key
    return x.key !== '-NQUWcFOHoCWcgZtnuo3';
  })
  return data;
})

const dataLevel = computed(()=>{
  let data = listLevelUser.value === null ? [] : convertGet(listLevelUser.value);
  // dropdown yang muncul harus sesuai dengan hak aksesnya
  if(data.length > 0) data = data.filter((x) => {
    // let level = ['-NQUa75BeXo4mHE4ONGv', '-NQUa75p8J8UkcdGKgpS', '-NQUa76LUBbmjQwboeIQ']
    // let idx = -1;
    // for(let i=1; i<level.length; i++){
    //   if(user.value.level_user_key === level[i]){
    //     idx = i;
    //     break;
    //   }
    // }
    return x.key !== '-NQUa76pkOfJQB8mJuDb' && x.key !== '-NQUa75BeXo4mHE4ONGv' //level.splice(idx).includes(x.key)
  });
  return data
})


</script>

<style scoped>
.dialogPanel{
  max-width: 700px;
}
</style>