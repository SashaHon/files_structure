import { onMounted, ref } from "vue";

type ItemType = "folder" | "file";

interface EntertainmentNode {
	type: ItemType;
	children?: Record<string, EntertainmentNode>;
}

interface EntertainmentData {
	root: Record<string, EntertainmentNode>;
}

const API_URL = "http://localhost:3001/api/movies";

export function useEntertainmentData() {
	const data = ref<EntertainmentData | null>(null);
	const isLoading = ref(false);
	const error = ref<string | null>(null);

	const fetchEntertainmentData = async () => {
		isLoading.value = true;
		error.value = null;

		try {
			const response = await fetch(API_URL);

			if (!response.ok) {
				throw new Error(`Request failed with status ${response.status}`);
			}

			const responseData = (await response.json()) as EntertainmentData;
			data.value = responseData;
		} catch {
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
		fetchEntertainmentData,
	};
}
