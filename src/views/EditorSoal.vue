<template>
  <v-container fluid class="bg-grey-lighten-6 h-100">
    <v-row align="center" justify="center">
      <v-col>
        <v-breadcrumbs :items="breadcrumbs">
          <template v-slot:title="{ item }">
            {{ item.title.toUpperCase() }}
          </template>
          &nbsp;&nbsp;
          <v-btn size="x-small" color="primary" @click="tambahSoalBtn"><v-icon>mdi-plus</v-icon> Tambah Soal</v-btn>
        </v-breadcrumbs>
        
        <div class="rounded-lg mt-4 pa-3 container-soal" id="inside-soal-id">
          <div class="inside-soal" >
            <div v-if="ujian && ujian.soal">
              <div v-for="(soal, idx) in listSoal" class="mx-3 my-2">

                <div v-if="editMode && editId === soal.key" class="animate__animated animate__fadeIn">
                  <h4 class="mt-2 mb-3">
                    <v-chip color="primary">Nomor {{ idx + 1 }}</v-chip>
                    <v-tooltip text="Tutup Mode Menyunting" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn class="ml-2" v-bind="props" icon variant="outlined" size="x-small" @click="batalUbahPertanyaan">
                          <v-icon class="text-primary" size="x-large">mdi-close-circle</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                  </h4>
                  <div>
                    <h5 class="ma-2">Pertanyaan</h5>
                    <QuillEditor 
                      ref="editor"
                      v-model:content="ujian.soal[soal.key].pertanyaan" 
                      content-type="html"
                      theme="snow" 
                      :toolbar="toolbarOptions" 
                      @text-change="gantiPertanyaan(soal.key)"
                    />
                    <h5 class="ma-2 mt-5 mb-5">Opsi Pilihan Ganda</h5>
                    <v-row class="pr-4">
                      <v-col cols="6" v-for="(opsi, key) in soal.opsi_jawaban" class="pa-0 pl-4">
                        <v-text-field density="compact" :label="`Opsi Jawaban ke-${key + 1}`" variant="outlined" v-model="ujian.soal[soal.key].opsi_jawaban[key].jawaban">
                          <template #append>
                            <v-tooltip text="Tandai sebagai jawaban benar" location="left" >
                              <template v-slot:activator="{ props }">
                                <v-checkbox v-model="ujian.soal[soal.key].opsi_jawaban[key].isTrue" @click="setJawabanTrue(key, soal.key)" v-bind:="props" style="margin-bottom: -48px; margin-top: -24px" label=""></v-checkbox>
                              </template>
                            </v-tooltip>
                            
                          </template>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </div>
                </div>
                <div v-else class="animate__animated animate__fadeIn">
                  <h4 class="mt-2 mb-3">
                    <v-chip color="primary">Nomor {{ idx + 1 }}</v-chip>
                    <v-tooltip text="Ubah Pertanyaan" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn class="ml-2" v-bind="props" icon variant="outlined" size="x-small" @click="ubahPertanyaan(soal.key, soal)">
                          <v-icon class="text-primary" size="x-large">mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                    <v-tooltip text="Hapus Pertanyaan" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn class="ml-2" v-bind="props" icon variant="outlined" size="x-small" @click="hapusPertanyaan(soal.key)">
                          <v-icon class="text-primary" size="x-large">mdi-delete</v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                  </h4>
                  <div class="mx-1 mt-1 mb-3" v-html="soal.pertanyaan"></div>
                  <div class="mt-5 mb-5">
                    <v-row>
                      <v-col cols="12" v-for="opsi in soal.opsi_jawaban">
                        <v-checkbox v-model="opsi.isTrue" readonly style="margin-bottom: -48px; margin-top: -24px" :label="opsi.jawaban" :value="true"></v-checkbox>
                      </v-col>
                    </v-row>
                  </div>
                </div>
                <v-divider class="my-10"></v-divider>
              </div>
              
            </div>
            <v-expansion-panels 
              v-model="accordion" 
              multiple
            >
              <v-expansion-panel
                title="Tambah Soal"
                @group:selected="accordionEvent"
              >
                <template #text>
                  <div>
                    <h5 class="ma-2">Pertanyaan</h5>
                    <QuillEditor 
                      ref="editor"
                      v-model:content="pertanyaan" 
                      content-type="html"
                      theme="snow" 
                      :toolbar="toolbarOptions" 
                    />
                    <h5 class="ma-2 mt-5 mb-5">Opsi Pilihan Ganda</h5>
                    <v-row class="pr-4">
                      <v-col cols="6" v-for="(opsi, key) in opsi_jawaban" class="pa-0 pl-4">
                        <v-text-field density="compact" :label="`Opsi Jawaban ke-${key + 1}`" variant="outlined" v-model="opsi_jawaban[key].jawaban">
                          <template #append>
                            <v-tooltip text="Tandai sebagai jawaban benar" location="left" >
                              <template v-slot:activator="{ props }">
                                <v-checkbox v-model="opsi_jawaban[key].isTrue" @click="setJawabanTrue(key)" v-bind:="props" style="margin-bottom: -48px; margin-top: -24px" label=""></v-checkbox>
                              </template>
                            </v-tooltip>
                            
                          </template>
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <div class="text-right pr-5 pt-5 pb-5">
                      <v-btn @click="simpanSoal" class="ml-4" color="primary">Tambah</v-btn>
                    </div>
                  </div>
                </template>
                
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
          
        </div>
        <v-dialog
          v-model="dialogDelete"
          width="100%"
          max-width="400px"
          persistent
          scrollable=""
        >
          <v-card>
            <v-card-title class="pa-0">
              <v-toolbar flat color="red-lighten-1" title="Hapus Pertanyaan"></v-toolbar>
            </v-card-title>
            <v-card-text>
              <v-row class="pa-2 dialogPanel" align="center" justify="center">
                <v-col cols="12" class="text-center">
                  <div class="dialogPanel mx-auto">
                    Yakin ingin menghapus pertanyaan ini: "{{ deleteId !== null && ujian.soal[deleteId] ? removeHTMLTags(ujian.soal[deleteId].pertanyaan) : '-' }}"?
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
import { useRoute } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import { convertGet, getWatch, push, remove, update } from '@/plugins/firebasedb';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import 'animate.css'
import debounce from '@/plugins/debounce';

