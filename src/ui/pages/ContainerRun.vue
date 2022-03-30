<template>
  <full-page-layout>
    <template #header>
      <span class="text-xl">Launch container</span>
      <ui-button
        variant="default"
        @click="load"
      >
        <template #icon>
          <icon-upload />
        </template>
        Load configuration
      </ui-button>
    </template>

    <div class="flex flex-col gap-6 p-6">
      <ui-card>
        <div class="flex items-center gap-4">
          <span class="text-lg">
            Image
          </span>
          <image-search
            v-model="data.image"
            class="basis-3/4"
            placeholder="Start typing"
            :error-message="errorMessages.name.message"
          />
          <ui-text-field
            v-model="data.tag"
            class="basis-1/4"
            placeholder="Tag"
            :error-message="errorMessages.tag.message"
          />
        </div>
      </ui-card>

      <ui-card>
        <values-pair
          v-model="data.ports"
          title="Ports"
          :placeholder="['Host', 'Container']"
          :error-messages="errorMessages.ports.message"
        />
      </ui-card>

      <ui-card>
        <values-pair
          v-model="data.volumes"
          title="Volumes"
          :placeholder="['Host', 'Container']"
          :error-messages="errorMessages.volumes.message"
        >
          <template #action-0="{ index }">
            <path-selector @input="data.volumes[index][0] = $event" />
          </template>
        </values-pair>
      </ui-card>

      <ui-card>
        <values-pair
          v-model="data.variables"
          title="Variables"
          :placeholder="['Name', 'Value']"
          :error-messages="errorMessages.variables.message"
        />
      </ui-card>
    </div>

    <template #footer>
      <div class="flex gap-4">
        <ui-button
          variant="default"
          block
          @click="save"
        >
          <template #icon>
            <icon-download />
          </template>
          Save configuration
        </ui-button>

        <ui-button
          variant="primary"
          block
          :disabled="loading"
          @click="run"
        >
          <template #icon>
            <icon-play />
          </template>
          Launch
        </ui-button>
      </div>
    </template>
  </full-page-layout>
</template>

<script lang="ts" setup>
import cloneDeep from 'lodash.clonedeep';
import { computed, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { CONFIG_LOAD, CONFIG_SAVE, DIALOG_ERROR } from '@common/constants/channels';
import { Container, ContainerData } from '@common/models/container.model';
import IconDownload from '@ui/assets/svg/download.svg';
import IconPlay from '@ui/assets/svg/play.svg';
import IconUpload from '@ui/assets/svg/upload.svg';
import UiButton from '@ui/components/common/UiButton.vue';
import UiCard from '@ui/components/common/UiCard.vue';
import UiTextField from '@ui/components/common/UiTextField.vue';
import ImageSearch from '@ui/components/ImageSearch.vue';
import PathSelector from '@ui/components/PathSelector.vue';
import ValuesPair from '@ui/components/ValuesPair.vue';
import FullPageLayout from '@ui/layouts/FullPageLayout.vue';
import { logsModule } from '@ui/store';
import { parseConfig } from '@ui/utils/config';
import { notEmpty, notEmptyDeep, validation } from '@ui/validation/rules';

const router = useRouter();
const isDirty = ref(true);
const loading = ref(false);

const data = reactive<ContainerData>({
  image: '',
  tag: '',
  ports: [
    ['', ''],
  ],
  volumes: [],
  variables: [],
});

const errorMessages = computed(() => ({
  name: validation(data.image, isDirty.value, notEmpty),
  tag: validation(data.tag, isDirty.value, notEmpty),
  ports: validation(data.ports, isDirty.value, notEmptyDeep),
  volumes: validation(data.volumes, isDirty.value, notEmptyDeep),
  variables: validation(data.variables, isDirty.value, notEmptyDeep),
}));

const isValid = computed(() => {
  const { name, tag, ports, volumes, variables } = errorMessages.value;
  return name.isValid && tag.isValid && ports.isValid && volumes.isValid && variables.isValid;
});

const container = computed<Container>(() => ({
  image: data.image,
  tag: data.tag,
  ports: data.ports.map(item => ({ host: item[0], container: item[1] })),
  volumes: data.volumes.map(item => ({ host: item[0], container: item[1] })),
  variables: data.variables.map(item => ({ name: item[0], value: item[1] })),
}));

const load = async (): Promise<void> => {
  const result = await window.ipcRenderer.callMain(CONFIG_LOAD);
  if (typeof result !== 'string') {
    return;
  }

  try {
    const { image, tag, ports, volumes, variables } = parseConfig(result);
    data.image = image;
    data.tag = tag;
    data.ports = ports;
    data.volumes = volumes;
    data.variables = variables;
  } catch (error) {
    await window.ipcRenderer.callMain(DIALOG_ERROR, (error as Error).message);
    return;
  }
};

const save = async (): Promise<void> => {
  isDirty.value = false;
  if (!isValid.value) {
    return;
  }

  await window.ipcRenderer.callMain(CONFIG_SAVE, cloneDeep(data));
};

const run = async (): Promise<void> => {
  loading.value = true;
  isDirty.value = false;
  if (!isValid.value) {
    loading.value = false;
    return;
  }

  await logsModule.attach(container.value);
  await router.push({ name: 'container-logs' });
};

watch(data, (): boolean => isDirty.value = true, { deep: true });
</script>
