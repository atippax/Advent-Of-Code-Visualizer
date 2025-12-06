<script setup lang="ts">
const renderArray = computed(() => {
  // สร้างเป็น Array ของ Array: [[cell1, cell2, ...], [cell1, cell2, ...], ...]
  return stateRender.value;
});
const stateRender = ref<string[][]>([]);
const result = ref();
const { data } = await useFetch("/api/readfile/2025/4");
const input = ref("");
const state = computed(() => {
  return createToArray(input.value);
});
watch(
  () => input.value,
  () => (stateRender.value = state.value)
);
onMounted(async () => {
  input.value = data.value;
  stateRender.value = state.value;
  // result.value= await tryToRemoveUntilNotSomethingChange(state.value)
});
// function* solveGenerator(initialState: string[][]): Generator<string[][]> {
//   let currentState = initialState;
//   // วนลูปการคำนวณ
//   while (true) {
//     // คำนวณ newState จาก currentState
//     const newState = computedNewState(currentState);

//     // Yield State ก่อนที่จะเช็คว่าเท่าเดิมหรือไม่ เพื่อให้ UI เห็น State นี้
//     yield newState;

//     // Check การหยุด
//     if (isEqualState(newState, currentState)) {
//       return;
//     }
//     currentState = newState;
//   }
// }
function clean(texts: string[]) {
  return texts.map((x) => x.trim()).filter((x) => x != "");
}
function breakline(text: string) {
  if (text.includes("\n")) return text.split("\n");
  if (text.includes(" ")) return text.split(" ");
  return [];
}
function createToArray(text: string): string[][] {
  return clean(breakline(text)).reduce((arr: string[][], x: string) => {
    return [
      ...arr,
      x.split("").reduce((_s, v) => {
        return [..._s, v];
      }, [] as string[]),
    ];
  }, [] as string[][]);
}
function filterOutboundPosition(
  position: { x: number; y: number }[],
  state: string[][]
) {
  return position.filter(
    ({ x, y }) =>
      (x >= 0 && y >= 0) ||
      (y < state.length && state[y] && x < state[y].length)
  );
}
function adjustcencyTemplate(position: [number, number]) {
  return [
    { x: position[0] - 1, y: position[1] },
    { x: position[0] + 1, y: position[1] },
    { x: position[0] - 1, y: position[1] - 1 },
    { x: position[0], y: position[1] - 1 },
    { x: position[0] + 1, y: position[1] - 1 },
    { x: position[0] - 1, y: position[1] + 1 },
    { x: position[0], y: position[1] + 1 },
    { x: position[0] + 1, y: position[1] + 1 },
  ];
}
function isPaper(state: string[][], position: [number, number]) {
  if (state[position[1]] == undefined) return false;
  const row = state[position[1]] ?? undefined;
  if (row == undefined || !row[position[0]] == undefined) {
    return false;
  }
  if (row[position[0]] == undefined) return false;
  const item = row[position[0]];
  if (item == "@") return true;
  return false;
}
function getCountPaperAtThisAdjectcy(
  state: string[][],
  position: [number, number]
) {
  const tiles = filterOutboundPosition(adjustcencyTemplate(position), state);
  return tiles.reduce((sum, { x, y }) => {
    if (isPaper(state, [x, y])) return 1 + sum;
    return sum;
  }, 0);
}

