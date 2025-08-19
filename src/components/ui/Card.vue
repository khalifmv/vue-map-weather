<script setup>
import { twMerge } from 'tailwind-merge'
defineOptions({ inheritAttrs: true }) 
const props = defineProps({
  class: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div v-bind="$attrs" :class="twMerge('p-4 rounded-xl bg-white', props.class)">
    <slot></slot>
  </div>
</template>