import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Gesture, GestureDetector, Pressable } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { PokemonCard } from '@/components/PokemonCard';
import { findPokemon, RARE_IDS } from '@/constants/pokemon';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useCollection } from '@/hooks/CollectionContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.75;
const CARD_HEIGHT = CARD_WIDTH * 1.4;
const SWIPE_THRESHOLD = 90;

const parseIds = (raw: string | undefined): number[] => {
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n) && n > 0);
};

export default function RevealScreen() {
  const router = useRouter();
  const { ids } = useLocalSearchParams<{ ids?: string }>();
  const [index, setIndex] = useState(0);
  const pack = parseIds(ids);
  const { addMany } = useCollection();

  useEffect(() => {
    if (pack.length > 0) {
      addMany(pack);
    }
  }, [ids]);

  const flipX = useSharedValue(90);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);

  const playFlip = (i: number) => {
    const isRare = RARE_IDS.has(pack[i] ?? 0);
    flipX.value = 90;
    opacity.value = 0;
    scale.value = 0.85;
    translateX.value = 0;
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withDelay(100, withTiming(1, { duration: 600 }));
    flipX.value = withDelay(
      120,
      withTiming(0, { duration: 700 }, (finished) => {
        if (finished) {
          runOnJS(Haptics.impactAsync)(
            isRare ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Medium,
          );
        }
      }),
    );
  };

  useEffect(() => {
    if (pack.length === 0) return;
    playFlip(index);
  }, [index]);

  const advance = () => {
    if (index < pack.length - 1) {
      setIndex((v) => v + 1);
    } else {
      router.replace('/');
    }
  };

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > SWIPE_THRESHOLD) {
        translateX.value = withSequence(
          withTiming(Math.sign(e.translationX) * SCREEN_WIDTH, { duration: 220 }),
          withTiming(0, { duration: 0 }),
        );
        runOnJS(advance)();
      } else {
        translateX.value = withTiming(0, { duration: 350 });
      }
    });

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { perspective: 1200 },
      { translateX: translateX.value },
      { rotateX: `${flipX.value}deg` },
      { scale: scale.value },
    ],
  }));

  if (pack.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Aucune carte a reveler.</Text>
        <Pressable onPress={() => router.replace('/')} style={styles.closeBtn}>
          <Text style={styles.closeText}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  const pokemon = findPokemon(pack[index]);
  if (!pokemon) return null;

  const isLast = index === pack.length - 1;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#0a0a14', '#1B1B1F', '#2A1F2C']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.header}>
        <Text style={styles.counter}>
          {index + 1} / {pack.length}
        </Text>
        <Pressable onPress={() => router.replace('/')} hitSlop={12}>
          <Text style={styles.skip}>Passer</Text>
        </Pressable>
      </View>

      <View style={styles.cardStage}>
        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={[styles.cardWrap, cardAnimatedStyle]}>
            <PokemonCard pokemon={pokemon} width={CARD_WIDTH} height={CARD_HEIGHT} />
          </Animated.View>
        </GestureDetector>
      </View>

      <View style={styles.footer}>
        <Text style={styles.caught}>Ajoute a votre Pokedex</Text>
        <Pressable onPress={advance} style={styles.nextBtn}>
          <Text style={styles.nextText}>
            {isLast ? 'Terminer' : 'Carte suivante'}
          </Text>
        </Pressable>
        <Text style={styles.hint}>Ou glissez la carte sur le cote.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0a14',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
  },
  counter: {
    color: Colors.paper,
    fontSize: FontSize.body,
    letterSpacing: 2,
    fontWeight: '700',
  },
  skip: {
    color: Colors.paper,
    fontSize: FontSize.caption,
    opacity: 0.6,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
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
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  caught: {
    color: Colors.gold,
    fontSize: FontSize.caption,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  nextBtn: {
    backgroundColor: Colors.pokeball,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.pill,
    marginTop: Spacing.sm,
  },
  nextText: {
    color: Colors.paper,
    fontSize: FontSize.body,
    fontWeight: '700',
    letterSpacing: 1,
  },
  hint: {
    color: Colors.paper,
    opacity: 0.5,
    fontSize: FontSize.caption,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    backgroundColor: '#0a0a14',
  },
  emptyText: {
    color: Colors.paper,
    fontSize: FontSize.body,
  },
  closeBtn: {
    backgroundColor: Colors.pokeball,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  closeText: {
    color: Colors.paper,
    fontWeight: '600',
  },
});
