<script setup lang="ts">
import { IonImg } from "@ionic/vue";

import { onMounted, ref, watch } from "vue";

import useGlobal from "@/composables/global";
import useImage from "@/composables/image";

const {
  $services: { filesystem: filesystemService },
} = useGlobal();
const image = useImage({ filesystemService });

const props = defineProps<{
  src?: string;
  alt?: string;
  favorite?: boolean;
}>();

const _src = ref("");

async function onSourceChange(newSrc: string | undefined) {
  _src.value = "";
  if (!newSrc) {
    return;
  }

  const result = props.favorite
    ? await image.getDataUrl(newSrc)
    : await image.getCacheUrl(newSrc);
  if (result.hasError()) {
    // TODO: Some toast here
    return;
  }

  _src.value = result.getValue();
}

onMounted(() => {
  onSourceChange(props.src);
});

watch(() => props.src, (newSrc) => {
  onSourceChange(newSrc);
});
</script>

<template>
<div class="card-image">
  <ion-img v-if="_src" :src="_src" />
  <div v-else>
    <div class="card-alt">{{ props.alt }}</div>
    <ion-img src="/assets/img/card-template.png" />
  </div>
</div>
</template>

<style scoped>
.card-image {
  position: relative;

  .card-alt {
    position: absolute;
    width: 100%;
    text-align: center;

    font-weight: 700;
    color: #000000;
    top: 32px;
  }
}
</style>
