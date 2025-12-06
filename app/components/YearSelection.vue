<template>
  <div
    class="bg-[#051330] relative w-32 h-32 md:w-40 md:h-40 p-4 flex flex-col items-center justify-center rounded-full border-8 border-[#FFD700] shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
    @click="handleClick"
  >
    <h3 class="text-4xl font-black">
      {{ year }}
    </h3>

    <div
      class="absolute inset-0 bg-slate-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300"
    >
      <span
        @click="handleClick"
        class="text-white text-center font-semibold text-lg"
      >
        View Visualization
      </span>
    </div>
    <div class="absolute top-40 bg-black w-30 rounded-4xl h-10"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  year: {
    type: [String, Number],
    required: true,
  },
});

const emit = defineEmits(["yearClick"]);

const handleClick = () => {
  emit("yearClick", props.year);
};
</script>
