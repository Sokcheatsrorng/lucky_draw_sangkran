/**
 * Modern Sangkran color palette and theme configuration
 * Combines traditional Sangkran warmth with contemporary design trends
 */

export const sangkranColors = {
  // Primary colors - Warm and celebratory
  gold: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    400: "#FBBF24",
    500: "#F59E0B",
    600: "#D97706",
  },

  // Secondary colors - Deep, sophisticated
  red: {
    500: "#DC2626",
    600: "#B91C1C",
    700: "#991B1B",
  },

  // Accent colors - Modern pop
  teal: {
    400: "#2DD4BF",
    500: "#14B8A6",
    600: "#0D9488",
  },

  // Neutrals - Dark mode base
  slate: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },

  // Semantic colors
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
}

export const sangkranTheme = {
  // Backgrounds
  bgBase: sangkranColors.slate[900], // #0F172A
  bgCard: sangkranColors.slate[800], // #1E293B
  bgHover: "rgba(255, 255, 255, 0.05)",
  bgActive: "rgba(245, 158, 11, 0.1)",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.7)",
  textTertiary: "rgba(255, 255, 255, 0.5)",

  // Accents
  accentPrimary: sangkranColors.gold[500], // #F59E0B
  accentSecondary: sangkranColors.red[500], // #DC2626
  accentTertiary: sangkranColors.teal[500], // #14B8A6

  // Borders and dividers
  border: "rgba(255, 255, 255, 0.1)",
  divider: "rgba(255, 255, 255, 0.05)",

  // Gradients
  gradients: {
    primary:
      "linear-gradient(135deg, rgba(245, 158, 11, 1) 0%, rgba(217, 119, 6, 1) 100%)",
    accent: "linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(20, 184, 166, 0.3) 100%)",
    card: "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)",
  },

  // Shadows
  shadowSm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  shadowMd: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  shadowLg: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
  shadowXl: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",

  // Special effects
  glassEffect:
    "backdrop-blur-md bg-white/[0.05] border border-white/[0.1] shadow-lg",
  gradientBorder:
    "before:absolute before:inset-0 before:bg-gradient-to-r before:from-yellow-400 before:via-orange-500 before:to-yellow-400 before:rounded-lg before:blur-md before:opacity-75 before:-z-10",
}
