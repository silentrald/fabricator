<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonFooter,
} from "@ionic/vue";
import LoaderDialog from "@/views/components/LoaderDialog.vue";

import BookIcon from "@/views/icons/fill/BookIcon.vue";
import BoxOpenIcon from "@/views/icons/fill/BoxOpenIcon.vue";
import CardsBlankIcon from "@/views/icons/fill/CardsBlankIcon.vue";
import HeartIcon from "@/views/icons/fill/HeartIcon.vue";
import MagnifyingGlassIcon from "@/views/icons/MagnifyingGlassIcon.vue";

import { onMounted, ref } from "vue";
import system from "@/modules/system";

import { useRouter } from "vue-router";
import useGlobal from "@/composables/global";
import useInitializer from "@/composables/initializer";

const {
  $repos: { card: cardRepo },
  $services: { store: storeService },
} = useGlobal();
const router = useRouter();

const loader = ref();
const loaderCurrent = ref<number>(0);
const loaderTotal = ref<number>(0);
const loaderText = ref<string>("");

// TODO: Add translations
const buttons = [
  { id: "search", icon: MagnifyingGlassIcon, text: "Search" },
  { id: "life", icon: HeartIcon, text: "Life" },
  // TODO: Remove hide property once everything is implemented
  { id: "collection", icon: BoxOpenIcon, text: "Collection", hide: true },
  { id: "deck", icon: CardsBlankIcon, text: "Deck", hide: true },
  { id: "rulings", icon: BookIcon, text: "Rulings", hide: true },
];

const initializer = useInitializer({
  storeService, cardRepo,

  async showDialog() {
    loader.value.show();
    await system.keepAwake();
  },

  async hideDialog() {
    loader.value.hide();
    await system.allowSleep();
  },

  updateDialog(updates: {
    current: number;
    total: number;
    text: text;
  }) {
    loaderCurrent.value = updates.current;
    loaderTotal.value = updates.total;

    if (updates.text) {
      loaderText.value = updates.text;
    }
  },
});

onMounted(async () => {
  await initializer.init();
});
</script>

<template>
<ion-page>
  <ion-content :fullscreen="true">
    <loader-dialog ref="loader"
      :current="loaderCurrent"
      :total="loaderTotal"
    >
      {{ loaderText }}
    </loader-dialog>

    <div id="app-name">FaBricator</div>

    <div id="nav-buttons">
      <template v-for="button in buttons" :key="button.id">
        <!-- TODO: Remove the v-if once everything is implemented -->
        <div v-if="!button.hide" class="nav-container">
          <button class="nav-button" @click="router.push(button.id)">
            <component :is="button.icon" class="nav-icon" />
          </button>
          <div class="nav-text">{{ button.text }}</div>
        </div>
      </template>
    </div>

    <div/>
  </ion-content>

  <ion-footer>
    <div id="disclaimer">
      FaBricator is in no way affiliated with Legend Story Studios.
      <a href="https://legendstory.com">Legend Story Studios</a>®,
      <a href="https://fabtcg.com">Flesh and Blood</a>™,
      and set names are trademarks of Legend Story Studios.
      Flesh and Blood characters, cards, logos, and art are property
      of Legend Story Studios.
    </div>
  </ion-footer>
</ion-page>
</template>

<style scoped>
#app-name {
  margin-top: 32px;
  font-size: 48px;
  font-weight: 700;
  text-align: center;
}

#nav-buttons {
  margin-top: 64px;
  display: flex;
  justify-content: center;
  gap: 48px;

  .nav-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    .nav-button {
      border-radius: 50%;
      padding: 16px;
      margin-bottom: 8px;

      .nav-icon {
        font-size: 32px;
      }
    }

    .nav-text {
      font-size: 16px;
      font-weight: 500;
    }
  }
}

#disclaimer {
  padding: 16px;
  text-align: center;
}
</style>

