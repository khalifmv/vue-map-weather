<script setup>
import { ref } from "vue";

const tabs = ["Dashboard", "Profile", "Settings"];
const activeTab = ref("Dashboard");
</script>

<template>
  <div class="w-full">
    <!-- Tab Header -->
    <div class="relative right-0">
      <ul
        class="relative flex flex-wrap px-1.5 py-1.5 list-none rounded-md bg-slate-100"
        role="list"
      >
        <li
          v-for="tab in tabs"
          :key="tab"
          class="z-30 flex-auto text-center"
        >
          <button
            class="z-30 flex items-center justify-center w-full px-0 py-2 text-sm mb-0 transition-all ease-in-out rounded-md cursor-pointer"
            :class="activeTab === tab
              ? 'bg-white text-slate-900 shadow'
              : 'text-slate-600 hover:bg-slate-200'"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Tab Content -->
    <div class="p-4 mt-4 rounded-md bg-white shadow">
      <div v-if="activeTab === 'Dashboard'">
        <h2 class="text-lg font-semibold">📊 Dashboard</h2>
        <p>Ini konten untuk dashboard.</p>
      </div>
      <div v-else-if="activeTab === 'Profile'">
        <h2 class="text-lg font-semibold">👤 Profile</h2>
        <p>Ini konten untuk profile.</p>
      </div>
      <div v-else-if="activeTab === 'Settings'">
        <h2 class="text-lg font-semibold">⚙️ Settings</h2>
        <p>Ini konten untuk settings.</p>
      </div>
    </div>
  </div>
</template>
