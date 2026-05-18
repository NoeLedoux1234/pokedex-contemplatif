import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOTAL_POKEMON } from '@/constants/types';

const STORAGE_KEY = '@pokedex:caught';

type CollectionContextValue = {
  caught: number[];
  ready: boolean;
  has: (id: number) => boolean;
  add: (id: number) => Promise<void>;
  addMany: (ids: number[]) => Promise<void>;
  reset: () => Promise<void>;
  total: number;
};

const parseStored = (raw: string | null): number[] => {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is number => typeof v === 'number');
  } catch {
    return [];
  }
};

const CollectionContext = createContext<CollectionContextValue | null>(null);

export const CollectionProvider = ({ children }: { children: ReactNode }) => {
  const [caught, setCaught] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (cancelled) return;
      setCaught(parseStored(raw));
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next: number[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const add = useCallback(
    async (id: number) => {
      let nextSnapshot: number[] = [];
      setCaught((prev) => {
        if (prev.includes(id)) {
          nextSnapshot = prev;
          return prev;
        }
        nextSnapshot = [...prev, id].sort((a, b) => a - b);
        return nextSnapshot;
      });
      await persist(nextSnapshot);
    },
    [persist],
  );

  const addMany = useCallback(
    async (ids: number[]) => {
      let nextSnapshot: number[] = [];
      let changed = false;
      setCaught((prev) => {
        const merged = new Set([...prev, ...ids]);
        const next = Array.from(merged).sort((a, b) => a - b);
        changed = next.length !== prev.length;
        nextSnapshot = next;
        return changed ? next : prev;
      });
      if (changed) await persist(nextSnapshot);
    },
    [persist],
  );

  const reset = useCallback(async () => {
    setCaught([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<CollectionContextValue>(
    () => ({
      caught,
      ready,
      has: (id: number) => caught.includes(id),
      add,
      addMany,
      reset,
      total: TOTAL_POKEMON,
    }),
    [caught, ready, add, addMany, reset],
  );

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>;
};

export const useCollection = (): CollectionContextValue => {
  const ctx = useContext(CollectionContext);
  if (!ctx) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return ctx;
};
