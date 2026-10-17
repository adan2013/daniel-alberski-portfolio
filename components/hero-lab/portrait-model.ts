import { ease, interval } from "./model";

export const PORTRAIT_SIZE = 400;
export const TILE_SIZE = PORTRAIT_SIZE / 5;

// Each pair shares a row or column. Reversing this sequence creates the shuffle.
// The last two swaps form a three-tile cycle so all 25 tiles start displaced.
const slotPairs = [
  [0, 4],
  [6, 21],
  [1, 2],
  [3, 18],
  [15, 19],
  [7, 22],
  [10, 5],
  [20, 23],
  [9, 24],
  [8, 13],
  [11, 16],
  [12, 14],
  [12, 17],
] as const;
const initialSlots = Array.from({ length: 25 }, (_, i) => i);
for (const [a, b] of [...slotPairs].reverse()) {
  [initialSlots[a], initialSlots[b]] = [initialSlots[b], initialSlots[a]];
}

const slots = [...initialSlots];
const batchCount = Math.ceil(slotPairs.length / 2);
export const portraitSwaps = slotPairs.map(([a, b], index) => {
  // Consecutive pairs are disjoint; the final dependent swap gets its own batch.
  const batch = Math.floor(index / 2);
  const swap = {
    a: slots[a],
    b: slots[b],
    from: a,
    to: b,
    start: 0.06 + (batch / batchCount) * 0.82,
    end: 0.06 + ((batch + 0.86) / batchCount) * 0.82,
  };
  [slots[a], slots[b]] = [slots[b], slots[a]];
  return swap;
});

export const portraitTiles = Array.from({ length: 25 }, (_, index) => {
  const row = Math.floor(index / 5);
  const col = index % 5;
  const start = initialSlots.indexOf(index);
  return {
    index,
    row,
    col,
    startRow: Math.floor(start / 5),
    startCol: start % 5,
    color: (index * 3 + row) % 5,
    bandY: 9 + ((index * 13) % 47),
    bandHeight: 5 + (index % 3) * 4,
  };
});

export function portraitPose(p: number, tile: (typeof portraitTiles)[number]) {
  let row = tile.startRow;
  let col = tile.startCol;
  let swapping = false;
  for (const swap of portraitSwaps) {
    if (p <= swap.start || (tile.index !== swap.a && tile.index !== swap.b))
      continue;
    const from = tile.index === swap.a ? swap.from : swap.to;
    const to = tile.index === swap.a ? swap.to : swap.from;
    const t = ease(interval(p, swap.start, swap.end));
    col = (from % 5) + ((to % 5) - (from % 5)) * t;
    row =
      Math.floor(from / 5) + (Math.floor(to / 5) - Math.floor(from / 5)) * t;
    swapping = p < swap.end;
  }
  // Every exchange finishes before the separate, final closing of the gaps.
  const finish = ease(interval(p, 0.94, 1));
  const gap = 8 * (1 - finish);
  const glitch =
    (1 - ease(interval(p, 0.88, 0.98))) *
    (0.65 + 0.35 * Math.pow(Math.sin(p * 31 + tile.index * 1.9), 2));
  return {
    x: 150 + col * TILE_SIZE + (col - 2) * gap,
    y: 50 + row * TILE_SIZE + (row - 2) * gap,
    scale: 0.92 + 0.08 * finish,
    tint: 1 - ease(interval(p, 0.88, 1)),
    glitch,
    shift: glitch * (6 + (tile.index % 4) * 3) * Math.sin(p * 43 + tile.index),
    annotation: 1 - finish,
    swapping,
    settled: !swapping && row === tile.row && col === tile.col,
  };
}

export function tileTransform(pose: ReturnType<typeof portraitPose>) {
  const inset = (TILE_SIZE * (1 - pose.scale)) / 2;
  return `translate(${(pose.x + inset).toFixed(3)} ${(pose.y + inset).toFixed(3)}) scale(${pose.scale.toFixed(5)})`;
}
