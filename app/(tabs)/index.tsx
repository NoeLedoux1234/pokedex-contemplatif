import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { PokemonGridItem } from '@/components/PokemonGridItem';
import { POKEMON_GEN_1 } from '@/constants/pokemon';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useCollection } from '@/hooks/CollectionContext';

const NUM_COLUMNS = 3;
const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_SIZE = (SCREEN_WIDTH - Spacing.lg * 2) / NUM_COLUMNS;

export default function PokedexScreen() {
  const { caught, total, ready } = useCollection();
  const count = caught.length;

  const subtitle = ready
    ? `${count} sur ${total} decouverts`
    : 'Chargement de votre collection...';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Pokedex" subtitle={subtitle} />
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${(count / total) * 100}%` }]} />
      </View>
      <FlatList
        data={POKEMON_GEN_1}
        keyExtractor={(item) => String(item.id)}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <PokemonGridItem
            pokemon={item}
            caught={caught.includes(item.id)}
            index={index}
            size={ITEM_SIZE}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {ready
              ? 'Aucun Pokemon decouvert. Ouvrez un booster pour commencer.'
              : ''}
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.paperDark,
    marginHorizontal: Spacing.lg,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.pokeball,
  },
  list: {
    paddingHorizontal: Spacing.lg - Spacing.xs,
    paddingBottom: Spacing.xl,
  },
  empty: {
    textAlign: 'center',
    color: Colors.inkSoft,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    fontSize: FontSize.body,
    lineHeight: 22,
  },
});
