import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// MARK: - Colors (Following Apple's Color System)
export const colors = {
  // System Colors
  systemBlue: '#007AFF',
  systemGreen: '#34C759',
  systemIndigo: '#5856D6',
  systemOrange: '#FF9500',
  systemPink: '#FF2D92',
  systemPurple: '#AF52DE',
  systemRed: '#FF3B30',
  systemTeal: '#5AC8FA',
  systemYellow: '#FFCC02',
  
  // Semantic Colors
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  
  // Background Colors
  systemBackground: '#FFFFFF',
  secondarySystemBackground: '#F2F2F7',
  tertiarySystemBackground: '#FFFFFF',
  systemGroupedBackground: '#F2F2F7',
  secondarySystemGroupedBackground: '#FFFFFF',
  tertiarySystemGroupedBackground: '#F2F2F7',
  
  // Label Colors
  label: '#000000',
  secondaryLabel: '#3C3C43',
  tertiaryLabel: '#3C3C43',
  quaternaryLabel: '#3C3C43',
  
  // Separator Colors
  separator: '#C6C6C8',
  opaqueSeparator: '#C6C6C8',
  
  // Fill Colors
  systemFill: '#787880',
  secondarySystemFill: '#787880',
  tertiarySystemFill: '#787880',
  quaternarySystemFill: '#787880',
  
  // Custom App Colors
  eldercarePrimary: '#007AFF',
  eldercareSecondary: '#5856D6',
  eldercareAccent: '#34C759',
  eldercareBackground: '#F2F2F7',
  eldercareCard: '#FFFFFF',
  eldercareText: '#000000',
  eldercareTextSecondary: '#3C3C43',
  eldercareBorder: '#C6C6C8',
};

// MARK: - Typography (Following Apple's Type Scale)
export const typography = {
  // Large Title (Navigation Bar)
  largeTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
    lineHeight: 41,
    letterSpacing: 0.37,
  },
  
  // Title 1
  title1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
    letterSpacing: 0.36,
  },
  
  // Title 2
  title2: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
    letterSpacing: 0.35,
  },
  
  // Title 3
  title3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0.38,
  },
  
  // Headline
  headline: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  
  // Body
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 22,
    letterSpacing: -0.41,
  },
  
  // Callout
  callout: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 21,
    letterSpacing: -0.32,
  },
  
  // Subheadline
  subheadline: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: -0.24,
  },
  
  // Footnote
  footnote: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
    letterSpacing: -0.08,
  },
  
  // Caption 1
  caption1: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0,
  },
  
  // Caption 2
  caption2: {
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 13,
    letterSpacing: 0.07,
  },
};

// MARK: - Spacing (Following Apple's 8pt Grid)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  
  // Screen margins
  screenMargin: 16,
  screenMarginLarge: 20,
  
  // Component spacing
  componentPadding: 16,
  componentPaddingLarge: 20,
  componentPaddingSmall: 12,
  
  // List item spacing
  listItemSpacing: 1,
  listItemPadding: 16,
  
  // Button spacing
  buttonPadding: 12,
  buttonPaddingLarge: 16,
  
  // Input spacing
  inputPadding: 12,
  inputMargin: 8,
};

// MARK: - Border Radius (Following Apple's Guidelines)
export const borderRadius = {
  none: 0,
  small: 6,
  medium: 8,
  large: 12,
  xlarge: 16,
  xxlarge: 20,
  round: 50,
  
  // Component specific
  card: 12,
  button: 8,
  input: 8,
  modal: 16,
  badge: 12,
};

// MARK: - Shadows (Following Apple's Elevation)
export const shadows = {
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
};

// MARK: - Layout Constants
export const layout = {
  screenWidth,
  screenHeight,
  
  // Navigation
  navigationBarHeight: 44,
  tabBarHeight: 83,
  statusBarHeight: 44,
  
  // Components
  buttonHeight: 44,
  buttonHeightLarge: 50,
  inputHeight: 44,
  cardMinHeight: 60,
  
  // Margins and padding
  safeAreaTop: 44,
  safeAreaBottom: 34,
};

// MARK: - Animation Durations
export const animations = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
  
  // Spring configurations
  spring: {
    tension: 100,
    friction: 8,
  },
};

// MARK: - Component Styles
export const componentStyles = {
  // Card styles
  card: {
    backgroundColor: colors.systemBackground,
    borderRadius: borderRadius.card,
    padding: spacing.componentPadding,
    ...shadows.small,
  },
  
  // Button styles
  button: {
    primary: {
      backgroundColor: colors.systemBlue,
      borderRadius: borderRadius.button,
      paddingVertical: spacing.buttonPadding,
      paddingHorizontal: spacing.componentPadding,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: layout.buttonHeight,
    },
    secondary: {
      backgroundColor: colors.secondarySystemBackground,
      borderRadius: borderRadius.button,
      paddingVertical: spacing.buttonPadding,
      paddingHorizontal: spacing.componentPadding,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: layout.buttonHeight,
      borderWidth: 1,
      borderColor: colors.separator,
    },
    destructive: {
      backgroundColor: colors.systemRed,
      borderRadius: borderRadius.button,
      paddingVertical: spacing.buttonPadding,
      paddingHorizontal: spacing.componentPadding,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: layout.buttonHeight,
    },
  },
  
  // Input styles
  input: {
    backgroundColor: colors.systemBackground,
    borderRadius: borderRadius.input,
    borderWidth: 1,
    borderColor: colors.separator,
    paddingHorizontal: spacing.inputPadding,
    paddingVertical: spacing.inputPadding,
    minHeight: layout.inputHeight,
    ...typography.body,
  },
  
  // List styles
  listItem: {
    backgroundColor: colors.systemBackground,
    paddingVertical: spacing.listItemPadding,
    paddingHorizontal: spacing.componentPadding,
    borderBottomWidth: spacing.listItemSpacing,
    borderBottomColor: colors.separator,
  },
  
  // Badge styles
  badge: {
    backgroundColor: colors.systemBlue,
    borderRadius: borderRadius.badge,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    ...typography.caption1,
    color: colors.systemBackground,
  },
};

// MARK: - Screen-specific styles
export const screenStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.systemGroupedBackground,
  },
  
  contentContainer: {
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.md,
  },
  
  header: {
    backgroundColor: colors.systemBackground,
    paddingHorizontal: spacing.componentPadding,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  
  section: {
    backgroundColor: colors.systemBackground,
    marginBottom: spacing.md,
    borderRadius: borderRadius.large,
    overflow: 'hidden' as const,
  },
  
  sectionHeader: {
    backgroundColor: colors.systemGroupedBackground,
    paddingHorizontal: spacing.componentPadding,
    paddingVertical: spacing.sm,
    ...typography.subheadline,
    color: colors.secondaryLabel,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
  animations,
  componentStyles,
  screenStyles,
};
