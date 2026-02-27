<template>
  <p>File: {{ title }}</p>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>
