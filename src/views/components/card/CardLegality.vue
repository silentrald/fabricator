<script setup lang="ts">
type Legality = "L" // legal
  | "V" // living legends
  | "S" // suspended
  | "B" // banned
  | "R" // restricted
  | "U" // unknow
  ;

const { type, legality, showList } = defineProps<{
  type: "classic-constructed"
    | "blitz"
    | "ultimate-pit-fight"
    | "commoner"
    | "living-legends";
  legality: Legality;
  showList: Legality[];
}>();

const shouldShow = () => showList.indexOf(legality) > -1;
</script>

<template>
<div v-if="shouldShow()" class="card-legality">
  {{ type }}: {{ legality }}
</div>
</template>

<style scoped>
</style>
