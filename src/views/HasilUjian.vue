<template>
  <v-container fluid class="bg-grey-lighten-6 h-100">
    <v-row align="center" justify="center">
      <v-col>
        <v-breadcrumbs :items="breadcrumbs">
          <template v-slot:title="{ item }">
            {{ item.title.toUpperCase() }}
          </template>
        </v-breadcrumbs>
        
        <div class="rounded-lg mt-4 pa-3" v-if="listHasil.length > 0">
          <v-expansion-panels multiple class="" v-model="expansion">
            <v-expansion-panel
              v-for="item in listHasil"
              :key="item"
              :value="item.nama"
            >
            
              <v-expansion-panel-title>
                <b>{{ item.user.nama }}</b>&nbsp; dengan Skor: &nbsp;<b>{{ item.detail_bc.data.skor }}</b> &nbsp;dan Keputusan: &nbsp;<b>{{ item.result }}</b>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <h5 class="mt-3 mb-2">Moderasi</h5>
                <v-btn class="ml-0 mb-3" @click.prevent="moderasi(item, 'Lulus')" :variant="item.result==='Lulus' ? 'outlined' : 'text'" size="small" color="green">
                  <v-icon>mdi-check</v-icon>&nbsp; Tandai Lulus
                </v-btn>
                <v-btn class="ml-4 mb-3" @click.prevent="moderasi(item, 'Gagal')" :variant="item.result==='Gagal' ? 'outlined' : 'text'" size="small" color="red">
                  <v-icon>mdi-cancel</v-icon>&nbsp; Tandai Gagal
                </v-btn>

                <h5 class="mt-5">Lembar Jawab</h5>
                <ol class="mx-5 mt-2">
                  <li 
                    v-for="pertanyaan in item.detail_bc.data.pertanyaan" 
                    class="mt-2"
                    v-html="`${pertanyaan.pertanyaan} 
                      <i>${item.detail_bc.data.jawaban[pertanyaan.key] === false ? '' : pertanyaan.opsi_jawaban[item.detail_bc.data.jawaban[pertanyaan.key]].jawaban}</i> 
                      <b>${item.detail_bc.data.jawaban[pertanyaan.key] === false ? '- tidak menjawab -' : (pertanyaan.opsi_jawaban[item.detail_bc.data.jawaban[pertanyaan.key]].isTrue ? ': Benar' : ': Salah')}</b>`"
                  ></li>
                </ol>
                <h5 class="mt-10">Lama Pengerjaan</h5>
                <p>Jumlah Detik Pengerjaan: ±{{ item.detail_bc.data.detikPengerjaan }} detik</p>
                <h5 class="mt-10">Analisis Kecurangan</h5>
                <ol class="mx-5 mt-2">
                  <li class="mt-2">Persentase ketidakmunculan peserta pada layar: <b>{{ item.detail_bc.data.persentaseKecurangan.pesertaTidakTerdeteksi  || 0 }} %</b></li>
                  <li class="mt-2">Persentase wajah peserta pada layar tidak sesuai: <b>{{ item.detail_bc.data.persentaseKecurangan.wajahPesertaTidakCocok  || 0 }} %</b></li>
                  <li class="mt-2">Persentase kemunculan lebih dari satu wajah: <b>{{ item.detail_bc.data.persentaseKecurangan.pesertaLebihDariSatu || 0 }} %</b></li>
                  <li class="mt-2">Persentase kejadian bising pada saat ujian: <b>{{ item.detail_bc.data.persentaseKecurangan.terlaluBerisik  || 0 }} %</b></li>
                </ol>
                <p class="mt-2">Hasil penilaian sistem: <b>{{ kalkulasiKecurangan(item) }}</b></p>
                <h5 class="mt-10">Bukti Kecurangan</h5>
                <ol class="mx-5 mt-2">
                  <li class="mt-2">Bukti ketidakmunculan peserta pada layar:
                    <div v-if="item.detail_bc.data.catatanKecurangan && item.detail_bc.data.catatanKecurangan.pesertaTidakTerdeteksi">
                      <img v-for="gambar in item.detail_bc.data.catatanKecurangan.pesertaTidakTerdeteksi" :src="gambar.image" class="mr-1" />
                    </div>
                    <div v-else><i>- tidak ada -</i></div>
                  </li>
                  <li class="mt-2">Bukti wajah peserta pada layar tidak sesuai:
                    <div v-if="item.detail_bc.data.catatanKecurangan && item.detail_bc.data.catatanKecurangan.wajahPesertaTidakCocok">
                      <img v-for="gambar in item.detail_bc.data.catatanKecurangan.wajahPesertaTidakCocok" :src="gambar.image" class="mr-1" />
                    </div>
                    <div v-else><i>- tidak ada -</i></div>
                  </li>
                  <li class="mt-2">Bukti kemunculan lebih dari satu wajah:
                    <div v-if="item.detail_bc.data.catatanKecurangan && item.detail_bc.data.catatanKecurangan.pesertaLebihDariSatu">
                      <img v-for="gambar in item.detail_bc.data.catatanKecurangan.pesertaLebihDariSatu" :src="gambar.image" class="mr-1" />
                    </div>
                    <div v-else><i>- tidak ada -</i></div>
                  </li>
                  <li class="mt-2">Bukti kejadian bising pada saat ujian:
                    <div v-if="item.detail_bc.data.catatanKecurangan && item.detail_bc.data.catatanKecurangan.terlaluBerisik">
                      <small>Rekaman dari awal hingga akhir:</small> <br/>
                      <audio controls="controls" autobuffer="autobuffer">
                        <source :src="item.detail_bc.data.rekamanSuara" />
                      </audio><br/>
                      <small>Keterangan detail:</small>
                      <div v-for="recorder in item.detail_bc.data.catatanKecurangan.terlaluBerisik">
                        Detik ke-{{ recorder.detikKe }}: decibel: {{ recorder.sound.decibel }}
                      </div>
                    </div>
                    <div v-else><i>- tidak ada -</i></div>
                  </li>
                </ol>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
        <div v-else class="ma-2 bg-white py-5 px-4 rounded-lg font-italic text-center justify-center align-center" >
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import { convertGet, get, getWatch, set } from '@/plugins/firebasedb';
import { get as get_bc, getWatch as watch_bc } from '@/plugins/blockchain/firebasedb'
import { bc_network, getDataBlockchain, loginBlockChain, logoutBlockChain } from '@/plugins/blockchain/config_blockchain';

const breadcrumbs = ref()

const route = useRoute();
const subscribeList = ref({})
const expansion = ref([])
const listHasil = ref([])
onMounted(async () => {
  // login blockchain
  let temp_bc = {}
  let bc_keys = Object.keys(bc_network);
  for(let i =0; i<bc_keys.length; i++){
    temp_bc[bc_keys[i]] = {
      ujian_key: {}
    }
    await loginBlockChain(bc_network[bc_keys[i]].auth);
  }

  subscribeList.value.ujian = getWatch('/ujian/'+route.params.id, (result)=>{
    breadcrumbs.value = [
      {
        title: 'Kelola Ujian',
        disabled: false,
        href: '/#/kelola-ujian',
      },
      {
        title: 'Lihat Hasil Ujian '  + result.nama,
        disabled: true,
        href: '#',
      },
    ]

    

    // get hasil ujian
    subscribeList.value.hasilUjian = getWatch('hasil_ujian', async (result_inner) => {
      let kumpulanHasilUjian = convertGet(result_inner);
      

      // console.log(JSON.parse(JSON.stringify(kumpulanHasilUjian)))
      for(let i=0; i<kumpulanHasilUjian.length; i++){
        kumpulanHasilUjian[i].user = await get('/users/' + kumpulanHasilUjian[i].user_key)

        let temp_bc_second = JSON.parse(JSON.stringify(temp_bc))

        // console.log(kumpulanHasilUjian[i])
        let bc_saved_node = Object.keys(kumpulanHasilUjian[i].detail);
        for(let j=0; j<bc_saved_node.length; j++){
          let key_data_bc = kumpulanHasilUjian[i].detail[bc_saved_node[j]]
          temp_bc_second[bc_saved_node[j]].ujian_key[kumpulanHasilUjian[i].ujian_key]  = await get_bc(bc_network[bc_saved_node[j]].db, '/' + key_data_bc)
        }
        let detail_bc = await getDataBlockchain(temp_bc_second);
        kumpulanHasilUjian[i].detail_bc = detail_bc[kumpulanHasilUjian[i].ujian_key].data
      }
      
      for(let i=0; i<kumpulanHasilUjian.length; i++){
        // kumpulanHasilUjian[i].detail = await get_bc(db_bc, '/' + kumpulanHasilUjian[i].detail.bc1)
        
        // console.log(kumpulanHasilUjian[i].user_key)
      }
      
      listHasil.value = kumpulanHasilUjian;
      // console.log(kumpulanHasilUjian)
    }, 'ujian_key', route.params.id)

    
  })
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

const moderasi = async (item, result) => {
  await set('/hasil_ujian/' + item.key + '/result', result)
}

const kalkulasiKecurangan = (item) => {
  let persentaseKecurangan = item.detail_bc.data.persentaseKecurangan;
  
  if(typeof persentaseKecurangan.pesertaLebihDariSatu === 'undefined') persentaseKecurangan.pesertaLebihDariSatu = 0;
  else persentaseKecurangan.pesertaLebihDariSatu = parseFloat(persentaseKecurangan.pesertaLebihDariSatu)
  
  if(typeof persentaseKecurangan.pesertaTidakTerdeteksi === 'undefined') persentaseKecurangan.pesertaTidakTerdeteksi = 0;
  else persentaseKecurangan.pesertaTidakTerdeteksi = parseFloat(persentaseKecurangan.pesertaTidakTerdeteksi)

  if(typeof persentaseKecurangan.terlaluBerisik === 'undefined') persentaseKecurangan.terlaluBerisik = 0;
  else persentaseKecurangan.terlaluBerisik = parseFloat(persentaseKecurangan.terlaluBerisik)

  if(typeof persentaseKecurangan.wajahPesertaTidakCocok === 'undefined') persentaseKecurangan.wajahPesertaTidakCocok = 0;
  else persentaseKecurangan.wajahPesertaTidakCocok = parseFloat(persentaseKecurangan.wajahPesertaTidakCocok)



  
  let curang = false
  if(persentaseKecurangan.pesertaLebihDariSatu > 0) curang = true; // tidak mentoleransi adanya wajah lebih dari 1 di layar
  else if(persentaseKecurangan.pesertaTidakTerdeteksi > 10) curang = true; // kalau di atas 10%, dianggap curang
  else if(persentaseKecurangan.wajahPesertaTidakCocok > 15) curang = true; // kalau di atas 15%, dianggap curang
  else if(persentaseKecurangan.terlaluBerisik > 30) curang = true; // karna soal deteksi bising kadang bener kadang salah, jadi batasnya di atas 30%

  if(curang) return 'Peserta kemungkinan besar melakukan kecurangan'

  return 'Peserta kemungkinan kecil melakukan kecurangan'
}
</script>