// function
function readRemove(state: string[][]) {
  return state.reduce((acc, x) => {
    return x.reduce((_acc, y) => (y == "x" ? _acc + 1 : _acc), acc);
  }, 0);
}
function clearSymbol(state: string[][]) {
  return state.reduce((acc, x) => {
    return [
      ...acc,
      x.reduce((_acc, y) => [..._acc, y == "x" ? "." : y], [] as string[]),
    ];
  }, [] as string[][]);
}
interface S {
  indexY: number;
  indexX: number;
  symbol: string;
  count: number;
}
function computedNewState(oldState: string[][]) {
  const newState = oldState
    .reduce((sum, x, indexY) => {
      return [
        ...sum,
        x.reduce((xumY, y, indexX) => {
          const count = getCountPaperAtThisAdjectcy(oldState, [indexX, indexY]);
          return [...xumY, { indexY, indexX, symbol: y, count }];
        }, [] as S[]),
      ];
    }, [] as S[][])
    .map((y) =>
      y.map((x) => (x.count < 4 && x.symbol == "@" ? "x" : x.symbol))
    );
  return newState;
}
async function tryToRemoveUntilNotSomethingChange(
  oldState: string[][]
): Promise<number> {
  const newState = computedNewState(oldState);

  const stateReadyToUse = clearSymbol(newState);
  //   stateRender.value = [...newState]
  //   console.log(readRemove(newState));
  //   console.table(newState);
  //   console.table(oldState);
  const isEqual = isEqualState(stateReadyToUse, oldState);
  console.log("eq", isEqual);
  const s = await new Promise((x, t) => {
    setTimeout(() => {
      x("s");
    }, 200);
  });
  if (!isEqualState(stateReadyToUse, oldState)) {
    return (
      readRemove(newState) +
      (await tryToRemoveUntilNotSomethingChange(stateReadyToUse))
    );
  }
  return readRemove(newState);
  //   console.log(newState);
  //   console.log();
}
// function* = Generator Function
function* tryToRemoveGenerator(
  initialState: string[][]
): Generator<string[][]> {
  let oldState = initialState;

  while (true) {
    // 1. คำนวณ State ถัดไป (เหมือนที่คุณทำ)
    const newStateData = oldState.reduce((sum, x, indexY) => {
      return [
        ...sum,
        x.reduce((xumY, y, indexX) => {
          const count = getCountPaperAtThisAdjectcy(oldState, [indexX, indexY]);
          return [...xumY, { indexY, indexX, symbol: y, count }];
        }, [] as S[]),
      ];
    }, [] as S[][]);

    // 2. แปลงให้เป็น Array 2 มิติ (แทน 'x' ด้วย '.')
    const newState = newStateData.map((y) =>
      y.map((x) => (x.count < 4 && x.symbol == "@" ? "x" : x.symbol))
    );

    const stateReadyToUse = clearSymbol(newState); // ได้ State สำหรับรอบถัดไป (ไม่มี 'x')

    // 3. ส่งออก (yield) State ที่มี 'x' เพื่อให้ UI แสดงการเปลี่ยนแปลง
    // (เราจะแสดง 'x' ชั่วคราว ก่อนที่จะ Clear เป็น '.')
    yield newState;

    // 4. เช็คเงื่อนไขหยุด: ถ้า State สำหรับรอบถัดไปเท่ากับ State ปัจจุบัน
    if (isEqualState(stateReadyToUse, oldState)) {
      // ต้อง Yield รอบสุดท้าย (State ที่ Clear 'x' แล้ว) ก่อนจบ
      yield stateReadyToUse;
      return;
    }

    // 5. เตรียม State สำหรับ Iteration ถัดไป
    oldState = stateReadyToUse;
  }
}

// ใน <script setup>

// function สำหรับหน่วงเวลา
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Consumer Function
async function startSolve() {
  result.value = "deleting . . .";
  let removedCount = 0;

  // 1. สร้าง Generator Instance
  const solver = tryToRemoveGenerator(state.value);

  // 2. เริ่มดึง State แรก
  let nextState = solver.next();

  // 3. Loop ตราบใดที่ Generator ยังไม่เสร็จ
  while (!nextState.done) {
    const currentState = nextState.value;

    // อัปเดต State สำหรับ UI
    stateRender.value = currentState;

    // คำนวณจำนวนที่ถูกลบไปใน State ปัจจุบัน (ตัว 'x')
    removedCount += readRemove(currentState);

    // 4. ***หน่วงเวลา*** 🕒
    await delay(300); // 300 มิลลิวินาที

    // 5. ดึง State ถัดไป
    nextState = solver.next();
    result.value = removedCount;
  }

  // 6. อัปเดตผลลัพธ์สุดท้าย
  // result.value = removedCount;
  // console.log("Final Removed Count:", removedCount);
}
function compareRow(rowNew: string[], rowOld: string[]) {
  if (rowNew.length == 0 && rowOld.length == 0) return true;
  const [cellNew, ...otherCellNew] = rowNew;
  const [cellOld, ...otherCellOld] = rowOld;
  if (cellNew != cellOld) return false;
  return compareRow(otherCellNew, otherCellOld);
}
function isEqualState(newState: string[][], oldState: string[][]) {
  if (newState.length == 0 && oldState.length == 0) return true;
  const [rowNew, ...otherRowNew] = newState;
  const [rowOld, ...otherRowOld] = oldState;
  if (!compareRow(rowNew!, rowOld!)) return false;
  return isEqualState(otherRowNew, otherRowOld);
}
</script>

<template>
  <div class="flex justify-center h-full bg-slate-900 p-4 flex-col">
    <div>
      <u-input v-model="input"></u-input>
      <u-button @click="startSolve">start solve</u-button>
    </div>
    <div>
      {{ !result ? "deleteing . . ." : result }}
    </div>

    <div class="flex justify-center">
      <div class="grid">
        <div
          v-for="(row, rowIndex) in renderArray"
          :key="rowIndex"
          class="flex items-center"
        >
          <div
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            :class="`bg-slate-700 border border-white w-[13px] h-[13px] text-[8px]`"
          >
            <div class="flex items-center justify-center">
              {{ cell }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
