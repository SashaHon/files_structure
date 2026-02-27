import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const API_URL = "http://localhost:3001/api/data";

export type FlatNode = {
  id: string;
  type: "folder" | "file";
  childrenIds?: string[];
};

type FolderPath = string | string[] | undefined;

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

  async function loadRootNodes() {
    isLoading.value = true;
    try {
      rootNodes.value = await fetchByPath("");
    } catch {
      error.value = "Failed to load data.";
    } finally {
      isLoading.value = false;
    }
  }

  // #region Utils
  // Converts folderPath (string | string[] | undefined) to normalized string path, e.g. "a/b" or ["a", "b"] => "a/b"
  function normalizeFolderPath(folderPath: FolderPath): string {
    if (!folderPath) return "";
    return Array.isArray(folderPath) ? folderPath.join("/") : folderPath;
  }

  // Splits a normalized path string into non-empty segments, e.g. "a/b" => ["a", "b"]
  function splitPathSegments(path: string): string[] {
    return path.split("/").filter(Boolean);
  }

  // Builds cumulative paths from segments, e.g. ["a","b"] => ["a", "a/b"]
  function getCumulativePaths(segments: string[]): string[] {
    const result: string[] = [];
    let cumulative = "";

    for (const seg of segments) {
      cumulative = cumulative ? `${cumulative}/${seg}` : seg;
      result.push(cumulative);
    }

    return result;
  }
  // #endregion

  // #region Path handling and data synchronization
  function getActivePaths(folderPath: FolderPath): Set<string> {
    const raw = normalizeFolderPath(folderPath);
    const segments = splitPathSegments(raw);
    const cumulativePaths = getCumulativePaths(segments);
    return new Set(cumulativePaths);
  }

  async function updateExpandedData(activePaths: Set<string>) {
    // Remove paths that are no longer active
    for (const key of expandedData.value.keys()) {
      if (!activePaths.has(key)) expandedData.value.delete(key);
    }
    // Add new active paths
    for (const path of activePaths) {
      if (!expandedData.value.has(path)) {
        const children = await fetchByPath(path);
        expandedData.value.set(path, children);
      }
    }
  }

  watch(
    () => route.params.folderPath,
    async (newPath) => {
      const activePaths = getActivePaths(newPath);
      await updateExpandedData(activePaths);
    },
    { immediate: true },
  );
  // #endregion

  // #region Navigation handlers
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
  // #endregion

  loadRootNodes();

  return {
    rootNodes,
    isLoading,
    error,
    expandedData,
    onFolderClick,
  };
}
