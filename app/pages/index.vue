<template>
  <div
    class="absolute inset-0 bg-[#0b1a37] flex flex-col justify-center items-center text-white font-sans"
  >
    <h1>Welcome to Advent Of Code Visualizer</h1>
    <p>Choose A Year</p>
    <div>
      <YearSelection @yearClick="yearClick" year="2025"></YearSelection>
    </div>
  </div>

  <header
    class="fixed top-8 left-8 right-8 z-50 flex justify-between items-center p-4 rounded-4xl bg-slate-800/70 backdrop-blur-md text-white"
  >
    <div class="flex items-center text-xl font-bold">
      <span class="text-3xl mr-3 text-white">❄️</span>
      AOC Visualizer
    </div>

    <nav class="flex space-x-5 mr-4">
      <a
        href="#"
        class="text-slate-200 hover:text-white transition duration-300"
        >Home</a
      >
      <a
        href="#"
        class="text-slate-200 hover:text-white transition duration-300"
        >About</a
      >
      <a
        href="#"
        class="text-slate-200 hover:text-white transition duration-300"
        >About</a
      >
    </nav>
  </header>
  <SnowEffectComponent> </SnowEffectComponent>
</template>
<script setup lang="ts">
function yearClick(year: string) {
  useRouter().push(`/${year}`);
}
</script>
