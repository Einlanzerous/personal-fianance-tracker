<template>
  <Uform :state="state" :schema="schema">
    <UFormGroup class="mb-4" label="Full Name" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>

    <UFormGroup class="mb-4" label="Email" name="email" help="You will recieve a confirmation email on both old and new addresses if you modify e-mail address">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UButton type="submit" color="black" variant="solid" label="Save" :pending="pending" />
  </Uform>
</template>

<script setup lang="ts">
import { z } from 'zod';

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const { toastError, toastSuccess } = useAppToast();
const pending = ref(false);

const state = ref({
  name: '',
  email: user.value?.email,
});

const schema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
});
</script>
