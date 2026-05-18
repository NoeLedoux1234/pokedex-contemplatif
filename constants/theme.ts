import { PokemonType } from './types';

export const Colors = {
  paper: '#F5EFE0',
  paperDark: '#E9E0CB',
  ink: '#1B1B1F',
  inkSoft: '#3A3A40',
  pokeball: '#C44545',
  pokeballDark: '#8B2E2E',
  gold: '#D4A93D',
  silhouette: '#1F1F23',
  cardBack: '#2B3A67',
  shadow: 'rgba(0, 0, 0, 0.18)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  flash: '#FFFFFF',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 6,
  md: 12,
  lg: 18,
  pill: 999,
} as const;

export const FontSize = {
  caption: 11,
  body: 14,
  title: 18,
  heading: 22,
  display: 32,
} as const;

export const TypeColors: Record<PokemonType, string> = {
  [PokemonType.Normal]: '#A8A77A',
  [PokemonType.Fire]: '#EE8130',
  [PokemonType.Water]: '#6390F0',
  [PokemonType.Grass]: '#7AC74C',
  [PokemonType.Electric]: '#F7D02C',
  [PokemonType.Ice]: '#96D9D6',
  [PokemonType.Fighting]: '#C22E28',
  [PokemonType.Poison]: '#A33EA1',
  [PokemonType.Ground]: '#E2BF65',
  [PokemonType.Flying]: '#A98FF3',
  [PokemonType.Psychic]: '#F95587',
  [PokemonType.Bug]: '#A6B91A',
  [PokemonType.Rock]: '#B6A136',
  [PokemonType.Ghost]: '#735797',
  [PokemonType.Dragon]: '#6F35FC',
  [PokemonType.Fairy]: '#D685AD',
};

export const TypeLabels: Record<PokemonType, string> = {
  [PokemonType.Normal]: 'Normal',
  [PokemonType.Fire]: 'Feu',
  [PokemonType.Water]: 'Eau',
  [PokemonType.Grass]: 'Plante',
  [PokemonType.Electric]: 'Electrik',
  [PokemonType.Ice]: 'Glace',
  [PokemonType.Fighting]: 'Combat',
  [PokemonType.Poison]: 'Poison',
  [PokemonType.Ground]: 'Sol',
  [PokemonType.Flying]: 'Vol',
  [PokemonType.Psychic]: 'Psy',
  [PokemonType.Bug]: 'Insecte',
  [PokemonType.Rock]: 'Roche',
  [PokemonType.Ghost]: 'Spectre',
  [PokemonType.Dragon]: 'Dragon',
  [PokemonType.Fairy]: 'Fee',
};

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

export const spriteUrl = (id: number) => `${SPRITE_BASE}/${id}.png`;
export const officialArtUrl = (id: number) =>
  `${SPRITE_BASE}/other/official-artwork/${id}.png`;
