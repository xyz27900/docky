<template>
  <div class="flex flex-col gap-2">
    <div class="grid grid-cols-12 gap-2">
      <div class="col-span-10 flex items-center">
        <span class="text-lg">
          {{ title }}
        </span>
      </div>
      <div class="col-span-2">
        <ui-button
          variant="default"
          block
          @click="addItem"
        >
          Add
        </ui-button>
      </div>
    </div>

    <div
      v-for="(item, index) in modelValue"
      :key="index"
      class="grid grid-cols-12 gap-2"
    >
      <div class="col-span-5">
        <ui-text-field
          v-model="item[0]"
          :placeholder="placeholder[0]"
          :error-message="getError(index, 0)"
        >
          <template v-if="'action-0' in slots" #action>
            <slot :index="index" name="action-0" />
          </template>
        </ui-text-field>
      </div>
      <div class="col-span-5">
        <ui-text-field
          v-model="item[1]"
          :placeholder="placeholder[1]"
          :error-message="getError(index, 1)"
        >
          <template v-if="'action-1' in slots" #action>
            <slot :index="index" name="action-1" />
          </template>
        </ui-text-field>
      </div>
      <div class="col-span-2">
        <ui-button
          variant="danger"
          block
          @click="deleteItem(index)"
        >
          <template #icon>
            <icon-trash />
          </template>
        </ui-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, PropType, useSlots } from 'vue';
import IconTrash from '@ui/assets/svg/trash.svg';
import UiButton from '@ui/components/common/UiButton.vue';
import UiTextField from '@ui/components/common/UiTextField.vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Array as PropType<string[][]>,
    required: true,
  },
  placeholder: {
    type: Array as PropType<string[]>,
    required: true,
  },
  errorMessages: {
    type: Array as PropType<string[][]>,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue']);
const slots = useSlots();

const addItem = (): void => {
  const newItem: [string, string] = ['', ''];
  emit('update:modelValue', [...props.modelValue, newItem]);
};

const deleteItem = (index: number): void => {
  const items = [...props.modelValue];
  items.splice(index, 1);
  emit('update:modelValue', items);
};

const getError = (i: number, j: number): string => {
  const errorMessages = props.errorMessages as [string, string][];
  return errorMessages[i] ? errorMessages[i][j] ?? '' : '';
};
</script>
