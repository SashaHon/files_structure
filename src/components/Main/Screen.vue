<template>
  <h1>Entertainment</h1>
  <ul>
    <li>ouihop</li>
    <li>{{ rootElement }}</li>
    <li>3</li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useEntertainmentData } from "../../composables/useEntertainmentData";

const { data, isLoading, error, fetchEntertainmentData } =
  useEntertainmentData();

const rootElement = computed(() => data.value ?? null);
</script>
