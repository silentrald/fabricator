<script setup lang="ts">
import {
  InfiniteScrollCustomEvent,
  IonContent,
  IonHeader,
  IonFooter,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonPage,
  IonSearchbar,
  IonToolbar,
  IonButtons,
  IonBackButton,
  onIonViewWillEnter,
} from "@ionic/vue";
import HeaderLife from "@/views/components/life/HeaderLife.vue";
import CardTextItem from "@/views/components/card/CardTextItem.vue";

import logger from "@/modules/logger";
import { ref } from "vue";
import useGlobal from "@/composables/global";

import { CardModel } from "@/models/card.model";
import { Toast } from "@capacitor/toast";

const { card: cardRepo } = useGlobal().$repos;

const page = ref<number>(1);
const more = ref<boolean>(true);
const cards = ref<CardModel[]>([]);
const search = ref<string>("");

async function loadCards() {
  const cardsResult = await cardRepo.getCards({
    name: search.value,
    keyword: search.value,
    type: search.value,
    favorite: search.value === "" ? true : null,
    pagination: {
      page: page.value,
      limit: 20,
    },
  });

  if (cardsResult.hasError()) {
    logger.error("Could not get cards", cardsResult.getError());
    Toast.show({
      text: "Could not get cards",
      duration: "long",
    });
    return;
  }

  if (cardsResult.getValue().length === 0) {
    more.value = false;
    return;
  }

  cards.value = [ ...cards.value, ...cardsResult.getValue() ];
}

async function loadMoreCards(event: InfiniteScrollCustomEvent) {
  if (!more.value) {
    return;
  }

  ++page.value;
  await loadCards();
  await event.target.complete();
}

const onSearchChanged = async (event) => {
  const newSearch = event.target.value;
  if (search.value === newSearch) {
    return;
  }
  search.value = newSearch;

  more.value = true;
  page.value = 1;
  cards.value.splice(0, cards.value.length);

  await loadCards();
};

onIonViewWillEnter(async () => {
  more.value = true;
  page.value = 1;
  cards.value.splice(0, cards.value.length);

  await loadCards();
});
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"/>
        </ion-buttons>
        <header-life />
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <card-text-item
          v-for="card in cards"
          :key="card.id"
          :card="card"
        />
      </ion-list>

      <ion-infinite-scroll
        :disabled="!more"
        @ionInfinite="loadMoreCards"
      >
        <ion-infinite-scroll-content />
      </ion-infinite-scroll>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-searchbar
          placeholder="Search..."
          :debounce="1000"
          @ionInput="onSearchChanged"
          @ionChange="onSearchChanged"
          @ionClear="onSearchChanged"
        />
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>
