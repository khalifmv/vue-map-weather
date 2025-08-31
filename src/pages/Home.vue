<script setup lang="ts">
import LocationHistory from "../components/LocationHistory.vue";
import Map from "../components/Map.vue"
import MyLocationCard from "../components/MyLocationCard.vue";
import Tab from "../components/ui/Tab.vue";
import Tabs from "../components/ui/Tabs.vue";
import { ref, onMounted, onUnmounted } from "vue";

const isMobile = ref(false);

function checkScreen() {
  isMobile.value = window.innerWidth < 768; // md breakpoint
}

onMounted(() => {
  checkScreen();
  window.addEventListener("resize", checkScreen);
});
onUnmounted(() => {
  window.removeEventListener("resize", checkScreen);
});
</script>

<template>
  <div class="h-screen w-screen relative overflow-hidden">
    <div class="hidden md:flex absolute top-0 right-0 h-screen sidebar-wrapper min-w-[360px]">
      <div class="relative w-full h-full">
        <div class="bg-sidebar w-full h-full"></div>
        <div class="absolute top-0 left-0 w-full p-4 normal-behavior flex flex-col gap-3 h-full">
          <MyLocationCard />
          <LocationHistory />
        </div>
      </div>
    </div>
    <div class="block md:hidden absolute bottom-0 left-0 z-[9999] w-full">
      <Tabs defaultValue="dashboard">
        <Tab value="dashboard" title="Lokasi Sekarang">
          <div id="mobile-location"></div>
        </Tab>
        <Tab value="profile" title="Daftar Lokasi">
          <LocationHistory />
        </Tab>
      </Tabs>

      <Teleport to="#mobile-location" v-if="isMobile">
        <MyLocationCard />
      </Teleport>
      <p class="hidden md:block">Github</p>
    </div>
    <Map />
  </div>
</template>

<style scoped>
.sidebar-wrapper {
  z-index: 99999;
  user-select: none;
  pointer-events: none;
}

.bg-sidebar {
  mask: linear-gradient(270deg, black, black, transparent);
  backdrop-filter: blur(8px);
}
</style>