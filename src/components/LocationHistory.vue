<script setup lang="ts">
import { useUserInfoStore } from '../stores/User';
import Card from './ui/Card.vue';
import Title from './ui/Title.vue';
import { computed } from "vue"

const userInfo = useUserInfoStore()
const locationHistory = computed(() => [...userInfo.locationHistory].reverse())
</script>

<template>
  <Card class="w-full flex flex-col bg-gray-200 border border-white h-full max-h-[650px] overflow-y-auto">
    <Title :size="'sm'">Riwayat lokasi</Title>
    <div class="mt-4">
      <div v-for="value in locationHistory" :key="value.location.latitide" class="p-2 rounded-lg bg-white mb-2 flex flex-col gap-1">
        <div class="flex justify-between items-center">
          <div class="font-bold"><Title :size="'md'">{{ value.location.city }}</Title></div>
          <!-- <Title :size="'md'">{{ value.location.subdistrict }}</Title> -->
          <p class="text-xs text-gray-500">{{ new Date(value.weather[0][0].datetime).toLocaleString() }}</p>
        </div>
        <div class="flex flex-col gap-1">
          <p class="text-sm">{{ value.location.subdistrict }} - {{ value.location.village }}</p>
          <p class="text-xs text-gray-600">{{ value.weather[0][0].t }}  ℃</p>
        </div>
        
      </div>
    </div>
  </Card>
</template>

<style scoped>
</style>