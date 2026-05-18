import { useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Gesture, GestureDetector, Pressable } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PokemonCard } from '@/components/PokemonCard';
import { findPokemon } from '@/constants/pokemon';
import { Colors, FontSize, Radius, Spacing, TypeColors } from '@/constants/theme';
import { POKEDEX_LORE, defaultLore } from '@/constants/lore';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.72;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const pokemonId = Number(id);
  const pokemon = useMemo(() => findPokemon(pokemonId), [pokemonId]);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      translateX.value = withTiming(0, { duration: 500 });
      translateY.value = withTiming(0, { duration: 500 });
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(0.6, Math.min(2.5, e.scale));
    })
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 500 });
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${translateX.value / 20}deg` },
    ],
  }));

  const tint = pokemon ? TypeColors[pokemon.types[0]] : Colors.paper;

  const backgroundStyle = useAnimatedStyle(() => {
    const t = interpolate(scale.value, [0.6, 1, 2.5], [0, 0, 1], 'clamp');
    return {
      backgroundColor: interpolateColor(t, [0, 1], [Colors.paper, tint]),
    };
  });

  const hintStyle = useAnimatedStyle(() => {
    const t = interpolate(scale.value, [1, 1.8], [0, 1], 'clamp');
    return { opacity: t };
  });

  if (!pokemon) {
    return (
      <SafeAreaView style={styles.notFound}>
        <Text style={styles.notFoundText}>Pokemon introuvable</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Retour</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <Animated.View style={[styles.root, backgroundStyle]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={22} color={Colors.ink} />
          </Pressable>
          <Text style={styles.title}>{pokemon.name}</Text>
          <View style={styles.iconBtn} />
        </View>

        <View style={styles.cardStage}>
          <GestureDetector gesture={composedGesture}>
            <Animated.View style={[styles.cardWrap, cardStyle]}>
              <PokemonCard pokemon={pokemon} width={CARD_WIDTH} height={CARD_HEIGHT} />
            </Animated.View>
          </GestureDetector>

          <Animated.View style={[styles.zoomHint, hintStyle]} pointerEvents="none">
            <Text style={styles.zoomHintText}>Zoom +</Text>
          </Animated.View>
        </View>

        <View style={styles.loreBox}>
          <Text style={styles.loreTitle}>Notice</Text>
          <Text style={styles.loreText}>
            {POKEDEX_LORE[pokemon.id] ?? defaultLore(pokemon.name)}
          </Text>
          <Text style={styles.help}>
            Glissez la carte pour la deplacer, pincez pour zoomer.
          </Text>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  safe: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.paperDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.heading,
    fontWeight: '700',
    color: Colors.ink,
  },
  cardStage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomHint: {
    position: 'absolute',
    bottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    backgroundColor: Colors.overlay,
    borderRadius: Radius.pill,
  },
  zoomHintText: {
    color: Colors.paper,
    fontSize: FontSize.caption,
    letterSpacing: 1,
  },
  loreBox: {
    backgroundColor: Colors.paperDark,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    gap: Spacing.sm,
  },
  loreTitle: {
    fontSize: FontSize.caption,
    fontWeight: '700',
    color: Colors.inkSoft,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  loreText: {
    fontSize: FontSize.body,
    color: Colors.ink,
    lineHeight: 20,
  },
  help: {
    fontSize: FontSize.caption,
    color: Colors.inkSoft,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
  notFound: {
    flex: 1,
    backgroundColor: Colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  notFoundText: {
    fontSize: FontSize.title,
    color: Colors.ink,
  },
  backButton: {
    backgroundColor: Colors.pokeball,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  backText: {
    color: Colors.paper,
    fontWeight: '600',
  },
});
