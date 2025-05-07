<script setup lang="ts">
const { iconPosition, icon, value } = defineProps<{
  iconPosition?: "left" | "right";
  icon?: string;
  value?: number;
}>();
</script>

<template>
<div v-if="icon && typeof value === 'number'"
  class="card-corner"
  :style="{
    flexDirection: iconPosition === 'left'
      ? 'row' : 'row-reverse',
  }"
>
  <img class="card-corner-icon"
    :src="`/assets/icon/${icon}.webp`"
  />
  <div class="card-corner-text">
    {{ value }}
  </div>
</div>
<div v-else class="card-corner">

</div>
</template>

<style scoped>
.card-corner {
  display: flex;
  align-items: center;
  width: 36px;
  gap: 4px;

  .card-corner-icon {
    width: 24px;
    height: 24px;
  }
}
</style>

