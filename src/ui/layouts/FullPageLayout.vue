<template>
  <div class="flex flex-col h-full">
    <div v-if="'header' in slots" class="relative flex-shrink-0 p-6 border border-b border-solid border-gray-200 bg-white shadow-lgb">
      <div class="flex items-center justify-between">
        <slot name="header" />
      </div>
    </div>
    <div ref="container" class="flex-1 overflow-y-auto">
      <slot />
    </div>
    <div class="relative flex-shrink-0 p-6 border border-t border-solid border-gray-200 bg-white shadow-lgt">
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineExpose, ref, useSlots } from 'vue';

const slots = useSlots();
const container = ref<HTMLDivElement | null>(null);

const scrollDown = (): void => {
  container.value?.scrollTo(0, container.value?.scrollHeight);
};

defineExpose({ scrollDown });
</script>
