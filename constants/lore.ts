export const POKEDEX_LORE: Record<number, string> = {
  1: 'Une graine pousse depuis sa naissance sur son dos. Elle grossit avec lui.',
  4: 'La flamme au bout de sa queue indique son humeur. Elle s avive quand il est en colere.',
  7: 'Apres sa naissance, sa carapace s endurcit au contact de l air.',
  25: 'Quand plusieurs Pikachu se reunissent, leur electricite peut declencher des orages.',
  39: 'Sa voix douce endort meme les insomniaques les plus tenaces.',
  94: 'Apparait dans les endroits sombres. On dit qu il aspire la chaleur des vivants.',
  130: 'Lorsqu il apparait, sa colere arrase des villages entiers.',
  133: 'Sa structure genetique instable lui permet de se transformer en n importe quoi.',
  143: 'Mange, dort, mange, dort. C est tout ce que fait Ronflex de ses journees.',
  144: 'On dit que son apparition annonce les premieres neiges de l hiver.',
  145: 'Vit dans les nuages d orage. Ses ailes brillent quand il vole.',
  146: 'Ses plumes sont d un rouge incandescent. Il vit dans les volcans.',
  149: 'On raconte que ce Pokemon vit quelque part dans la mer et nage vers ses semblables.',
  150: 'Cree par manipulation genetique. Son coeur reste pourtant vide.',
  151: 'Si rare qu il passe pour une illusion. Seuls quelques chercheurs disent l avoir vu.',
};

export const defaultLore = (name: string) =>
  `Observe en silence, ${name} attend que vous decouvriez son histoire.`;
