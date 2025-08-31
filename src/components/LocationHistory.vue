<script setup lang="ts">
import { useUserInfoStore } from '../stores/User';
import Card from './ui/Card.vue';
import Title from './ui/Title.vue';
import { computed } from "vue"

const userInfo = useUserInfoStore()
const locationHistory = computed(() => [...userInfo.locationHistory].reverse())
</script>

<template>
  <Card class="w-full flex flex-col bg-gray-200 border border-white h-full max-h-[300px] md:max-h-[650px] overflow-y-auto">
    <Title :size="'sm'">Riwayat lokasi</Title>
    <div class="mt-4 w-full h-full">
      <div v-if="userInfo.loadingGetLocation">Loading</div>
      <div v-for="value in locationHistory" :key="value.location.latitide" class="p-2 rounded-lg bg-white mb-2 flex flex-col gap-1">
        <div class="flex justify-between items-center">
          <div class="font-bold"><Title :size="'md'">{{ value.location.city }}</Title></div>
          <!-- <Title :size="'md'">{{ value.location.subdistrict }}</Title> -->
          <div class="flex flex-col text-right">
            <p class="text-xs text-gray-500">
              {{ new Date(value.weather[0][0].datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </p>
            <p class="text-xs text-gray-500">
              {{ new Date(value.weather[0][0].datetime).toLocaleDateString([], { day: '2-digit', month: 'long', year: 'numeric' }) }}
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <p class="text-sm">{{ value.location.subdistrict }} - {{ value.location.village }}</p>
          <div class="flex gap-2 items-center">
            <img :src="value.weather[0][0].image" class="w-8 h-8" />
            <p class="text-2xl font-bold">{{ value.weather[0][0].t }}  ℃</p>
          </div>
        </div>
        
      </div>

      <div v-if="locationHistory.length < 1" class="flex w-full h-full justify-center items-center">
        <p class="text-sm opacity-30">Klik 2x pada peta untuk melihat cuaca daerah tertentu.</p>
      </div>
    </div>
  </Card>
</template>

<style scoped>
</style>