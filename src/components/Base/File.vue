<template>
  <p class="file">📄 {{ title }}</p>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>

<style scoped>
.file {
  margin: 2px 0;
  color: #888;
}
</style>
