<script setup lang="ts">
import useTimer from "@/composables/timer";

const timer = useTimer();
</script>

<template>
<div class="timer-component" v-if="timer.initialized.value">
  <div class="timer-text">
    {{ timer.text }}
  </div>

  <button class="timer-button" @click="timer.toggle()">
    <component class="timer-icon" :is="timer.getIcon()"/>
  </button>
</div>
</template>

<style scoped>
.timer-component {
  display: flex;
  column-gap: 4px;
  align-items: center;
}

.timer-text {
  font-weight: 500;
}

.timer-button {
  color: white;
  background: none;
}
</style>

