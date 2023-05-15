<template>
  <v-container fluid class="pa-0" >
    <v-row class="pa-10 loginScreen bg-grey-lighten-4" align="center" justify="center">
      <v-col cols="12" class="text-center">
        <v-img src="@/assets/logo.png" height="200" class="animate__animated animate__flipInX animate__fast" />
        <p class="LeagueFont pb-3 text-primary">Selamat Bergabung di Smart Exam</p>
        <div class="loginPanel mx-auto">
          <v-sheet class=" pa-8 rounded-lg elevation-1">
            Peserta wajib mengakses Smart Exam melalui aplikasi khusus yaitu: <br/><b>Smart Exam Browser</b><br/><br/>
            <span class="text-caption">Berikut adalah tautan untuk mengunduh aplikasi Smart Exam Browser:</span>
            <div class="mt-2">
              <v-btn
                color="primary"
                size="small"
                href="https://sourceforge.net/projects/seb/files/seb/SEB_3.4.1/SEB_3.4.1.505_SetupBundle.exe/download"
                target="_blank"
              >
                <v-icon>mdi-download</v-icon>
                Unduh Safe Exam Browser (Windows)
              </v-btn>
            </div>
            <div class="mt-2">
              <v-btn
                color="primary"
                size="small"
                href="/smartexam_client.seb"
                download
              >
                <v-icon>mdi-download</v-icon>
                Unduh Konfigurasi Safe Exam Browser
              </v-btn>
            </div>
          </v-sheet>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>

</script>

<style scoped>
.loginPanel{
  max-width: 600px;
}
</style>