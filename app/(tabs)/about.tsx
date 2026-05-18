import { useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Header } from '@/components/Header';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useCollection } from '@/hooks/CollectionContext';

const LINES = [
  'Un Pokedex pour le simple plaisir d observer.',
  'Pas de combat. Pas de classement.',
  'Juste 151 creatures de la premiere generation,',
  'a decouvrir au rythme des boosters.',
];

const FadeLine = ({ children, delay }: { children: string; delay: number }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 600 }));
  }, [delay, opacity, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.Text style={[styles.line, style]}>{children}</Animated.Text>
  );
};

export default function AboutScreen() {
  const { caught, total, reset } = useCollection();

  const confirmReset = () => {
    Alert.alert(
      'Reinitialiser la collection ?',
      'Tous vos Pokemon decouverts seront oublies.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Reinitialiser',
          style: 'destructive',
          onPress: () => reset(),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="A propos" subtitle="Une pause" />
      <View style={styles.content}>
        <View style={styles.poem}>
          {LINES.map((line, i) => (
            <FadeLine key={line} delay={300 + i * 600}>
              {line}
            </FadeLine>
          ))}
        </View>

        <View style={styles.stats}>
          <Text style={styles.statValue}>{caught.length}</Text>
          <Text style={styles.statLabel}>decouverts sur {total}</Text>
        </View>

        <View style={styles.credits}>
          <Text style={styles.creditTitle}>Credits</Text>
          <Text style={styles.creditText}>
            Sprites et artworks par la communaute PokeAPI.
          </Text>
          <Text style={styles.creditText}>
            Projet de cours React Native + Expo.
          </Text>
          <Text style={styles.creditText}>v1.0.0</Text>
        </View>

        <Pressable onPress={confirmReset} style={styles.resetBtn}>
          <Text style={styles.resetText}>Reinitialiser la collection</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    gap: Spacing.xl,
  },
  poem: {
    gap: Spacing.sm,
  },
  line: {
    fontSize: FontSize.title,
    color: Colors.ink,
    lineHeight: 28,
    fontWeight: '500',
  },
  stats: {
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.paperDark,
    borderRadius: Radius.lg,
  },
  statValue: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.pokeball,
  },
  statLabel: {
    fontSize: FontSize.caption,
    color: Colors.inkSoft,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  credits: {
    gap: 4,
  },
  creditTitle: {
    fontSize: FontSize.caption,
    fontWeight: '700',
    color: Colors.inkSoft,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  creditText: {
    fontSize: FontSize.body,
    color: Colors.ink,
    opacity: 0.8,
  },
  resetBtn: {
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.inkSoft,
    borderRadius: Radius.pill,
    marginTop: 'auto',
    marginBottom: Spacing.lg,
  },
  resetText: {
    color: Colors.inkSoft,
    fontSize: FontSize.caption,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
