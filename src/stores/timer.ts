import { computed, ref } from "vue";
import { defineStore } from "pinia";

interface TimerEvents {
  onUpdate?: () => void;
  onStop?: () => void;
}

const useTimerStore = defineStore("timer", () => {
  const _minutes = ref<number>(0);
  const _seconds = ref<number>(0);
  const _running = ref<boolean | undefined>(undefined);
  const _timeoutId = ref<number | undefined>(undefined);

  // Precision Calculation
  const now = ref<number>(0);
  const milliseconds = ref<number>(0);

  function tick() {
    if (_seconds.value > 0) {
      --_seconds.value;
      return true;
    }

    if (_minutes.value > 0) {
      --_minutes.value;
      _seconds.value = 59;
      return true;
    }

    return false;
  }

  function loop(events: TimerEvents) {
    const difference = Math.max(0, 1000 - milliseconds.value);
    if (difference === 0) {
      update(events);
      return;
    }

    _timeoutId.value = setTimeout(() => {
      update(events);
    }, difference);
  }

  function update(events: TimerEvents) {
    if (!tick()) {
      events.onStop?.();
      return;
    }

    milliseconds.value = 0;
    now.value = Date.now();

    loop(events);
    events.onUpdate?.();
  }

  return {
    init({ minutes, seconds }: {
      minutes: number;
      seconds: number;
    }) {
      _minutes.value = minutes;
      _seconds.value = seconds;
      _running.value = false;

      milliseconds.value = 0;
    },

    // Reactive
    minutes: _minutes,
    seconds: _seconds,
    isRunning: computed(() => _running.value),
    isInitialized: computed(() => _running.value !== undefined),

    // Timeout Id
    getTimeoutId: computed(() => _timeoutId.value),

    // Mutations
    tick,

    start(events: TimerEvents) {
      loop(events);
      _running.value = true;
    },

    stop() {
      clearTimeout(_timeoutId.value);
      _timeoutId.value = undefined;
      _running.value = false;

      milliseconds.value += Date.now() - now.value;
    },

    reset() {
      _minutes.value = 0;
      _seconds.value = 0;
      _running.value = undefined;

      milliseconds.value = 0;

      if (_timeoutId.value) {
        clearTimeout(_timeoutId.value);
        _timeoutId.value = undefined;
      }
    },
  };
});

export default useTimerStore;

