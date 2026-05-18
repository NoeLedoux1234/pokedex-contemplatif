import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Pokemon } from '@/constants/types';
import { Colors, FontSize, Radius, Spacing, TypeColors, TypeLabels, officialArtUrl } from '@/constants/theme';
import { RARE_IDS } from '@/constants/pokemon';

type Props = {
  pokemon: Pokemon;
  width: number;
  height: number;
};

const formatId = (id: number) => `N${String(id).padStart(3, '0')}`;

export const PokemonCard = ({ pokemon, width, height }: Props) => {
  const primary = pokemon.types[0];
  const tint = TypeColors[primary];
  const isRare = RARE_IDS.has(pokemon.id);

  return (
    <View style={[styles.card, { width, height, borderColor: isRare ? Colors.gold : Colors.ink }]}>
      <LinearGradient
        colors={[`${tint}40`, `${tint}10`, Colors.paper]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.headerRow}>
        <Text style={styles.name}>{pokemon.name}</Text>
        <Text style={styles.id}>{formatId(pokemon.id)}</Text>
      </View>
      <View style={styles.artFrame}>
        <Image
          source={{ uri: officialArtUrl(pokemon.id) }}
          style={styles.art}
          resizeMode="contain"
        />
      </View>
      <View style={styles.types}>
        {pokemon.types.map((t) => (
          <View key={t} style={[styles.typeBadge, { backgroundColor: TypeColors[t] }]}>
            <Text style={styles.typeLabel}>{TypeLabels[t]}</Text>
          </View>
        ))}
      </View>
      {isRare ? (
        <View style={styles.rareTag}>
          <Text style={styles.rareText}>HOLO</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.paper,
    borderRadius: Radius.lg,
    borderWidth: 2,
    padding: Spacing.md,
    overflow: 'hidden',
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Colors.ink,
  },
  id: {
    fontSize: FontSize.caption,
    color: Colors.inkSoft,
    letterSpacing: 1,
  },
  artFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  art: {
    width: '90%',
    height: '90%',
  },
  types: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  typeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  typeLabel: {
    color: Colors.paper,
    fontSize: FontSize.caption,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  rareTag: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  rareText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.ink,
    letterSpacing: 1.5,
  },
});
