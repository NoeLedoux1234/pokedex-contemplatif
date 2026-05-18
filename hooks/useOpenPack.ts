import { useCallback } from 'react';
import { POKEMON_GEN_1, RARE_IDS } from '@/constants/pokemon';

const PACK_SIZE = 3;

const weighted = (caught: Set<number>): number[] => {
  const pool: number[] = [];
  for (const p of POKEMON_GEN_1) {
    const isRare = RARE_IDS.has(p.id);
    const alreadyCaught = caught.has(p.id);
    const weight = alreadyCaught ? 1 : isRare ? 2 : 4;
    for (let i = 0; i < weight; i++) pool.push(p.id);
  }
  return pool;
};

export const useOpenPack = () => {
  return useCallback((caughtIds: number[]): number[] => {
    const caughtSet = new Set(caughtIds);
    const pool = weighted(caughtSet);
    const drawn = new Set<number>();
    while (drawn.size < PACK_SIZE) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      drawn.add(pick);
      if (drawn.size === POKEMON_GEN_1.length) break;
    }
    return Array.from(drawn);
  }, []);
};
