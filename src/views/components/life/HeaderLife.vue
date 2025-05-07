<script setup lang="ts">
import Timer from "@/views/components/TimerComponent.vue";

import useLifeStore from "@/stores/life";
import useTimerStore from "@/stores/timer";

const lifeStore = useLifeStore();
const timerStore = useTimerStore();
</script>

<template>
<div v-if="lifeStore.isInitialized && timerStore.isInitialized"
  class="simple-life"
>
  <div class="health"
    :style="{
      backgroundColor: lifeStore.getColor(0)
    }"
  >
    {{ lifeStore.getLife(0) }}
  </div>

  <timer />

  <div class="health"
    :style="{
      backgroundColor: lifeStore.getColor(1)
    }"
  >
    {{ lifeStore.getLife(1) }}
  </div>
</div>
</template>

<style scoped>
.simple-life {
  display: flex;
  column-gap: 8px;

  .health {
    padding: 8px 16px;
    border-radius: 0.5rem;
    font-weight: 500;
  }
}
</style>

