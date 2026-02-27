<template>
  <div>
    <span>
      Folder:
      <span class="folderTitle" @click="handleClick">
        {{ title }}
        <span v-if="childrenIds && childrenIds.length">
          ({{ childrenIds.length }} items)
        </span>
      </span>
    </span>

    <!-- Render children when this folder is expanded -->
    <ul v-if="expandedChildren" class="childrenList">
      <li v-for="child in expandedChildren" :key="child.id">
        <BaseFile v-if="child.type === 'file'" :title="child.id" />
        <BaseFolder
          v-else-if="child.type === 'folder'"
          :title="child.id"
          :childrenIds="child.childrenIds"
          :path="`${path}/${child.id}`"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import type { Ref } from "vue";
import BaseFile from "./File.vue";
import BaseFolder from "./Folder.vue";
import type { FlatNode } from "../../types/shared";

const props = defineProps<{
  title: string;
  childrenIds: string[] | undefined;
  path: string; // full path, e.g. "movies" or "movies/Avengers"
}>();

const expandedData = inject<Ref<Map<string, FlatNode[]>>>("expandedData")!;

const onFolderClick =
  inject<(path: string, childrenIds: string[] | undefined) => void>(
    "onFolderClick",
  )!;

// expandedChildren are available when this folder's path is in expandedData
const expandedChildren = computed(
  () => expandedData.value.get(props.path) ?? null,
);

function handleClick() {
  onFolderClick(props.path, props.childrenIds);
}
</script>

<style scoped>
.folderTitle {
  font-weight: bold;
  cursor: pointer;
}

.folderTitle:hover {
  color: #646cff;
}

.childrenList {
  list-style-type: none;
  padding-left: 36px;
  margin: 0;
}
</style>
