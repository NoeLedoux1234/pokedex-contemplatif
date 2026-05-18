import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';

type Props = {
  shaking: boolean;
  width: number;
  height: number;
};

export const BoosterPack = ({ shaking, width, height }: Props) => {
  const floatY = useSharedValue(0);
  const shakeX = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
    );
  }, [floatY]);

  useEffect(() => {
    if (shaking) {
      shakeX.value = withRepeat(
        withSequence(
          withTiming(-6, { duration: 60 }),
          withTiming(6, { duration: 60 }),
        ),
        -1,
        true,
      );
    } else {
      shakeX.value = withTiming(0, { duration: 120 });
    }
  }, [shaking, shakeX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }, { translateX: shakeX.value }],
  }));

  return (
    <Animated.View style={[styles.pack, { width, height }, animatedStyle]}>
      <LinearGradient
        colors={['#C44545', '#8B2E2E', '#1B1B1F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      />
      <View style={styles.band}>
        <View style={styles.ball}>
          <View style={styles.ballLine} />
          <View style={styles.ballCenter} />
        </View>
        <Text style={styles.title}>GEN I</Text>
        <Text style={styles.subtitle}>BOOSTER</Text>
      </View>
      <View style={styles.bottom}>
        <Text style={styles.foot}>15 cartes a decouvrir</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pack: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    padding: Spacing.md,
    justifyContent: 'space-between',
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 16,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  band: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  ball: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.paper,
    borderWidth: 3,
    borderColor: Colors.ink,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballLine: {
    position: 'absolute',
    top: 28,
    left: -2,
    right: -2,
    height: 4,
    backgroundColor: Colors.ink,
  },
  ballCenter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.paper,
    borderWidth: 3,
    borderColor: Colors.ink,
    zIndex: 2,
  },
  title: {
    color: Colors.gold,
    fontSize: FontSize.display,
    fontWeight: '900',
    letterSpacing: 4,
  },
  subtitle: {
    color: Colors.paper,
    fontSize: FontSize.caption,
    letterSpacing: 6,
    fontWeight: '600',
  },
  bottom: {
    alignItems: 'center',
  },
  foot: {
    color: Colors.paper,
    fontSize: FontSize.caption,
    opacity: 0.8,
    letterSpacing: 1,
  },
});
