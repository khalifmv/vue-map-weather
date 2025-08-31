<script setup>
import { inject, onMounted } from "vue";

const props = defineProps({
  value: { type: String, required: true },
  title: { type: String, required: true }
});

const tabsContext = inject("tabsContext");

onMounted(() => {
  tabsContext.registerTab({ value: props.value, title: props.title });
});
</script>

<template>
  <div v-show="tabsContext.activeTab.value === props.value">
    <slot />
  </div>
</template>