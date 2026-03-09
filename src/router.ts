import { createRouter, createWebHistory } from "vue-router";
import MainScreen from "./components/Main/Screen.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: MainScreen,
  },
  {
    path: "/:folderPath(.*)*",
    name: "Folder",
    component: MainScreen,
    props: (route: any) => ({ folderPath: route.params.folderPath }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
