<template>
  <button
    class="h-10 px-8 items-center justify-center rounded-lg font-medium transition"
    :class="{
      'inline-flex': !block,
      'flex w-full': block,
      'text-white': variant !== 'default',
      'text-blue-600': variant === 'default',
      'bg-blue-600 hover:bg-blue-700': variant === 'primary',
      'bg-red-600 hover:bg-red-700': variant === 'danger',
      'bg-gray-100 hover:bg-gray-200': variant === 'default',
      'opacity-75': disabled,
      'pointer-events-none': disabled
    }"
  >
    <span
      v-if="'icon' in slots"
      class="block h-6 w-6"
      :class="{
        'mr-4': 'default' in slots
      }"
    >
      <slot name="icon" />
    </span>
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { defineProps, PropType, useSlots } from 'vue';

defineProps({
  block: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String as PropType<'primary' | 'danger' | 'default'>,
    default: 'primary',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const slots = useSlots();
</script>
