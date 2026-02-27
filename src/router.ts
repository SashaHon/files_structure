import { createRouter, createWebHistory } from "vue-router";
import MainScreen from "./components/Main/Screen.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: MainScreen,
  },
  {
    path: "/:folderId",
    name: "Folder",
    component: MainScreen, // You can swap this for a dedicated Folder view if needed
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
