<script setup lang="ts">
const data =  ref('')
const renderArray = computed(() => {
  // สร้างเป็น Array ของ Array: [[cell1, cell2, ...], [cell1, cell2, ...], ...]
  return stateRender.value});
const state = ref<string[][]>([])
const stateRender = ref<string[][]>([])
const result = ref()
onMounted(async()=>{
  data.value = (await(await fetch('/inputExample/2025/day4.txt')).text())
//   data.value = `..@@.@@@@.
// @@@.@.@.@@
// @@@@@.@.@@
// @.@@@@..@.
// @@.@@@@.@@
// .@@@@@@@.@
// .@.@.@.@@@
// @.@@@.@@@@
// .@@@@@@@@.
// @.@.@@@.@.`
  state.value = (createToArray(data.value))
stateRender.value = state.value
// result.value= await tryToRemoveUntilNotSomethingChange(state.value)

})
function createToArray(text:string):string[][] {
  return text.split("\n").reduce((arr:string[][], x:string) => {
    return [
      ...arr,
      x.split("").reduce((_s, v) => {
        return [..._s, v];
      }, [] as string[]),
    ];
  }, [] as string[][]);
}
function filterOutboundPosition(position:{x:number,y:number}[], state:string[][]) {
  return position.filter(
    ({ x, y }) =>
       (x >= 0 && y >= 0) || (y < state.length && state[y] &&x < (state[y].length))
  );
}
function adjustcencyTemplate(position:[number,number]) {
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
function isPaper(state:string[][], position:[number,number]) {
  if (state[position[1]] == undefined) return false;
  const row = state[position[1]] ?? undefined;
  if (row  == undefined|| !row[position[0]]==undefined) {
    return false;
  }
  if(row[position[0]] == undefined) return false;
  const item = row[position[0]];
  if (item == "@") return true;
  return false;
}
function getCountPaperAtThisAdjectcy(state:string[][], position:[number,number]) {
  const tiles = filterOutboundPosition(adjustcencyTemplate(position), state);
  return tiles.reduce((sum, { x, y }) => {
    if (isPaper(state, [x, y])) return 1 + sum;
    return sum;
  }, 0);
}


// function
function readRemove(state:string[][]) {
  return state.reduce((acc, x) => {
    return x.reduce((_acc, y) => (y == "x" ? _acc + 1 : _acc), acc);
  }, 0);
}
function clearSymbol(state:string[][]) {
  return state.reduce((acc, x) => {
    return [...acc, x.reduce((_acc, y) => [..._acc, y == "x" ? "." : y], [] as string[])];
  }, [] as string[][]);
}
interface S { indexY:number, indexX:number, symbol: string, count:number }
async function tryToRemoveUntilNotSomethingChange(oldState:string[][]):Promise<number> {
 
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
  // state.value = [...newState]
console.log(oldState
    .reduce((sum, x, indexY) => {
      return [
        ...sum,
        x.reduce((xumY, y, indexX) => {
          const count = getCountPaperAtThisAdjectcy(oldState, [indexX, indexY]);
          return [...xumY, { indexY, indexX, symbol: y, count }];
        }, [] as S[]),
      ];
    }, [] as S[][]) )
    console.log('jkjkj')

  const stateReadyToUse = clearSymbol(newState);
  stateRender.value = [...newState]
  //   console.log(readRemove(newState));
  //   console.table(newState);
  //   console.table(oldState);
  const isEqual = isEqualState(stateReadyToUse, oldState);
  console.log("eq", isEqual);
  const  s = await new Promise((x,t)=>{
    setTimeout(() => {
      x('s')
    }, 200);
  })
  if (!isEqualState(stateReadyToUse, oldState)) {
    return (
      readRemove(newState) + await tryToRemoveUntilNotSomethingChange(stateReadyToUse)
    );
  }
  return readRemove(newState);
  //   console.log(newState);
  //   console.log();
}
function compareRow(rowNew:string[], rowOld:string[]) {
  if (rowNew.length == 0 && rowOld.length == 0) return true;
  const [cellNew, ...otherCellNew] = rowNew;
  const [cellOld, ...otherCellOld] = rowOld;
  if (cellNew != cellOld) return false;
  return compareRow(otherCellNew, otherCellOld);
}
function isEqualState(newState:string[][], oldState:string[][]) {
  if (newState.length == 0 && oldState.length == 0) return true;
  const [rowNew, ...otherRowNew] = newState;
  const [rowOld, ...otherRowOld] = oldState;
  if (!compareRow(rowNew!, rowOld!)) return false;
  return isEqualState(otherRowNew, otherRowOld);
}
</script>

<template>
  <button @click="(async()=>result = await tryToRemoveUntilNotSomethingChange(state))()">start solve</button>
  {{ !result ?'deleteing . . .':result }}
 <div class="grid-container">
    <div v-for="(row, rowIndex) in renderArray" :key="rowIndex" class="grid-row">
      <div v-for="(cell, colIndex) in row" :key="colIndex" class="grid-cell">
        {{ cell }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  /* กำหนดขนาดหลักของตาราง */
  display: grid; 
  gap: 1px; /* ช่องว่างระหว่างแถว */
  border: 1px solid #eee;
}

.grid-row {
  /* ทำให้แต่ละแถวเป็น Grid/Flex ภายใน */
  display: flex; /* หรือ display: grid; ถ้าต้องการกำหนดคอลัมน์ตายตัว */
}

.grid-cell {
  /* กำหนดความกว้างและความสูงคงที่ (Fix-size) */
  width: 10px; 
  height: 10px; 

  /* จัดให้อยู่ตรงกลางเซลล์ */
  display: flex; 
  justify-content: center; 
  align-items: center; 

  border: 1px solid #ddd;
  font-family: 'Monaco', monospace; /* ยังคงแนะนำให้ใช้ Monospace */
  font-weight: bold;
}</style>
