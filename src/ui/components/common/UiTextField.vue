<template>
  <div
    class="relative flex w-full h-10 border border-solid focus-within:border-blue-600 rounded-lg transition"
    :class="{
      'border-red-600': isError,
      'border-gray-300': !isError
    }"
  >
    <input
      class="flex-1 h-full w-full border-0 focus:placeholder-gray-400 bg-transparent"
      :class="{
        'mx-4': !('action' in slots),
        'ml-4': 'action' in slots,
        'placeholder-red-500': isError,
        'placeholder-gray-400': !isError
      }"
      type="text"
      :value="modelValue"
      :placeholder="isError ? errorMessage : placeholder"
      spellcheck="false"
      @input="onInput"
      @focus="emit('focus')"
      @blur="emit('blur')"
    >
    <slot name="action" />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, useSlots } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  errorMessage: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'focus', 'blur']);
const slots = useSlots();

const isError = computed(() => props.errorMessage?.length > 0);

const onInput = (e: Event): void => {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
};
</script>
