<template>
  <UCard v-if="!success">
    <template #header>
      Sign-In to Finance App
    </template>

    <form @submit.prevent="handleLogin">
      <UFormGroup label="E-Mail" name="E-Mail" class="mb-4" :required="true" help="You will recieve a confirmation e-mail">
        <UInput type="email" placeholder="E-Mail" v-model="email" required />
      </UFormGroup>

      <UButton type="submit" variant="solid" color="black" :loading="pending" :disabled="pending">
        Sign-In
      </UButton>
    </form>
  </UCard>

  <UCard v-else>
    <template #header>
      E-Mail has been sent
    </template>

    <div class="text-center">
      <p class="mb-4">
        We have sent an e-mail to <strong>{{ email }}</strong> with a link to sign-in.
      </p>
      <p>
        <strong>Important:</strong> The link will expire in 15 minutes.
      </p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const success = ref(false);
const email = ref('');
const pending = ref(false);
const toast = useToast();
const supabase = useSupabaseClient();

useRedirectIfAuthenticated();

const handleLogin = async () => {
  pending.value = true;

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: 'http://localhost:3000/confirm',
      }
    });

    if (error) {
      toast.add({
        title: 'Error Authenticating',
        icon: 'i-heroicons-exclamation-circle',
        description: error.message,
        color: 'red'
      });
    } else {
      success.value = true;
    }
  } finally {

  }
}
</script>
