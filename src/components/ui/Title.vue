<script setup>
// import { defineProps } from 'vue';
const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator(value) {
      return ['sm', 'md', 'lg'].includes(value);
    },
  }
})
</script>

<template>
  <span v-if="props.size === 'sm'" class="text-xs text-gray-500">
    <slot></slot>
  </span>
  <p v-else-if="props.size === 'md'" class="text-md">
    <slot></slot>
  </p>
  <p v-else-if="props.size === 'lg'" class="font-bold text-xl">
    <slot></slot>
  </p>
</template>