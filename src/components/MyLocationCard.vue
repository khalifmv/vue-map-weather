<script setup lang="ts">
import Card from './ui/Card.vue';
import Title from './ui/Title.vue';
import Button from './ui/Button.vue';
import { computed } from "vue"
import { useUserInfoStore } from '../stores/User';
import { useLocation } from '../composables/useLocation';
import { useQuery } from "@tanstack/vue-query";
import WeatherCard from './WeatherCard.vue';
import { fetchWeather, WeatherError } from '../api/weather';

const userInfo = useUserInfoStore()
const { requestPrecise } = useLocation()

const { data, error, isLoading } = useQuery({
  // Keyed on the coordinates so switching from an IP estimate to a precise fix
  // refetches instead of serving the old city.
  queryKey: computed(() => ["weather", userInfo.coor[0], userInfo.coor[1]]),
  queryFn: () => {
    if (
      typeof userInfo.coor[0] === "number" &&
      typeof userInfo.coor[1] === "number"
    ) {
      return fetchWeather({ lat: userInfo.coor[0], long: userInfo.coor[1] });
    } else {
      return Promise.reject(new Error("Coordinates are not available"));
    }
  },
  enabled: computed(() => userInfo.hasCoor),
  refetchOnWindowFocus: false,
})

const weatherErrorMessage = computed(() => {
  if (!error.value) return null
  if (error.value instanceof WeatherError) {
    switch (error.value.kind) {
      case 'outside-coverage':
        return 'BMKG hanya meliputi wilayah Indonesia, titik ini di luar jangkauan.'
      case 'no-forecast':
        return 'BMKG belum punya prakiraan untuk wilayah ini.'
      case 'unreachable':
        return 'Layanan BMKG sedang tidak bisa dihubungi.'
    }
  }
  return 'Gagal memuat cuaca untuk lokasi ini.'
})

const statusMessage = computed(() => {
  if (userInfo.hasCoor) return null
  switch (userInfo.locationStatus) {
    case 'denied':
      return 'Akses lokasi diblokir browser.'
    case 'unavailable':
      return 'Perangkat tidak berhasil menentukan lokasi.'
    case 'requesting':
      return 'Meminta lokasi...'
    default:
      return 'Lokasi belum ditentukan.'
  }
})
</script>

<template>
  <Card class="w-full flex flex-col gap-3">
    <div class="flex flex-col gap-1">
      <div class="flex items-center justify-between gap-2">
        <Title :size="'sm'">Lokasi saat ini</Title>
        <span v-if="userInfo.isEstimatedLocation"
          class="text-xs text-amber-700 bg-amber-50 rounded-md px-2 py-0.5 shrink-0">
          Perkiraan dari IP
        </span>
      </div>

      <div v-if="statusMessage" class="flex flex-col items-start gap-2 mt-1">
        <Title :size="'sm'">{{ statusMessage }}</Title>
        <Button variant="secondary" :disabled="userInfo.locationStatus === 'requesting'" @click="requestPrecise">
          Coba deteksi lokasi
        </Button>
      </div>

      <div v-else-if="isLoading">Loading weather...</div>
      <div v-else-if="error" class="text-xs text-gray-500">{{ weatherErrorMessage }}</div>

      <template v-if="!isLoading && !error && data">
        <div class="flex flex-col gap-1">
          <Title :size="'lg'">{{ data.data[0].location.city }}</Title>
          <Title :size="'sm'">Sekitar {{ data.data[0].location.subdistrict }} - {{ data.data[0].location.village }}
          </Title>
          <!-- <span v-if="data.data[0].approximate" class="text-xs text-amber-700 bg-amber-50 rounded-md px-2 py-0.5 self-start">
            Perkiraan kabupaten terdekat
          </span> -->
        </div>
        <div class="flex gap-2 mt-2 overflow-x-auto">
          <template v-for="(weather, index) in data.data[0].weather[0]" :key="weather.datetime">
            <WeatherCard :weather="weather" :class="{ 'bg-gray-100': index > 0 }" />
          </template>
        </div>
      </template>
    </div>

    <a href="https://data.bmkg.go.id/prakiraan-cuaca/" target="_blank" rel="noopener noreferrer"
      class="text-xs text-gray-500 hover:text-gray-700 underline decoration-dotted">
      Sumber data cuaca: BMKG
    </a>

    <Button v-if="userInfo.isEstimatedLocation" variant="secondary" class="self-start"
      :disabled="userInfo.locationStatus === 'requesting'" @click="requestPrecise">
      {{ userInfo.locationStatus === 'requesting' ? 'Mendeteksi...' : 'Pakai lokasi presisi' }}
    </Button>
  </Card>
</template>
