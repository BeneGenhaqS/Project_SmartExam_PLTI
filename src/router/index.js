// Composables
import pinia from "@/plugins/store";
import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/store/user'


const routes = [
  {
    path: '',
    redirect: '/beranda'
  },
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore(pinia);
      if (userStore.user === null) {
        next();
        return;
      }
      // next('/kelola-ujian')
      // next('/dashboard')
      console.log(userStore.user)
      next('/dashboard')
    },
    children: [
      {
        path: 'beranda',
        name: 'Beranda',
        component: () => import('@/views/Beranda.vue'),
      },
      {
        path: 'kontak-kami',
        name: 'Kontak Kami',
        component: () => import('@/views/KontakKami.vue'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
      },
      {
        path: 'pengguna-baru',
        name: 'Pengguna Baru',
        component: () => import('@/views/PenggunaBaru.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/default/Admin.vue'),
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore(pinia);
      if (userStore.user !== null) {
        next();
        return;
      }
      next('/login')
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
      },
      {
        path: 'kelola-ujian',
        name: 'Kelola Ujian',
        component: () => import('@/views/KelolaUjian.vue'),
      },
      {
        path: 'kelola-kelas',
        name: 'Kelola Kelas',
        component: () => import('@/views/KelolaKelas.vue'),
      },
      {
        path: 'kelola-peserta',
        name: 'Kelola Peserta',
        component: () => import('@/views/KelolaPeserta.vue'),
      },
      {
        path: 'kelola-admin',
        name: 'Kelola Admin',
        component: () => import('@/views/KelolaAdmin.vue'),
      },
      {
        path: 'kelola-entitas',
        name: 'Kelola Enntitas',
        component: () => import('@/views/KelolaEntitas.vue'),
      },
      {
        path: 'editor-soal/:id',
        name: 'Editor Soal',
        component: () => import('@/views/EditorSoal.vue'),
      },
      {
        path: 'hasil-ujian/:id',
        name: 'Hasil Ujian Peserta',
        component: () => import('@/views/HasilUjian.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/default/Setup.vue'),
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore(pinia);
      if (userStore.user === null) {
        next();
        return;
      }
      next('/daftar-ujian')
    },
    children: [
      {
        path: 'login-peserta',
        name: 'Login Peserta',
        component: () => import('@/views/Login.vue'),
      }
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/default/Setup.vue'),
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore(pinia);
      if (userStore.user !== null) {
        next();
        return;
      }
      next('/login-peserta')
    },
    children: [
      {
        path: 'setup-peserta',
        name: 'Setup Peserta',
        component: () => import('@/views/SetupPeserta.vue'),
      },
      {
        path: 'soal-ujian/:id',
        name: 'Pengerjaan Soal',
        component: () => import('@/views/PengerjaanSoal.vue'),
      },
      {
        path: 'daftar-ujian',
        name: 'Daftar Ujian',
        component: () => import('@/views/DaftarUjian.vue'),
      },
      {
        path: 'unduh-safeexambrowser',
        name: 'Unduh Safe Exam Browser',
        component: () => import('@/views/UnduhSmartExam.vue'),
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    name: "Halaman Tidak Ditemukan",
    component: () => import('@/views/Error.vue'),
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

export default router
