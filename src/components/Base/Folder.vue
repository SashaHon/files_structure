<template>
  <div>
    <span> FOLDER: {{ title }}</span>
    <span v-if="childrenIds && childrenIds.length">
      ({{ childrenIds.length }} items)</span
    >

    <BaseFolder
      v-if="showChildren"
      v-for="childId in childrenIds"
      :key="childId"
      :title="childId"
      :childrenIds
      :showChildren
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
const props = defineProps<{
  title: string;
  childrenIds: Array<string> | undefined;
  showChildren: boolean;
}>();

// const showChildren = ref(false);
// function onFolderClick(
//   folderId: string,
//   childrenIds: Array<string> | undefined,
// ) {
//   showChildren.value = !showChildren.value;
//   console.log("Clicked folder ID:", props.title);
//   console.log("Children IDs:", props.childrenIds);
//   console.log("Show children:", showChildren.value);

//   // I need to make an API call here to fetch the children of the folder with the given ID
// }

// watch(
//   () => props.showChildren,
//   (newValue) => {
//     console.log("Show children for folder", props.title, ":", newValue);
//   },
// );
</script>