const breadcrumbs = ref()

const route = useRoute();
const ujian = ref(null)
const subscribeList = ref({})
const listSoal = ref([])
onMounted(async () => {
  subscribeList.value.ujian = getWatch('/ujian/'+route.params.id, (result)=>{
    ujian.value = result;
    listSoal.value = convertGet(result.soal);
    if(listSoal.value.length === 0 ) accordion.value = [0]
    breadcrumbs.value = [
      {
        title: 'Kelola Ujian',
        disabled: false,
        href: '/#/kelola-ujian',
      },
      {
        title: 'Editor Soal '  + result.nama,
        disabled: true,
        href: '#',
      },
    ]
  })
})

onUnmounted(()=>{
  Object.keys(subscribeList.value).forEach(function(key) {
    subscribeList.value[key]();
  });
})

const toolbarOptions = [
  [{ 'font': [] }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'align': [] }],
  ['code-block'],
  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  [{ 'color': [] }, { 'background': [] }],
]

const editor = ref(null)
const pertanyaan = ref('')
const opsi_jawaban = ref([
  {jawaban: '', isTrue: true},
  {jawaban: '', isTrue: false},
  {jawaban: '', isTrue: false},
  {jawaban: '', isTrue: false}
])

const setJawabanTrue = (key, soalKey=null) => {
  if(soalKey===null){
    for(let i=0; i<opsi_jawaban.value.length; i++){
      opsi_jawaban.value[i].isTrue = false;
    }
    setTimeout(()=>{
      opsi_jawaban.value[key].isTrue = true;
    }, 10)
  }else{
    for(let i=0; i<ujian.value.soal[soalKey].opsi_jawaban.length; i++){
      ujian.value.soal[soalKey].opsi_jawaban[i].isTrue = false;
    }
    setTimeout(async ()=>{
      let alter_opsi_jawaban = ujian.value.soal[soalKey];
      alter_opsi_jawaban.opsi_jawaban[key].isTrue = true;
      await update(`/ujian/${route.params.id}/soal/${soalKey}`, alter_opsi_jawaban)
    }, 10)
  }
  
  
}

const snackbar = ref(false)
const errorMessage = ref('')
const simpanSoal = async () => {
  let pertanyaan_text = editor.value.getText();
  if(pertanyaan_text.length === 1){
    errorMessage.value = 'Pertanyaan tidak boleh kosong';
    snackbar.value = true;
    return;
  }
  for(let i=0; i<opsi_jawaban.value.length; i++){
    if(opsi_jawaban.value[i].jawaban === ''){
      errorMessage.value = 'Opsi Jawaban harus terisi semua';
      snackbar.value = true;
      return;
    }
  }
  await push('/ujian/' + route.params.id + '/soal', {
    pertanyaan: pertanyaan.value,
    opsi_jawaban: opsi_jawaban.value
  })
  pertanyaan.value = '';
  opsi_jawaban.value = [
    {jawaban: '', isTrue: true},
    {jawaban: '', isTrue: false},
    {jawaban: '', isTrue: false},
    {jawaban: '', isTrue: false}
  ]
  accordion.value = [-1]
}

const accordion = ref([-1])

const tambahSoalBtn = () => {
  accordion.value = [0];  
}

const accordionEvent = ({value}) => {
  if(value){
    setTimeout(()=>{
      const element = document.getElementById('inside-soal-id');
      element.scrollTo({top: element.scrollHeight, behavior: 'smooth'});
    },350)
  }
}

const removeHTMLTags = (html) => {
  const regexForStripHTML = /(<([^>]+)>)/ig
  const stripContent = html.replaceAll(regexForStripHTML, '');
  return stripContent;
}

const gantiPertanyaan = debounce(async (soalKey)=>{
  let text = ujian.value.soal[soalKey].pertanyaan;
  let stripContent = removeHTMLTags(text)
  if(stripContent.length === 0){
    errorMessage.value = 'Pertanyaan tidak boleh kosong';
    snackbar.value = true;
    return;
  }

  let alter_pertanyaan = ujian.value.soal[soalKey];
  alter_pertanyaan.pertanyaan = text;
  await update(`/ujian/${route.params.id}/soal/${soalKey}`, alter_pertanyaan)
},500)

const editId = ref(null)
const editMode = ref(false)
const ubahPertanyaan = (key, item) => {
  editId.value = key;
  editMode.value = true;
}

const batalUbahPertanyaan = () => {
  editId.value = null
  editMode.value = false
}


const dialogDelete = ref(false)
const deleteId = ref(null)
const loadingDialog = ref(false)
const hapusPertanyaan = (key) => {
  deleteId.value = key
  dialogDelete.value = true;
} 

const deleteDialog = async () => {
  loadingDialog.value = true;
  await remove(`/ujian/${route.params.id}/soal/${deleteId.value}`)
  dialogDelete.value = false;
  loadingDialog.value = false;
}

</script>

<style scoped>
.container-soal{
  background-color: white !important;
  height: calc(100vh - 170px);
  overflow-y: auto;
}
</style>