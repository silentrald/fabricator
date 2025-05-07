/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "./theme/card-markdown.css";
import "./theme/main.css";
import "./theme/variables.css";

import App from "./App.vue";
import { Capacitor } from "@capacitor/core";
import { IonicVue, isPlatform } from "@ionic/vue";
import { Platform } from "./types";
import { createApp } from "vue";
import { createPinia } from "pinia";

import createStoreService from "./services/store.service";
import createDatabaseService from "./db/core/database.service";
import { createCardRepo } from "./repo/card";
import { createInitializerService } from "./services/initializer.service";
import logger from "./modules/logger";
import router from "./router";
import createFilesystemAppService from "./services/filesystem/app.services";
import createFilesystemWebService from "./services/filesystem/web.services";

const platform = Capacitor.getPlatform() as Platform;

window.addEventListener("DOMContentLoaded", async () => {
  const isPlatformMobile = isPlatform("mobile");
  logger.info("Platform", platform);
  logger.info("Is platform mobile?", isPlatformMobile);

  const databaseService = createDatabaseService({
    platform,
    databaseName: "simple-finance",
    databaseVersion: 1,
  });
  const filesystemService = isPlatformMobile
    ? createFilesystemAppService()
    : createFilesystemWebService({ proxyUrl: "http://localhost:5000" });

  const initializerService = createInitializerService({
    platform,
    databaseService,
    filesystemService,
  });
  const initialized = await initializerService.init();
  if (initialized.hasError()) {
    logger.error("Could not initialize application");
    throw initialized.getError();
  }

  // Data/Store
  const result = await databaseService.open();
  if (result.hasError()) {
    logger.error("Could not initialize application");
    throw result.getError();
  }
  const databaseClient = result.getValue();

  const storeService = await createStoreService();

  const pinia = createPinia();
  const app = createApp(App)
    .use(pinia)
    .use(IonicVue)
    .use(router);

  // === Repositories === //

  app.config.globalProperties.$repos = {
    card: createCardRepo({ storeService, databaseClient }),
  };

  // === Services === //
  app.config.globalProperties.$services = {
    store: storeService,
    filesystem: filesystemService,
  };

  await router.isReady();
  app.mount("#app");
});
