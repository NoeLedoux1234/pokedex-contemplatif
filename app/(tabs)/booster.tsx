import { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Header } from '@/components/Header';
import { BoosterPack } from '@/components/BoosterPack';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useOpenPack } from '@/hooks/useOpenPack';
import { useCollection } from '@/hooks/CollectionContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PACK_WIDTH = SCREEN_WIDTH * 0.55;
const PACK_HEIGHT = PACK_WIDTH * 1.7;

export default function BoosterScreen() {
  const router = useRouter();
  const drawPack = useOpenPack();
  const { caught } = useCollection();
  const [shaking, setShaking] = useState(false);
  const flashOpacity = useSharedValue(0);

  const triggerFlash = (ids: number[]) => {
    setShaking(false);
    router.push({ pathname: '/reveal', params: { ids: ids.join(',') } });
  };

  const openPack = () => {
    setShaking(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const ids = drawPack(caught);
    flashOpacity.value = 0;
    flashOpacity.value = withDelay(
      380,
      withSequence(
        withTiming(1, { duration: 220 }, (finished) => {
          if (finished) runOnJS(triggerFlash)(ids);
        }),
        withTiming(0, { duration: 600 }),
      ),
    );
  };

  const tapGesture = Gesture.Tap()
    .maxDuration(800)
    .onEnd((_e, success) => {
      if (success) runOnJS(openPack)();
    });

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Booster" subtitle="Touchez le pack pour decouvrir 3 cartes" />
      <View style={styles.stage}>
        <GestureDetector gesture={tapGesture}>
          <View>
            <BoosterPack shaking={shaking} width={PACK_WIDTH} height={PACK_HEIGHT} />
          </View>
        </GestureDetector>
        <Text style={styles.hint}>Tapotez doucement.</Text>
      </View>
      <Animated.View pointerEvents="none" style={[styles.flash, flashStyle]} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  hint: {
    color: Colors.inkSoft,
    fontSize: FontSize.caption,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.flash,
  },
});
