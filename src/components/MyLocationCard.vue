<script setup lang="ts">
import Card from './ui/Card.vue';
import Title from './ui/Title.vue';
import { computed } from "vue"
import { useUserInfoStore } from '../stores/User';
import { useQuery } from "@tanstack/vue-query";
import WeatherCard from './WeatherCard.vue';
const userInfo = useUserInfoStore()

// const coords = computed(() => ({
//   lat: userInfo.coor[0],
//   long: userInfo.coor[1]
// }));

async function fetchWeather() {

  const url = `https://openapi.de4a.space/api/weather/forecast?lat=${userInfo.coor[0]}&long=${userInfo.coor[1]}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch weather");
  }
  return res.json();
}

const { data, error, isLoading } = useQuery({
  queryKey: computed(() => ["weather"]),
  queryFn: fetchWeather,
  enabled: computed(() => !!userInfo.coor[0] && !!userInfo.coor[1]),
  refetchOnWindowFocus: false,
})

// const query = useQuery({
//   queryKey: ["weather"],
//   queryFn: fetchWeather,
//   enabled: false, // jangan auto jalan
// })

// watch(userInfo.coor, (newVal) => {
//   console.log(newVal)
//   if (newVal[0] && newVal[1]) {
//     query.refetch()
//   }
// }, { immediate: true })


</script>

<template>
  <Card class="w-full flex flex-col gap-3">
    <div class="flex flex-col gap-1">
      <div class="flex flex-col gap-1">
        <Title :size="'sm'">Lokasi saat ini</Title>

      </div>

      <div v-if="isLoading">Loading weather...</div>
      <div v-else-if="error">Error: {{ error!.message }}</div>
      <template v-if="!isLoading && !error && data">
        <div class="flex flex-col gap-1">
          <Title :size="'lg'">{{ data.data[0].location.city }}</Title>
          <Title :size="'sm'">Sekitar {{ data.data[0].location.subdistrict }} - {{ data.data[0].location.village }}</Title>
        </div>
        <div class="flex gap-2 mt-2 overflow-x-auto">
          <template v-for="weather in data.data[0].weather[0]" :key="weather.datetime">
            <WeatherCard :weather="weather"/>
          </template>
        </div>
      </template>

    </div>

    <div class="flex flex-col gap-1">
      <!-- <Title :size="'sm'">Cuaca hari ini</Title> -->
    </div>
  </Card>
</template>