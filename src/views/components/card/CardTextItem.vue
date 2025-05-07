<script setup lang="ts">
import { IonItem } from "@ionic/vue";
import OutlinedStarIcon from "@/views/icons/outline/StarIcon.vue";
import FilledStarIcon from "@/views/icons/fill/StarIcon.vue";

import { CardModel } from "@/models/card.model";
import { computed } from "vue";

const { card } = defineProps<{
  card: CardModel;
}>();

const pitchColor = computed(() => {
  // Unknown
  if (card.pitch === undefined || card.pitch === null) {
    return "#f3e9db";
  }

  // Red Pitch
  if (card.pitch === 1) {
    return "#b51823";
  }

  // Yellow Pitch
  if (card.pitch === 2) {
    return "#ffe500";
  }

  // Blue Pitch
  return "#0096d6";
});

// TODO: Not working
// async function onFavoriteClicked() {
//   const newFavorite = !card.favorite;
//   let result: any;
// 
//   result = newFavorite
//     ? await image.saveImageUrl(card.imageUrl)
//     : await image.deleteImageUrl(card.imageUrl);
//   if (result.hasError()) {
//     // TODO: toast
//     return;
//   }
// 
//   result = await cardRepo.setFavorite(card.id, newFavorite);
//   if (result.hasError()) {
//     // TODO: toast
//     return;
//   }
// }
</script>

<template>
  <ion-item :router-link="`/card/${card.id}`">
    <div class="card-item">
      <div class="card-pitch"
        :style="{ backgroundColor: pitchColor }"
      />

      <div class="card-content">
        <div class="card-name">
          {{ card.name }}
        </div>

        <component class="card-favorite"
          :is="card.favorite
            ? FilledStarIcon : OutlinedStarIcon"
        />
      </div>
    </div>
  </ion-item>
</template>

<style scoped>
.card-item {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: stretch;

  .card-pitch {
    height: 5px;
  }

  .card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    background-color: #f3e9db;
    padding: 4px 16px 8px 16px;

    .card-name {
      color: black;
    }

    .card-favorite {
      color: #b51823;
    }
  }
}
</style>
