<template>
  <button class="px-4 text-gray-400 hover:text-blue-600 transition" @mousedown.prevent="selectPath">
    <icon-folder class="block w-5 h-5" />
  </button>
</template>

<script lang="ts" setup>
import { defineEmits } from 'vue';
import { DIALOG_PATH } from '@common/constants/channels';
import IconFolder from '@ui/assets/svg/folder.svg';

const emit = defineEmits(['input']);

const selectPath = async (): Promise<void> => {
  const path = await window.ipcRenderer.callMain(DIALOG_PATH);
  if (path) {
    emit('input', path);
  }
};
</script>
