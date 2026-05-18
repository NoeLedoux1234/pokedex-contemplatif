import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Pressable } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { Pokemon } from '@/constants/types';
import { Colors, FontSize, Radius, Spacing, spriteUrl } from '@/constants/theme';
import { RARE_IDS } from '@/constants/pokemon';

type Props = {
  pokemon: Pokemon;
  caught: boolean;
  index: number;
  size: number;
};

const formatId = (id: number) => `N${String(id).padStart(3, '0')}`;

export const PokemonGridItem = ({ pokemon, caught, index, size }: Props) => {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    const delay = Math.min(index, 24) * 25;
    opacity.value = withDelay(delay, withTiming(1, { duration: 320 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 360 }));
  }, [index, opacity, translateY]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const onPress = () => {
    if (!caught) return;
    router.push(`/pokemon/${pokemon.id}`);
  };

  const isRare = RARE_IDS.has(pokemon.id);

  return (
    <Animated.View style={[styles.wrapper, { width: size }, containerStyle]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          { height: size * 1.1 },
          caught && isRare && styles.rare,
          pressed && caught && styles.pressed,
        ]}
      >
        <Text style={styles.id}>{formatId(pokemon.id)}</Text>
        <View style={styles.spriteWrap}>
          <Image
            source={{ uri: spriteUrl(pokemon.id) }}
            style={[styles.sprite, !caught && styles.silhouette]}
            resizeMode="contain"
          />
        </View>
        <Text style={[styles.name, !caught && styles.nameLocked]} numberOfLines={1}>
          {caught ? pokemon.name : '???'}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: Spacing.xs,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.paperDark,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  rare: {
    borderColor: Colors.gold,
    borderWidth: 1.5,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  id: {
    fontSize: FontSize.caption,
    color: Colors.inkSoft,
    letterSpacing: 1,
    alignSelf: 'flex-start',
  },
  spriteWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  sprite: {
    width: '85%',
    height: '85%',
  },
  silhouette: {
    tintColor: Colors.silhouette,
    opacity: 0.85,
  },
  name: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Colors.ink,
    textAlign: 'center',
  },
  nameLocked: {
    color: Colors.inkSoft,
    fontWeight: '400',
    letterSpacing: 2,
  },
});
