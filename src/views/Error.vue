<template>
  <v-container class="bg-blue h-screen" fluid>
    <v-row justify="center" align="center">
      <v-col>
        <v-img src="@/assets/error.svg" class="mx-auto animate__animated animate__tada" :max-width="600"></v-img>
        <p class="text-center LeagueFont">Hayoo, Mau Curang Yaa??</p>
        <div class="text-center mt-3 elevation-0">
          <v-btn @click="back" flat color="accent" class="text-caption"><span class="text-white">Kembali ke Sebelumnya</span></v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>

</template>

<script setup>
import 'animate.css'

const back = () => {
  history.back();
}
</script>