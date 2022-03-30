<template>
  <div class="relative w-full">
    <ui-text-field
      v-model="search"
      :placeholder="placeholder"
      :error-message="errorMessage"
      @focus="onFocus"
      @blur="onBlur"
    >
      <template v-if="focused && loading" #action>
        <div class="flex items-center justify-center px-4">
          <icon-spinner class="block h-6 w-6 text-blue-600 animate-spin" />
        </div>
      </template>
    </ui-text-field>
    <div v-if="items.length > 0" class="absolute z-index-9 top-full left-0 right-0 mt-2 rounded-lg overflow-hidden border border-solid border-gray-200 bg-white shadow-md">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex items-center py-2 px-4 hover:bg-gray-100 hover:text-blue-600 cursor-pointer truncate transition"
        @mousedown="emit('update:modelValue', item.name)"
      >
        <icon-docker class="block h-5 w-5 mr-2" />
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import debounce from 'lodash.debounce';
import { defineEmits, defineProps, ref, watch } from 'vue';
import IconDocker from '@ui/assets/svg/docker.svg';
import IconSpinner from '@ui/assets/svg/spinner.svg';
import UiTextField from '@ui/components/common/UiTextField.vue';

interface SearchItem {
  id: string;
  name: string;
}

interface SearchResult {
  summaries: SearchItem[] | null;
}

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

const emit = defineEmits(['update:modelValue']);
const focused = ref<boolean>(false);
const loading = ref<boolean>(false);
const search = ref(props.modelValue);
const items = ref<SearchItem[]>([]);
const url = 'https://hub.docker.com/api/content/v1/products';

const searchDebounce = debounce(async (value: string) => {
  loading.value = true;
  const encodedValue = encodeURIComponent(value);

  const results = [
    fetch(`${url}/search?q=${encodedValue}&page=1&page_size=5`),
    fetch(`${url}/search?q=${encodedValue}&page=1&page_size=5&source=community`),
  ];

  const result = await Promise.all(results);
  const receivedItems: SearchItem[] = [];

  for (const item of result) {
    const data = await item.json() as SearchResult;
    receivedItems.push(...(data.summaries ?? []));
  }

  if (focused.value) {
    items.value = receivedItems;
  }

  loading.value = false;
}, 300);

const onFocus = (): void => {
  focused.value = true;
};

const onBlur = (): void => {
  items.value = [];
  search.value = props.modelValue;
  focused.value = false;
};

watch(search, value => {
  if (value !== props.modelValue && value.length > 3) {
    searchDebounce(value);
  }
});

watch(() => props.modelValue, value => {
  if (value !== search.value) {
    search.value = value;
  }
});
</script>
