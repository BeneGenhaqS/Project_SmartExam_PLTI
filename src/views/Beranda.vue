<template>
  <v-container fluid class="pa-0" >
    <v-row class="bg-grey-lighten-4 pa-10" align="center" justify="space-around">
      <v-col>
        <v-img src="@/assets/banner1.svg" class="logo animate__animated animate__bounceIn animate__fast"></v-img>
      </v-col>
      <v-col>
        <p class="text-h5 pb-5">
          <span class="LeagueFont">Smart Exam</span> adalah sebuah layanan penyelenggaraan ujian berbasis perangkat lunak dengan teknologi web yang terintegrasi dengan 
          <v-chip size="large" class="px-2 rounded font-weight-bold" color="secondary">Artificial Intelegent</v-chip> 
          dan 
          <v-chip size="large" class="px-2 rounded font-weight-bold" color="accent">Blockchain</v-chip>
          sehingga dapat mengurangi segala bentuk kecurangan dalam ujian. Selain itu, Smart Exam juga dibekali dengan 
          <v-chip size="large" class="px-2 rounded font-weight-bold" color="primary">Data Analysis</v-chip> 
        </p>
      </v-col>
    </v-row>

    <v-row class="bg-light-blue-lighten-5 pa-10 features">
      <v-col class="text-center">
        <v-img class="logo-mini  mx-auto animate__animated animate__pulse animate__infinite animate__slower" height="250" src="@/assets/facerecognition.svg"></v-img>
        <p class="text-h4">
          <v-chip size="x-large" variant="outlined" class="px-2 mt-4 rounded font-weight-bold" color="accent">Artificial Intelegent</v-chip> 
        </p>
        <p class="pa-5">
          Algoritma Face Recognition yang kami kembangkan mampu mengidentifikasi keberadaan peserta selama ujian sehingga memastikan bahwa yang mengerjakaan soal ujian adalah peserta yang bersangkutan.
        </p>
      </v-col>
      <v-col class="text-center">
        <v-img class="logo-mini  mx-auto blockchainImage" height="250" src="@/assets/blockchain.svg"></v-img>
        <p class="text-h4">
          <v-chip size="x-large" variant="outlined" class="px-2 mt-4 rounded font-weight-bold" color="secondary">Blockchain</v-chip> 
        </p>
        <p class="pa-5">
          Data ujian peserta seperti identitas peserta, soal, jawaban, serta nilai ujian, akan tersimpan dengan aman menggunakan blockchain sehingga integritasnya terjaga dan tidak dapat diubah.
        </p>
      </v-col>
      <v-col class="text-center">
        <v-img class="logo-mini  mx-auto animate__animated animate__pulse animate__infinite animate__slower" height="250" src="@/assets/dataanalyst.svg"></v-img>
        <p class="text-h4">
          <v-chip size="x-large" variant="outlined" class="px-2 mt-4 rounded font-weight-bold" color="primary">Data Analysis</v-chip> 
        </p>
        <p class="pa-5">
          Informasi terkait analisis peserta ujian dapat dilihat dan dievaluasi oleh pengelenggara ujian sehingga penyelenggara dapat melakukan tindakan tertentu terhadap peserta ujian berdasarkan hasil ujiannya.
        </p>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import 'animate.css';

</script>

<style scoped>
.logo{
  min-width: 300px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.blockchainImage {
  animation: spin 12s infinite linear;
}
</style>
