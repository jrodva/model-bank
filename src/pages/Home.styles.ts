import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@vacacode/tokens';

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.semantic.background.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.foundation.neutral[200],
    backgroundColor: colors.semantic.background.surface,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.foundation.blue[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  logoText: {
    color: colors.foundation.neutral[0],
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
  bankName: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.semantic.text.primary,
  },
});
