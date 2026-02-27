import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

// type ItemType = "folder" | "file";

// interface EntertainmentNode {
//   type: ItemType;
//   children?: Record<string, EntertainmentNode>;
// }

// interface EntertainmentData {
// 	root: Record<string, EntertainmentNode>;
// }

const API_URL = "http://localhost:3001/api/data";

export function useEntertainmentData() {
  const data = ref<any | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const route = useRoute();

  const fetchEntertainmentData = async () => {
    isLoading.value = true;
    error.value = null;

    const { folderId } = route.params;
    const currentApiUrl = folderId ? `${API_URL}/${folderId}` : API_URL;

    try {
      const response = await fetch(currentApiUrl);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const responseData = await response.json();
      data.value = responseData;
    } catch (err) {
      error.value = "Failed to load entertainment data from server.";
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchEntertainmentData);

  return {
    data,
    isLoading,
    error,
  };
}
