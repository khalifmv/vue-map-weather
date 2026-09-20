<script setup>
import { twMerge } from 'tailwind-merge'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator(value) {
      return ['primary', 'secondary', 'ghost'].includes(value)
    }
  },
  class: {
    type: String,
    default: ''
  }
})

const variants = {
  primary: 'bg-slate-900 text-white hover:bg-slate-700',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  ghost: 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
}
</script>

<template>
  <button
    v-bind="$attrs"
    :class="twMerge(
      'px-4 py-2 rounded-md text-sm transition-all ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
      variants[props.variant],
      props.class
    )"
  >
    <slot />
  </button>
</template>
