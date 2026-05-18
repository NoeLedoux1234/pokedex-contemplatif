import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize, Spacing } from '@/constants/theme';

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export const Header = ({ title, subtitle }: HeaderProps) => (
  <View style={styles.container}>
    <View style={styles.dot} />
    <View style={styles.text}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.pokeball,
    borderWidth: 2,
    borderColor: Colors.ink,
  },
  text: {
    flex: 1,
    flexDirection: 'column',
    gap: 2,
  },
  title: {
    fontSize: FontSize.heading,
    fontWeight: '700',
    color: Colors.ink,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: FontSize.caption,
    color: Colors.inkSoft,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
