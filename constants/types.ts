export enum PokemonType {
  Normal = 'normal',
  Fire = 'fire',
  Water = 'water',
  Grass = 'grass',
  Electric = 'electric',
  Ice = 'ice',
  Fighting = 'fighting',
  Poison = 'poison',
  Ground = 'ground',
  Flying = 'flying',
  Psychic = 'psychic',
  Bug = 'bug',
  Rock = 'rock',
  Ghost = 'ghost',
  Dragon = 'dragon',
  Fairy = 'fairy',
}

export type Pokemon = {
  id: number;
  name: string;
  types: PokemonType[];
};

export const TOTAL_POKEMON = 151;
