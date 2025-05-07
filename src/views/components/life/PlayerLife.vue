<script setup lang="ts">
import { defineProps, computed, ref } from "vue";

import useLifeStore from "@/stores/life";

const useHealth = () => {
  const health = ref<number>(startingHealth);
  const change = ref<number>(0);
  let timeout: number | null = null;

  function resetChange() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      change.value = 0;
    }, 1500);
  }

  return {
    health, change: computed(() => {
      return change.value > 0
        ? `+${change.value}`
        : change.value;
    }),

    decrementHealth() {
      --health.value;
      lifeStore.setLife(lifeId, health.value);

      --change.value;
      resetChange();
    },

    incrementHealth() {
      ++health.value;
      lifeStore.setLife(lifeId, health.value);

      ++change.value;
      resetChange();
    },
  };
};

const {
  lifeId,
  startingHealth,
  color,
} = defineProps<{
  lifeId: number;
  startingHealth: number;
  color?: string;
  height?: string;
  width?: string;
}>();

const lifeStore = useLifeStore();
const {
  health, change,
  decrementHealth,
  incrementHealth,
} = useHealth();

</script>

<template>
<div class="player-life-container"
  :style="{
    height,
    width,
  }"
>
  <div class="player-life" :style="{
    backgroundColor: color,
  }">
    <button class="heal-button"
      @click="incrementHealth"
    >
      <div class="button-text">+</div>
    </button>

    <div class="health">
      <div v-if="change" class="change-container">
        <div class="change-text">
          {{ change }}
        </div>
      </div>
      <div class="health-text">
        {{ health }}
      </div>
    </div>

    <button class="damage-button"
      @click="decrementHealth"
    >
      <div class="button-text">-</div>
    </button>
  </div>
</div>
</template>

<style scoped>
.player-life-container {
  padding: 8px;

  .player-life {
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    border-radius: 1rem;

    padding: 16px;

    .heal-button,
    .damage-button {
      flex: 1;
      background: none;
    }

    .health {
      flex-direction: column-reverse;
      margin: auto;
      position: relative;

      .change-container {
        position: absolute;
        top: -40%;
        right: 50%;
        transform: translateX(50%);

        .change-text {
          rotate: -90deg;
          font-size: 56px;
          font-weight: 500;
          white-space: nowrap;
          text-align: center;
        }
      }
    }

    .health-text,
    .button-text {
      rotate: -90deg;

      font-size: 128px;
      font-weight: 700;
      white-space: nowrap;
      text-align: center;
    }
  }
}
</style>

