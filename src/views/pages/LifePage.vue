<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonPopover,
} from "@ionic/vue";
import PlayerLife from "@/views/components/life/PlayerLife.vue";
import ArrowLeftFromBracketIcon from "@/views/icons/ArrowLeftFromBracketIcon.vue";
import BarsIcon from "@/views/icons/BarsIcon.vue";
import CardsBlankIcon from "@/views/icons/fill/CardsBlankIcon.vue";
// import GearIcon from "@/views/icons/fill/GearIcon.vue";
import ArrowRotateRightIcon from "@/views/icons/ArrowRotateRightIcon.vue";

import system from "@/modules/system";

import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import useTimer from "@/composables/timer";
import useLifeStore from "@/stores/life";

const router = useRouter();
const timer = useTimer();
const lifeStore = useLifeStore();

const showOptions = ref<boolean>(false);

onMounted(async () => {
  await system.overlayStatusBar(true);
  await timer.init();
  lifeStore.init(
    [ 40, 40 ],
    [ "#cc0000", "#008000" ]
  );
});

onUnmounted(async () => {
  await system.overlayStatusBar(false);
  await timer.destroy();
});

function onOptionsButtonClicked() {
  showOptions.value = true;
}

function onBackButtonClicked() {
  showOptions.value = false;
  router.go(-1);
}

function onCardsButtonClicked() {
  showOptions.value = false;
  router.push("/search");
}

// function onSettingsButtonClicked() {
//   showOptions.value = false;
//   console.debug("TODO");
// }

async function onResetButtonClicked() {
  lifeStore.setLife(0, 40);
  lifeStore.setLife(1, 40);

  await timer.pause();
  timer.setTimer({
    minutes: 50,
    seconds: 0,
  });
  showOptions.value = false;
}
</script>

<template>
<ion-page>
  <ion-content :fullscreen="true">
    <player-life class="player-life-container"
      :life-id="1"
      :starting-health="40"
      color="#008000"
      height="40%"
    />

    <div class="main-divider"
      :style="{
        height: '20%'
      }"
    >
      <div class="flex-1">
        <button id="popover-button" @click="onOptionsButtonClicked">
          <bars-icon id="popover-icon" />
        </button>
        <ion-popover
          trigger="popover-button"
          :is-open="showOptions"
          side="left"
          alignment="center"
        >
          <div id="option-container">
            <button class="option-button" @click="onBackButtonClicked">
              <arrow-left-from-bracket-icon class="option-icon" />
            </button>
            <button class="option-button" @click="onCardsButtonClicked">
              <cards-blank-icon class="option-icon" />
            </button>
            <!--
            <button class="option-button" @click="onSettingsButtonClicked">
              <gear-icon class="option-icon" />
            </button>
            -->
            <button class="option-button" @click="onResetButtonClicked">
              <arrow-rotate-right-icon class="option-icon" />
            </button>
          </div>
        </ion-popover>
      </div>

      <div id="timer-text-container" class="flex-1">
        <div id="timer-text">
          {{ timer.text }}
        </div>
      </div>

      <button
        class="flex-1 timer-button"
        @click="timer.toggle"
      >
        <component :is="timer.getIcon()" id="timer-icon"/>
      </button>
    </div>

    <player-life class="player-life-container"
      :life-id="0"
      :starting-health="40"
      color="#cc0000"
      height="40%"
    />
  </ion-content>
</ion-page>
</template>

<style scoped>
.main-divider {
  display: flex;
}

.flex-1 {
  flex: 1;
}

#popover-button {
  width: 100%;
  height: 100%;
  background: none;

  #popover-icon {
    font-size: 64px;
    rotate: -90deg;
  }
}

#option-container {
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
  width: 48px;

  .option-button {
    width: fit-content;
    padding: 8px;

    .option-icon {
      font-size: 32px;
      rotate: -90deg;
    }
  }
}

#timer-text-container {
  display: flex;
  justify-content: center;
  align-items: center;

  #timer-text {
    font-size: 48px;
    font-weight: 500;
    rotate: -90deg;
  }
}

.timer-button {
  background: none;

  #timer-icon {
    color: #ffffff;
    rotate: -90deg;
    font-size: 48px;
  }
}
</style>

<style>
ion-popover {
  --width: 48px;
}
</style>

