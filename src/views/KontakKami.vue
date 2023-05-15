<template>
  <v-container fluid class="pa-0" v-if="host === 'https://smart-exam-saas.web.app'">
    <v-row class="bg-grey-lighten-4 pa-10" align="center" justify="space-around">
      <v-col>
        <p class="text-h5 pb-5 text-center">
          <span class="LeagueFont text-primary">Tentang Kami</span> 
        </p>
        <v-row align="center">
          <v-col cols="10" class="mx-auto">
            <p class="text-body text-center">
              Platform ini merupakan hasil dari tugas mata kuliah <b>Perancangan Layanan Teknologi Informasi</b> dari <b>Institut Teknologi Bandung</b> pada Tahun 2023. 
              Platform SaaS ini dibangun dengan tujuan untuk menyelesaikan permasalahan-permasalahan tindak kecurangan pada penyelenggaraan ujian tertulis.
            </p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="no-gutters bg-grey-lighten-4 px-0 pb-4" align="end" justify="center">
      <v-col xs="4" sm="4" md="2" class="text-center team">
        <v-img class="logo-mini member-team mx-auto animate__animated animate__bounceInUp team-4" src="@/assets/fahmi.svg"></v-img>
        <v-chip size="large" class="bg-primary white-text rounded-shaped px-5 py-0 chip-member animate__animated animate__fadeInUp animate__faster">
          Fahmi (23222070)
        </v-chip>
      </v-col>
      <v-col xs="4" sm="4" md="2" class="text-center team">
        <v-img class="logo-mini member-team mx-auto animate__animated animate__bounceInUp team-2" src="@/assets/habib.svg"></v-img>
        <v-chip size="large" class="bg-primary white-text rounded-shaped px-5 py-0 chip-member animate__animated animate__fadeInUp animate__faster">
          Habib (23222061)
        </v-chip>
      </v-col>
      <v-col xs="4" sm="4" md="2" class="text-center team">
        <v-img class="logo-mini member-team mx-auto animate__animated animate__bounceInUp team-1" src="@/assets/aditsud.svg"></v-img>
        <v-chip size="large" class="bg-primary white-text rounded-shaped px-5 py-0 chip-member animate__animated animate__fadeInUp animate__faster">
          Adit (23222063)
        </v-chip>
      </v-col>
      <v-col xs="4" sm="4" md="2" class="text-center team">
        <v-img class="logo-mini member-team mx-auto animate__animated animate__bounceInUp team-3" src="@/assets/bene.svg"></v-img>
        <v-chip size="large" class="bg-primary white-text rounded-shaped px-5 py-0 chip-member animate__animated animate__fadeInUp animate__faster">
          Bene (23222026)
        </v-chip>
      </v-col>
      <v-col xs="4" sm="4" md="2" class="text-center team">
        <v-img class="logo-mini member-team mx-auto animate__animated animate__bounceInUp team-5" src="@/assets/raphael.svg"></v-img>
        <v-chip size="large" class="bg-primary white-text rounded-shaped px-5 py-0 chip-member animate__animated animate__fadeInUp animate__faster">
          Raphael (23222307)
        </v-chip>
      </v-col>
    </v-row>
  </v-container>

  <!-- Khusus DAI -->
  <v-container fluid class="pa-0" v-else>
    <v-row class="bg-grey-lighten-4 pa-10" align="center" justify="space-around">
      <v-col>
        <p class="text-h5 pb-5 text-center">
          <span class="LeagueFont text-primary">Tentang Kami</span> 
        </p>
        <v-row align="center">
          <v-col cols="10" class="mx-auto">
            <p class="text-body text-center">
              Platform Smart System ini merupakan hasil dari tugas mata kuliah <b>Desain Aplikasi Interaktif</b> dari <b>Institut Teknologi Bandung</b> pada Tahun 2023. 
              Platform ini memiliki konsep SaaS (Software As A Service) yang dibangun dengan tujuan untuk menyelesaikan permasalahan-permasalahan tindak kecurangan pada penyelenggaraan ujian tertulis.
            </p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="no-gutters bg-grey-lighten-4 px-0 pb-4" align="end" justify="center">
      <v-col xs="4" sm="4" md="2" class="text-center team">
        <v-img class="logo-mini member-team mx-auto animate__animated animate__bounceInUp team-1" src="@/assets/aditsud.svg"></v-img>
        <v-chip size="large" class="bg-primary white-text rounded-shaped px-5 py-0 chip-member animate__animated animate__fadeInUp animate__faster">
          Adit (23222063)
        </v-chip>
      </v-col>
      <v-col xs="4" sm="4" md="2" class="text-center team">
        <v-img class="logo-mini member-team mx-auto animate__animated animate__bounceInUp team-3" src="@/assets/bene.svg"></v-img>
        <v-chip size="large" class="bg-primary white-text rounded-shaped px-5 py-0 chip-member animate__animated animate__fadeInUp animate__faster">
          Bene (23222026)
        </v-chip>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import 'animate.css';

// the above is the same as origin, e.g. "https://stackoverflow.com"
var host = window.location.origin;

</script>

<style scoped>
.member-team{
  width: 300px !important;
}

.team{
  position: relative;
}
.chip-member{
  position: absolute;
  left:50%;
  bottom: 0px;
  width: 160px;
  margin-left: -80px;
  font-size: 80% !important;
  text-align: center;

}

.team-1{
  --animate-delay: 0.5s;
}
.team-2{
  --animate-delay: 0.7s;
}
.team-3{
  --animate-delay: 0.9s;
}
.team-4{
  --animate-delay: 1.1s;
}
.team-5{
  --animate-delay: 1.3s;
}

</style>