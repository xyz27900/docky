<template>
  <full-page-layout ref="layoutRef">
    <template #header>
      <span class="text-lg">Container logs</span>
    </template>

    <div class="min-h-full p-6">
      <code class="text-sm font-light">
        <span
          v-for="(line, index) in logsModule.logs"
          :key="index"
          class="block"
        >
          {{ line }}
        </span>
      </code>
    </div>

    <template #footer>
      <ui-button
        variant="primary"
        block
        @click="router.replace({name: 'container-run'})"
      >
        Run new container
      </ui-button>
    </template>
  </full-page-layout>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import UiButton from '@ui/components/common/UiButton.vue';
import FullPageLayout from '@ui/layouts/FullPageLayout.vue';
import { logsModule } from '@ui/store';

const router = useRouter();
const layoutRef = ref<HTMLDivElement | null>(null);

watch(() => logsModule.logs.length, () => {
  const layout = layoutRef.value as (HTMLDivElement & { scrollDown: () => void }) | null;
  nextTick(() => layout?.scrollDown());
});

onBeforeUnmount(() => logsModule.detach());
</script>
