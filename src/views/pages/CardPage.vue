<script setup lang="ts">
import { CardModel } from "@/models/card.model";

import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonFooter,
  IonPage,
  IonToolbar,
} from "@ionic/vue";
import HeaderLife from "@/views/components/life/HeaderLife.vue";
import CardCorner from "@/views/components/card/CardCorner.vue";
import CardImage from "@/views/components/card/CardImage.vue";
import CardLegality from "@/views/components/card/CardLegality.vue";
import OutlinedStarIcon from "@/views/icons/outline/StarIcon.vue";
import FilledStarIcon from "@/views/icons/fill/StarIcon.vue";
import vCardMarkdown from "@/directives/card-markdown";

import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Toast } from "@capacitor/toast";

import logger from "@/modules/logger";
import useGlobal from "@/composables/global";
import useImage from "@/composables/image";

const route = useRoute();
const {
  $repos: { card: cardRepo },
  $services: { filesystem: filesystemService },
} = useGlobal();
const image = useImage({ filesystemService });

const card = ref<CardModel | null>(null);

onMounted(async () => {
  const id = route.params.id.toString();
  const cardResult = await cardRepo.getCard(id);
  if (cardResult.hasError()) {
    logger.error("Card page error", cardResult.getError());
    Toast.show({
 text: `Could not get card with id "${id}"`,
    });
    return;
  }

  card.value = cardResult.getValue();
});

const pitchColor = computed(() => {
  const pitch = card.value?.pitch;
  // Unknown
  if (typeof pitch !== "number") {
    return "#f3e9db";
  }

  // Red Pitch
  if (pitch === 1) {
    return "#b51823";
  }

  // Yellow Pitch
  if (pitch === 2) {
    return "#ffe500";
  }

  // Blue Pitch
  return "#0096d6";
});

const cardTopLeft = computed(() => {
  if (!card.value) {
    return null;
  }

  const value: number | null | undefined = card.value.pitch;
  if (typeof value === "number") {
    return {
      icon: `p${value}`,
      value,
    };
  }

  return null;
});

const cardTopRight = computed(() => {
  if (!card.value) {
    return null;
  }

  const value: number | null | undefined = card.value.cost;
  if (typeof value === "number") {
    return {
      icon: "cost",
      value,
    };
  }

  return null;
});

const cardBottomLeft = computed(() => {
  if (!card.value) {
    return null;
  }

  let value: number | null | undefined = card.value.power;
  if (typeof value === "number") {
    return {
      icon: "pwr",
      value,
    };
  }

  value = card.value.intellect;
  if (typeof value === "number") {
    return {
      icon: "int",
      value,
    };
  }

  return null;
});

const cardBottomRight = computed(() => {
  if (!card.value) {
    return null;
  }

  let value: number | null | undefined = card.value.defense;
  if (typeof value === "number") {
    return {
      icon: "def",
      value,
    };
  }

  value = card.value.health;
  if (typeof value === "number") {
    return {
      icon: "hp",
      value,
    };
  }

  return null;
});

function onCardImageClicked() {
  const url = card.value?.imageUrl;
  if (!url) {
    return;
  }

  console.debug("UwU todo", url);
}

async function onFavoriteClicked() {
  if (!card.value) {
    return;
  }

  const id = card.value.id;
  const newFavorite = !card.value.favorite;

  let result: any;
  result = newFavorite
    ? await image.saveImageUrl(card.value.imageUrl)
    : await image.deleteImageUrl(card.value.imageUrl);
  if (result.hasError()) {
    // Toast
    return;
  }

  result = await cardRepo.setFavorite(id, newFavorite);
  if (result.hasError()) {
    // TODO: toast
    return;
  }

  card.value.favorite = newFavorite;
}
</script>

<template>
<ion-page>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button
          default-href="/"
        />
      </ion-buttons>
      <header-life />
    </ion-toolbar>
  </ion-header>

  <ion-content :fullscreen="true" v-if="card">
    <card-legality type="classic-constructed"
      :legality="card.classicConstructedLegality"
      :show-list="['V', 'S', 'B']"
    />
    <card-legality type="blitz"
      :legality="card.blitzLegality"
      :show-list="['V', 'S', 'B']"
    />
    <card-legality type="ultimate-pit-fight"
      :legality="card.ultimatePitFightLegality"
      :show-list="['B']"
    />
    <card-legality type="commoner"
      :legality="card.commonerLegality"
      :show-list="['S', 'B']"
    />
    <card-legality type="living-legend"
      :legality="card.livingLegendLegality"
      :show-list="['R', 'B']"
    />

    <card-image class="card-image"
      :src="card.imageUrl"
      :favorite="card.favorite"
      :alt="card.name"
      @click="onCardImageClicked"
    />

    <button class="card-favorite-button"
      @click="onFavoriteClicked"
    >
      <component class="card-favorite"
        :is="card.favorite ? FilledStarIcon : OutlinedStarIcon"
      />
    </button>
  </ion-content>

  <ion-footer>
    <div v-if="card" class="card-container">
      <div v-if="card.pitch"
        class="card-pitch-border"
        :style="{
          backgroundColor: pitchColor,
        }"
      />

      <div class="card-info">
        <div class="card-header">
          <card-corner icon-position="left"
            :icon="cardTopLeft?.icon"
            :value="cardTopLeft?.value"
          />

          <div class="card-name">{{ card.name }}</div>

          <card-corner icon-position="right"
            :icon="cardTopRight?.icon"
            :value="cardTopRight?.value"
          />
        </div>

        <div class="card-separator" />

        <div class="card-text" v-card-markdown>
          {{ card.text }}
        </div>

        <div class="card-separator" />

        <div class="card-footer">
          <card-corner icon-position="left"
            :icon="cardBottomLeft?.icon"
            :value="cardBottomLeft?.value"
          />

          <div class="card-type">{{ card.types }}</div>

          <card-corner icon-position="right"
            :icon="cardBottomRight?.icon"
            :value="cardBottomRight?.value"
          />
        </div>
      </div>
    </div>
  </ion-footer>
</ion-page>
</template>

<style scoped>
.card-image {
  width: 70%;
  margin: auto;
}

.card-container {
  margin: 0 8px 8px 8px;
  border-radius: 8px;
  overflow: hidden;

  background-color: #f3e9db;
  color: #000000;
}

.card-pitch-border {
  height: 5px;
}

.card-info {
  padding: 4px 0;
}

.card-separator {
  height: 2px;
  background-color: black;
}

.card-header,
.card-footer {
  display: flex;
  justify-content: space-between;
  padding: 4px 16px;
}

.card-name {
  font-weight: 700;
}

.card-text {
  padding: 0 16px;
}

.card-favorite-button {
  position: absolute;
  top: 64px;
  right: 8px;
  background: none;

  .card-favorite {
    font-size: 48px;
    color: #b51823;
  }
}
</style>
