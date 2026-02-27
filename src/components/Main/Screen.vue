<template>
  <article v-if="rootNodes.length">
    <h1>Entertainment</h1>

    <ul class="list">
      <li v-for="item in rootNodes" :key="item.id">
        <BaseFile v-if="item.type === 'file'" :title="item.id" />
        <BaseFolder
          v-else-if="item.type === 'folder'"
          :title="item.id"
          :childrenIds="item.childrenIds"
          :path="item.id"
        />
      </li>
    </ul>
  </article>

  <p v-else-if="isLoading">Loading data...</p>
  <p v-else-if="error">Error: {{ error }}</p>
</template>

<script setup lang="ts">
import { provide } from "vue";
import { useEntertainmentData } from "../../composables/useEntertainmentData";
import BaseFile from "../Base/File.vue";
import BaseFolder from "../Base/Folder.vue";

const { rootNodes, isLoading, error, expandedData, onFolderClick } =
  useEntertainmentData();

provide("expandedData", expandedData);
provide("onFolderClick", onFolderClick);
</script>

<style scoped>
.list {
  list-style-type: none;
}
</style>
