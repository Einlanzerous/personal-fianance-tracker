<template>
  <UModal v-model="isOpen">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        {{ isEditing ? 'Edit' : 'Add' }} Transaction
      </template>

      <UForm :state="state" :schema="schema" @submit.prevent="save">
        <UFormGroup label="Type" :required="true" name="type" class="mb-4">
          <USelect :disabled="isEditing" placeholder="Select the transaction type" :options="transactionTypes"
            v-model="state.type" />
        </UFormGroup>

        <UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
          <UInput type="number" placeholder="Enter transaction amount" v-model.number="state.amount" />
        </UFormGroup>

        <UFormGroup label="Date" :required="true" name="created_at" class="mb-4">
          <UInput type="date" icon="i-heroicons-calendar-days-20-solid" v-model="state.created_at" />
        </UFormGroup>

        <UFormGroup label="Description" hint="Optional" name="description" class="mb-4">
          <UInput placeholder="Description" v-model="state.description" />
        </UFormGroup>

        <UFormGroup label="Category" :required="true" name="category" class="mb-4" v-if="state.type === 'Expense'">
          <USelect placeholder="Category" :options="categories" v-model="state.category" />
        </UFormGroup>

        <UButton type="submit" color="black" variant="solid" label="Save" :loading="isLoading" />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { categories, transactionTypes } from '~/constants';
import { z } from 'zod';

const props = defineProps({
  modalValue: Boolean,
  transaction: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(['update:modalValue', 'saved']);
const isEditing = computed(() => !!props.transaction);

const defaultSchema = z.object({
  created_at: z.coerce.date().max(new Date()),
  description: z.string().optional(),
  amount: z.number().positive('Amount needs to be greater than 0'),
});

const incomeSchema = z.object({
  type: z.literal('Income'),
});

const expenseSchema = z.object({
  type: z.literal('Expense'),
  category: z.enum(categories),
});

const investmentSchema = z.object({
  type: z.literal('Investment'),
});

const savingsSchema = z.object({
  type: z.literal('Savings'),
});

const schema = z.intersection(
  z.discriminatedUnion('type', [
    incomeSchema,
    expenseSchema,
    investmentSchema,
    savingsSchema,
  ]),
  defaultSchema
);

const isLoading = ref(false);
const supabase = useSupabaseClient();
const { toastSuccess, toastError } = useAppToast();

// Fix error handling for validation issues
const save = async () => {
  isLoading.value = true;
  try {
    const { error } = await supabase
      .from('transactions')
      .upsert({
        ...state.value,
        id: props.transaction?.id,
      });

    if (!error) {
      toastSuccess({
        title: 'Transaction Saved',
      });
      isOpen.value = false;
      emit('saved');
      return;
    }

    throw error;
  } catch (error: any) {
    toastError({
      title: 'Transaction not Saved',
      description: error.message,
    });
  } finally {
    isLoading.value = false;
  }
};

const initialState = isEditing.value ?
  {
    type: props.transaction?.type,
    amount: props.transaction?.amount,
    created_at: props.transaction?.created_at.split('T')[0],
    description: props.transaction?.description,
    category: props.transaction?.category,
  } : {
    type: undefined,
    amount: 0,
    created_at: undefined,
    description: undefined,
    category: undefined,
  };

const state = ref(
  {
    ...initialState,
  }
);
const resetForm = () => {
  Object.assign(state.value, initialState);
};

const isOpen = computed({
  get: () => props.modalValue,
  set: (value) => {
    if (!value) resetForm();
    emit('update:modalValue', value);
  },
});
</script>
