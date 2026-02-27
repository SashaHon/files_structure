import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const API_URL = "http://localhost:3001/api/data";

export type FlatNode = {
  id: string;
  type: "folder" | "file";
  childrenIds?: string[];
};

async function fetchByPath(path: string): Promise<FlatNode[]> {
  const url = path ? `${API_URL}/${path}` : API_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  const json = await res.json();
  return json.flatNodes ?? [];
}

export function useEntertainmentData() {
  const route = useRoute();
  const router = useRouter();

  const rootNodes = ref<FlatNode[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const expandedData = ref<Map<string, FlatNode[]>>(new Map());

  async function loadRoot() {
    isLoading.value = true;
    try {
      rootNodes.value = await fetchByPath("");
    } catch {
      error.value = "Failed to load data.";
    } finally {
      isLoading.value = false;
    }
  }

  watch(
    () => route.params.folderPath,
    async (newPath) => {
      const raw = newPath
        ? Array.isArray(newPath)
          ? newPath.join("/")
          : newPath
        : "";
      const segments = raw.split("/").filter(Boolean);

      const activePaths = new Set<string>();
      let cumulative = "";
      for (const seg of segments) {
        cumulative = cumulative ? `${cumulative}/${seg}` : seg;
        activePaths.add(cumulative);
      }

      for (const key of expandedData.value.keys()) {
        if (!activePaths.has(key)) expandedData.value.delete(key);
      }

      for (const path of activePaths) {
        if (!expandedData.value.has(path)) {
          const children = await fetchByPath(path);
          expandedData.value.set(path, children);
        }
      }
    },
    { immediate: true },
  );

  function navigateForward(folderPath: string) {
    router.push(`/${folderPath}`);
  }

  function navigateBackward(folderPath: string) {
    const segments = folderPath.split("/").filter(Boolean);
    segments.pop();
    const newPath = segments.join("/");
    router.push(newPath ? `/${newPath}` : "/");
  }

  function onFolderClick(
    folderPath: string,
    childrenIds: string[] | undefined,
  ) {
    if (!childrenIds || childrenIds.length === 0) return;

    const isExpanded = expandedData.value.has(folderPath);

    if (isExpanded) {
      navigateBackward(folderPath);
    } else {
      navigateForward(folderPath);
    }
  }

  loadRoot();

  return {
    rootNodes,
    isLoading,
    error,
    expandedData,
    onFolderClick,
  };
}
