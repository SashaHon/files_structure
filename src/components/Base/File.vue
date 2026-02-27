<template>
  <p>
    <span> FILE: {{ title }}</span>
  </p>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>
