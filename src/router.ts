import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";

import HomePage from "./views/pages/HomePage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/life",
    name: "Life",
    component: () => import("./views/pages/LifePage.vue"),
  },
  {
    path: "/search",
    name: "CardSearch",
    component: () => import("./views/pages/CardSearchPage.vue"),
  },
  {
    path: "/card/:id",
    name: "Card",
    component: () => import("./views/pages/CardPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
