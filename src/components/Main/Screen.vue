<template>
  <h1>Entertainment</h1>
  <ul v-if="data" class="list">
    <li v-for="item in data" :key="item.id">
      <BaseFile v-if="item.type === 'file'" :title="item.id" />
      <BaseFolder
        v-else-if="item.type === 'folder'"
        :title="item.id"
        :childrenIds="item.childrenIds"
      />
    </li>
  </ul>
  <p v-else-if="isLoading">Loading data...</p>
  <p v-else-if="error">Error: {{ error }}</p>
</template>

<script setup lang="ts">
import { useEntertainmentData } from "../../composables/useEntertainmentData";
import BaseFile from "../Base/File.vue";
import BaseFolder from "../Base/Folder.vue";

const { data, isLoading, error } = useEntertainmentData();
</script>

<style scoped>
.list {
  list-style-type: none;
}
</style>
