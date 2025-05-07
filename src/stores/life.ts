import { defineStore } from "pinia";
import { computed, ref } from "vue";

const useLifeStore = defineStore("life", () => {
  const _lives = ref<number[]>([]);
  const _colors = ref<string[]>([]);

  return {
    init(lives: number[], colors: string[]) {
      _lives.value = lives;
      _colors.value = colors;
    },

    destroy() {
      _lives.value = [];
      _colors.value = [];
    },

    isInitialized: computed(() => _lives.value.length > 0),

    setLife(index: number, life: number) {
      if (index < 0 || index >= _lives.value.length) {
        return;
      }

      _lives.value[index] = life;
    },

    setColor(index: number, color: string) {
      if (index < 0 || index >= _colors.value.length) {
        return;
      }

      _colors.value[index] = color;
    },

    getLife(index: number) {
      if (index < 0 || index >= _lives.value.length) {
        return -1;
      }

      return _lives.value[index];
    },

    getColor(index: number) {
      if (index < 0 || index >= _lives.value.length) {
        return "";
      }

      return _colors.value[index];
    },
  };
});

export default useLifeStore;
