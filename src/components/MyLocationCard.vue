<script setup lang="ts">
import Card from './ui/Card.vue';
import Title from './ui/Title.vue';
import { computed } from "vue"
import { useUserInfoStore } from '../stores/User';
import { useQuery } from "@tanstack/vue-query";
import WeatherCard from './WeatherCard.vue';
import { fetchWeather } from '../api/weather';
const userInfo = useUserInfoStore()

const { data, error, isLoading } = useQuery({
  queryKey: computed(() => ["weather"]),
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
  enabled: computed(() => typeof userInfo.coor[0] === "number" && typeof userInfo.coor[1] === "number"),
  refetchOnWindowFocus: false,
})
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
          <template v-for="(weather, index) in data.data[0].weather[0]" :key="weather.datetime">
            <WeatherCard :weather="weather" :class="{ 'bg-gray-100': index > 0 }"/>
          </template>
        </div>
      </template>

    </div>

    <div class="flex flex-col gap-1">
      <!-- <Title :size="'sm'">Cuaca hari ini</Title> -->
    </div>
  </Card>
</template>