<script setup>
import { ref, computed } from 'vue'
import { useUserInfoStore } from '../stores/User'
import { useLocation } from '../composables/useLocation'
import Title from './ui/Title.vue'
import Button from './ui/Button.vue'

const userInfo = useUserInfoStore()
const { requestPrecise } = useLocation()

const dismissed = ref(false)

const isMac = /Mac/i.test(navigator.userAgent)

const browser = computed(() => {
  const ua = navigator.userAgent
  if (navigator.brave) return 'brave'
  if (/Edg\//.test(ua)) return 'edge'
  if (/Firefox\//.test(ua)) return 'firefox'
  if (/Chrome\//.test(ua)) return 'chrome'
  if (/Safari\//.test(ua)) return 'safari'
  return 'other'
})

const unblockSteps = computed(() => {
  const steps = {
    chrome: ['Klik ikon gembok atau slider di kiri address bar.', 'Cari "Lokasi", ubah jadi "Izinkan".', 'Muat ulang halaman ini.'],
    brave: ['Klik ikon gembok di kiri address bar.', 'Cari "Lokasi", ubah jadi "Izinkan".', 'Pastikan Brave Shields untuk situs ini tidak memblokir.', 'Muat ulang halaman ini.'],
    edge: ['Klik ikon gembok di kiri address bar.', 'Cari "Lokasi", ubah jadi "Izinkan".', 'Muat ulang halaman ini.'],
    firefox: ['Klik ikon gembok di kiri address bar.', 'Hapus status "Diblokir Sementara" pada Akses Lokasi.', 'Muat ulang halaman ini.'],
    safari: ['Buka menu Safari, pilih Pengaturan (Settings).', 'Masuk ke tab Websites, lalu pilih Location.', 'Ubah situs ini menjadi "Allow".'],
    other: ['Buka pengaturan izin situs di browser kamu.', 'Izinkan akses Lokasi untuk situs ini.', 'Muat ulang halaman ini.']
  }
  return steps[browser.value]
})

const content = computed(() => {
  switch (userInfo.locationStatus) {
    case 'prompt':
      return {
        icon: '📍',
        title: 'Lihat cuaca di sekitarmu',
        body: 'Aplikasi ini memakai lokasimu untuk menampilkan prakiraan cuaca di titik kamu berada. Lokasi hanya diproses di browser dan tidak disimpan di server mana pun.',
        primary: 'Izinkan Akses Lokasi',
        hint: 'Setelah menekan tombol di atas, browser akan menampilkan dialog izinnya sendiri.'
      }
    case 'requesting':
      return {
        icon: '🛰️',
        title: 'Menunggu izin dari browser',
        body: 'Pilih "Izinkan" atau "Allow" pada dialog yang muncul di browser kamu.',
        primary: null,
        hint: null
      }
    case 'denied':
      return {
        icon: '🚫',
        title: 'Akses lokasi diblokir',
        body: 'Browser memblokir akses lokasi untuk situs ini, izin perlu dibuka manual dari pengaturan browser.',
        primary: 'Coba Lagi',
        hint: null
      }
    case 'unavailable':
      return {
        icon: '🧭',
        title: 'Lokasi tidak bisa ditentukan',
        body: 'Browser sudah diizinkan mengakses lokasi, tapi perangkat kamu tidak berhasil menentukan posisinya.',
        primary: 'Coba Lagi',
        hint: null
      }
    default:
      return null
  }
})

const visible = computed(() => !dismissed.value && content.value !== null)

async function onRequest() {
  const granted = await requestPrecise()
  if (granted) {
    dismissed.value = false
  }
}

function onDismiss() {
  dismissed.value = true
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible"
        class="fixed inset-0 z-[100000] flex items-end md:items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4"
        role="dialog" aria-modal="true" aria-labelledby="location-modal-title">
        <div class="w-full max-w-md bg-white rounded-xl shadow-xl p-5 flex flex-col gap-4">
          <div class="flex items-start gap-3">
            <span class="text-2xl leading-none" aria-hidden="true">{{ content.icon }}</span>
            <div class="flex flex-col gap-1">
              <p id="location-modal-title" class="font-bold text-xl">{{ content.title }}</p>
              <span class="text-xs text-gray-500">{{ content.body }}</span>
            </div>
          </div>

          <ol v-if="userInfo.locationStatus === 'denied'"
            class="list-decimal list-inside flex flex-col gap-1 text-xs text-slate-600 bg-slate-50 rounded-md p-3">
            <li v-for="step in unblockSteps" :key="step">{{ step }}</li>
          </ol>

          <div v-if="userInfo.locationStatus === 'unavailable' && isMac"
            class="text-xs text-slate-600 bg-slate-50 rounded-md p-3 flex flex-col gap-1">

          </div>

          <div v-if="userInfo.locationStatus === 'requesting'" class="flex items-center gap-2 text-xs text-slate-600">
            <span class="w-4 h-4 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin"
              aria-hidden="true"></span>
            <span>Meminta lokasi...</span>
          </div>

          <div v-if="userInfo.isEstimatedLocation" class="text-xs text-slate-600 bg-amber-50 rounded-md p-3">
            Sementara ini peta memakai perkiraan dari alamat IP<template v-if="userInfo.locationLabel">, sekitar
              <span class="font-semibold">{{ userInfo.locationLabel }}</span></template>. Akurasinya hanya setingkat
            kota.
          </div>

          <span v-if="content.hint" class="text-xs text-gray-500">{{ content.hint }}</span>

          <div class="flex flex-wrap gap-2 justify-end">
            <Button variant="ghost" @click="onDismiss">
              {{ userInfo.isEstimatedLocation ? 'Pakai perkiraan' : 'Nanti saja' }}
            </Button>
            <Button v-if="content.primary" variant="primary" :disabled="userInfo.locationStatus === 'requesting'"
              @click="onRequest">
              {{ content.primary }}
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
