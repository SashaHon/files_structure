<template>
  <h1>Entertainment</h1>
  <ul>
    <li>Movies</li>
    <li>Comics</li>
    <li>{{ data }}</li>
  </ul>
</template>

<script setup lang="ts">
import { useEntertainmentData } from "../../composables/useEntertainmentData";

const { data, isLoading, error, fetchEntertainmentData } =
  useEntertainmentData();
</script>
