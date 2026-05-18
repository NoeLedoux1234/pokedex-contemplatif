# Pokedex Contemplatif

Une petite application mobile React Native + Expo, sur le theme du Pokedex de premiere generation. Pas de combat, pas de score : juste decouvrir doucement les 151 Pokemon en ouvrant des boosters.

Projet realise dans le cadre du cours **React Native & Expo** (4 chapitres : Expo basics, Expo Router, Reanimated, Gesture Handler).

---

## Stack

- **Expo SDK 54** (Managed Workflow)
- **expo-router** — navigation file-based (Stack + Tabs + dynamic routes)
- **react-native-reanimated** — animations sur le UI thread
- **react-native-gesture-handler** — Pan, Pinch, Tap, composition
- **@react-native-async-storage/async-storage** — persistance de la collection
- **expo-haptics**, **expo-linear-gradient**, **@expo/vector-icons**
- **TypeScript**

## Lancer le projet

```bash
npm install
npm start
```

Puis scanner le QR code avec l'app **Expo Go** sur iOS ou Android.

> Necessite une connexion internet : les sprites Pokemon sont charges depuis le depot GitHub PokeAPI.

## Parcours

1. **Onglet Pokedex** : grille des 151 Pokemon. Au depart tout est silhouette.
2. **Onglet Booster** : tapotez le pack pour declencher l'animation d'ouverture (secousse + flash blanc).
3. **Cinematique Reveal** : trois cartes apparaissent une a une avec un flip 3D. Glissez ou appuyez sur "Carte suivante".
4. De retour sur le Pokedex, les Pokemon decouverts sont colores. Appuyez sur l'un d'eux.
5. **Detail** : glissez la carte pour la deplacer, pincez pour zoomer — le fond change de couleur selon le zoom.
6. **A propos** : un petit texte contemplatif, un compteur, et un bouton pour reinitialiser.

## Mapping cours -> code

| Chapitre | Notion | Fichier |
|---|---|---|
| 1 — StyleSheet | `StyleSheet.create` | tous les ecrans |
| 1 — Flex | `flexDirection`, `gap`, `justifyContent` | `components/Header.tsx`, `app/(tabs)/index.tsx` |
| 1 — Dimensions | `Dimensions.get('window')` | `app/pokemon/[id].tsx`, `app/reveal.tsx`, `app/(tabs)/booster.tsx` |
| 2 — Stack | `Stack` racine | `app/_layout.tsx` |
| 2 — Tabs | `Tabs` (Pokedex / Booster / A propos) | `app/(tabs)/_layout.tsx` |
| 2 — Dynamic route | `[id].tsx` + `useLocalSearchParams` | `app/pokemon/[id].tsx` |
| 2 — useRouter | `router.push`, `router.replace` | `components/PokemonGridItem.tsx`, `app/reveal.tsx` |
| 3 — useSharedValue | translations, scales, rotations | `app/pokemon/[id].tsx`, `app/reveal.tsx`, `components/BoosterPack.tsx` |
| 3 — useAnimatedStyle | tous les composants animes | idem |
| 3 — withTiming / withSequence / withRepeat / withDelay | `BoosterPack` (flottement), `reveal` (flip), `PokemonGridItem` (fade-in stagger) | idem |
| 3 — runOnJS | mise a jour state React depuis worklet | `app/(tabs)/booster.tsx`, `app/reveal.tsx` |
| 4 — Gesture.Pan | drag de la carte avec retour anime | `app/pokemon/[id].tsx`, `app/reveal.tsx` |
| 4 — Gesture.Pinch | zoom de la carte + couleur de fond reactive | `app/pokemon/[id].tsx` |
| 4 — Gesture.Tap | ouverture du booster | `app/(tabs)/booster.tsx` |
| 4 — GestureHandlerRootView | racine de l'app | `app/_layout.tsx` |
| 4 — Gesture.Simultaneous | composition Pan + Pinch | `app/pokemon/[id].tsx` |

## TPs couverts

- **TP3 du chapitre 1 (Layout Flex)** : grille 3 colonnes du Pokedex, header en row, cartes en column.
- **TP1 du chapitre Gesture (drag + retour)** : `Gesture.Pan().onUpdate(...).onEnd(... withTiming(0, { duration: 500 }))` dans `app/pokemon/[id].tsx`.
- **TP2 du chapitre Gesture (zoom + couleur de fond reactive)** : `Gesture.Pinch()` met a jour un `scale.value`, `useAnimatedStyle` sur la `View` racine interpole `Colors.paper` vers la couleur du type principal du Pokemon en fonction du zoom (`interpolateColor`).

## Structure

```
app/
├── _layout.tsx              # GestureHandlerRootView + Stack
├── (tabs)/
│   ├── _layout.tsx          # Tabs navigator
│   ├── index.tsx            # Pokedex (grille)
│   ├── booster.tsx          # Ouverture du pack
│   └── about.tsx            # Page contemplative
├── pokemon/[id].tsx         # Detail (Pan + Pinch — cœur du TP)
└── reveal.tsx               # Cinematique post-booster

components/
├── Header.tsx
├── PokemonCard.tsx          # Carte avec degrade et badge holo
├── PokemonGridItem.tsx      # Item de grille (silhouette / decouvert)
└── BoosterPack.tsx          # Pack avec animation idle + shake

constants/
├── pokemon.ts               # Les 151 Pokemon
├── lore.ts                  # Notices contemplatives
├── theme.ts                 # Couleurs, espacements, URLs sprites
└── types.ts                 # PokemonType enum

hooks/
├── useCollection.ts         # AsyncStorage
└── useOpenPack.ts           # Tirage pondere
```

## Conventions de commits

Le projet utilise **commitlint + husky** (conventional commits). Voir `commitlint.config.cjs`.

## Credits

- Sprites & artworks : [PokeAPI/sprites](https://github.com/PokeAPI/sprites)
- Pokemon est une marque deposee de Nintendo / Game Freak / Creatures Inc.

## License

MIT.
