<template>
  <p>
    <span> FOLDER: {{ title }}</span>
    <span v-if="childrenIds"> ({{ childrenIds.length }} items)</span>
  </p>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  childrenIds: Array<string> | undefined;
}>();
</script>
