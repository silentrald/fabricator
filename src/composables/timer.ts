import logger from "@/modules/logger";
import system from "@/modules/system";
import { computed } from "vue";

import useTimerStore from "@/stores/timer";

import PlayIcon from "@/views/icons/fill/PlayIcon.vue";
import PauseIcon from "@/views/icons/fill/PauseIcon.vue";

const store = useTimerStore();

export default function useTimer() {
  const text = computed(() =>
    `${
      store.minutes
        .toString()
        .padStart(2, "0")
    }:${
      store.seconds
        .toString()
        .padStart(2, "0")
    }`
  );

  async function resumeImpl() {
    if (store.isRunning) {
      return;
    }

    store.start({
      async onStop() {
        await system.vibrate();
      },
    });
    const result = await system.keepAwake();
    if (result.hasError()) {
      logger.error("keepAwake error", result.getError());
    }
  }

  async function pauseImpl() {
    if (!store.isRunning) {
      return;
    }

    store.stop();
    const result = await system.allowSleep();
    if (result.hasError()) {
      logger.error("keepAwake error", result.getError());
    }
  }

  return {
    // Getters
    minutes: store.minutes,
    seconds: store.seconds,
    isRunning: store.isRunning,
    initialized: computed(() => store.isRunning !== undefined),

    text,

    getIcon() {
      return store.isRunning ? PauseIcon : PlayIcon;
    },

    getAlternate() {
      // TODO: Resource text
      return store.isRunning ? "Pause" : "Play";
    },

    // Mutations
    async init() {
      store.init({
        minutes: 50,
        seconds: 0,
      });

      const result = await system.keepAwake();
      if (result.hasError()) {
        logger.error("keepAwake error", result.getError());
      }
    },

    async destroy() {
      store.reset();

      const result = await system.allowSleep();
      if (result.hasError()) {
        logger.error("keepAwake error", result.getError());
      }
    },

    async setTimer(time: {
      minutes: number;
      seconds: number;
    }) {
      store.minutes = time.minutes;
      store.seconds = time.seconds;
    },

    async resume() {
      if (store.isRunning) {
        return;
      }

      await resumeImpl();
    },

    async pause() {
      if (!store.isRunning) {
        return;
      }

      await pauseImpl();
    },

    async toggle() {
      store.isRunning
        ? pauseImpl()
        : resumeImpl();
    },
  };
}
