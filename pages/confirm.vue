<template>
  <UCard>
    <template #header>
      Signing in...
    </template>

    Please wait a moment while you are signed in...
  </UCard>
</template>

<script setup lang="ts">
useRedirectIfAuthenticated();
</script>
