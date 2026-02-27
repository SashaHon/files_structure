<template>
  <article v-if="data">
    {{ data }}
    <h1>Entertainment</h1>
    <ul class="list">
      <li v-for="item in data" :key="item.id">
        {{ item }}
        <BaseFile v-if="item.type === 'file'" :title="item.id" />
        <BaseFolder
          v-else-if="item.type === 'folder'"
          :title="item.id"
          :childrenIds="item.childrenIds"
          :showChildren
          :depthLevel="item.depthLevel"
          @click="onFolderClick(item.id, item.childrenIds, item.depthLevel)"
        />
      </li>
    </ul>
  </article>

  <p v-else-if="isLoading">Loading data...</p>
  <p v-else-if="error">Error: {{ error }}</p>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useEntertainmentData } from "../../composables/useEntertainmentData";
import BaseFile from "../Base/File.vue";
import BaseFolder from "../Base/Folder.vue";

const router = useRouter();
const { data, isLoading, error } = useEntertainmentData();

const showChildren = ref(false);

function onFolderClick(
  folderId: string,
  childrenIds: Array<string> | undefined,
  depthLevel: number,
) {
  console.log("Clicked this item:", { folderId, childrenIds, depthLevel });
  showChildren.value = !showChildren.value;
  // console.log("Clicked folder ID:", folderId);
  // console.log("Children IDs:", childrenIds);
  router.push({ name: "Folder", params: { folderId } });
}

watch(showChildren, (newValue) => {
  console.log("Show children:", newValue);
});
</script>

<style scoped>
.list {
  list-style-type: none;
}
</style>
