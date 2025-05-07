<script setup lang="ts">
import {
  IonModal,
  IonSpinner,
} from "@ionic/vue";

import { defineExpose, defineProps, ref } from "vue";

const { total, current } = defineProps<{
  current?: number;
  total?: number;
}>();

const _loaderDialog = ref();

function show() {
  _loaderDialog.value.$el.present();
}

function hide() {
  _loaderDialog.value.$el.dismiss();
}

defineExpose({
  show,
  hide,
});
</script>

<template>
<ion-modal class="loader-dialog" ref="_loaderDialog">
  <div class="loader-container">
    <div class="loader-status">
      <ion-spinner name="crescent" />
      <div>{{ current }} / {{ total }}</div>
    </div>
    <div class="loader-content">
      <slot />
    </div>
  </div>
</ion-modal>
</template>

<style scoped>
.loader-container {
  padding: 16px;

  .loader-status {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }

  .loader-content {
    margin-top: 16px;
  }
}
</style>

<style>
ion-modal.loader-dialog {
  --width: fit-content;
  --min-width: 250px;
  --height: fit-content;
  --border-radius: 6px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);

  h1 {
    margin: 20px 20px 10px 20px;
  }

  ion-icon {
    margin-right: 6px;

    width: 48px;
    height: 48px;

    padding: 4px 0;

    color: #aaaaaa;
  }

  .wrapper {
    margin-bottom: 10px;
  }
}
</style>

