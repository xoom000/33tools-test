// COMPOSE, NEVER DUPLICATE - Card Configuration System! ⚔️

import { STATUS_COLORS, BUTTON_VARIANTS, BUTTON_SIZES } from '../constants/ui';
import { VARIANTS, TYPOGRAPHY, COLORS, SPACING } from '../theme';

export const CARD_CONFIGS = {
  // Base card variants - foundational styles
  base: {
    container: `${VARIANTS.card.base} transition-all`,
    padding: SPACING.lg,
    borderRadius: 'rounded-xl',
    animation: 'scaleIn'
  },

  // Customer cards - Interactive business cards
  customer: {
    variant: 'interactive',
    container: 'bg-slate-50 rounded-xl p-4 sm:p-5 hover:bg-slate-100 transition-all border border-slate-200 hover:border-slate-300',
    animation: { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
    layout: {
      spacing: 'space-y-3',
      avatarSize: 'w-10 h-10',
      contentSpacing: 'space-y-2'
    },
    avatar: {
      container: 'w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center flex-shrink-0',
      text: 'text-slate-600 font-bold text-sm'
    },
    header: {
      title: 'font-semibold text-slate-800 text-sm leading-tight',
      subtitle: 'text-slate-600 text-xs truncate'
    },
    content: {
      text: 'text-xs text-slate-600 leading-relaxed',
      badgeContainer: 'flex flex-wrap gap-1'
    },
    badges: {
      default: 'text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full',
      token: 'text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full',
      status: {
        active: 'text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full',
        inactive: 'text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full'
      }
    },
    actions: {
      container: 'flex flex-wrap items-center gap-1.5 md:gap-2',
      button: {
        size: BUTTON_SIZES.XS,
        className: 'flex-1 sm:flex-none text-xs'
      },
      variants: {
        primary: { text: 'Order', variant: BUTTON_VARIANTS.SECONDARY },
        edit: { text: 'Edit', variant: BUTTON_VARIANTS.SECONDARY },
        token: { text: 'Token', variant: BUTTON_VARIANTS.GHOST },
        items: { text: 'Items', variant: BUTTON_VARIANTS.OUTLINE }
      }
    }
  },

  // Stats cards - Data display cards
  stats: {
    variant: 'display',
    container: 'text-center p-4 rounded-lg',
    animation: 'scaleIn',
    layout: {
      centered: true,
      iconPosition: 'top'
    },
    icon: {
      size: 'text-2xl',
      spacing: 'mb-2'
    },
    value: {
      typography: `${TYPOGRAPHY.sizes['2xl']} ${TYPOGRAPHY.weights.bold}`,
      colorMapping: {
        blue: 'text-blue-600',
        green: 'text-green-600',
        purple: 'text-purple-600',
        yellow: 'text-yellow-600',
        red: 'text-red-600',
        slate: 'text-slate-600'
      }
    },
    title: {
      typography: `${TYPOGRAPHY.sizes.sm} text-slate-600`
    },
    colorSchemes: {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      red: 'bg-red-50 text-red-600',
      slate: 'bg-slate-50 text-slate-600'
    }
  },

  // Checklist cards - Interactive task lists
  checklist: {
    variant: 'elevated',
    container: `${VARIANTS.card.elevated} p-6`,
    animation: 'slideUp',
    header: {
      typography: `${TYPOGRAPHY.sizes.xl} ${TYPOGRAPHY.weights.semibold} mb-4 flex items-center`,
      iconSpacing: 'mr-2'
    },
    list: {
      container: 'space-y-2',
      item: {
        container: 'flex items-center space-x-3 p-2 hover:bg-slate-50 rounded transition-colors cursor-pointer',
        checkbox: 'h-4 w-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500',
        label: `${TYPOGRAPHY.sizes.sm} text-slate-700`
      }
    }
  },

  // Demo content cards - Educational/onboarding cards
  demo: {
    variant: 'educational',
    container: `${VARIANTS.card.elevated} p-8`,
    animation: 'scaleIn',
    header: {
      title: `${TYPOGRAPHY.sizes.xl} ${TYPOGRAPHY.weights.semibold} text-slate-800 mb-4`,
      description: `${TYPOGRAPHY.sizes.lg} text-slate-600 mb-6`
    },
    helpHint: {
      container: 'mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg',
      layout: 'flex items-start gap-3',
      icon: 'text-blue-500 text-lg',
      content: 'text-sm text-blue-700',
      title: 'font-bold'
    }
  },

  // Selection grid cards - For CustomerSelectionGrid
  selection: {
    variant: 'selectable',
    container: 'border-2 rounded-lg p-4 cursor-pointer transition-all',
    states: {
      default: 'border-slate-200 bg-white hover:border-slate-300',
      selected: 'border-primary-500 bg-primary-50',
      disabled: 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-50'
    },
    content: {
      title: 'font-medium text-slate-800',
      subtitle: 'text-sm text-slate-600',
      badge: 'text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded'
    }
  },

  // Admin section cards - Dashboard sections
  admin: {
    variant: 'sectioned',
    container: `${VARIANTS.card.base} p-6`,
    animation: 'slideUp',
    header: {
      container: 'flex items-center justify-between mb-4',
      title: `${TYPOGRAPHY.sizes.lg} ${TYPOGRAPHY.weights.semibold} text-slate-800`,
      actions: 'flex gap-2'
    },
    content: {
      grid: 'grid gap-4',
      responsive: {
        sm: 'sm:grid-cols-2',
        md: 'md:grid-cols-3',
        lg: 'lg:grid-cols-4'
      }
    }
  }
};

// Card action configurations
export const CARD_ACTIONS = {
  customer: {
    generateToken: {
      label: 'Token',
      variant: BUTTON_VARIANTS.GHOST,
      size: BUTTON_SIZES.XS,
      className: 'flex-1 sm:flex-none text-xs'
    },
    edit: {
      label: 'Edit',
      variant: BUTTON_VARIANTS.SECONDARY,
      size: BUTTON_SIZES.XS,
      className: 'flex-1 sm:flex-none text-xs'
    },
    addItems: {
      label: 'Items',
      variant: BUTTON_VARIANTS.OUTLINE,
      size: BUTTON_SIZES.XS,
      className: 'flex-1 sm:flex-none text-xs'
    },
    order: {
      label: 'Order',
      variant: BUTTON_VARIANTS.SECONDARY,
      size: BUTTON_SIZES.XS,
      className: 'flex-1 sm:flex-none text-xs'
    }
  }
};

// Badge configurations for different card types
export const CARD_BADGES = {
  serviceFrequency: {
    className: 'text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full'
  },
  serviceDays: {
    className: 'text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full'
  },
  loginToken: {
    className: 'text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full',
    prefix: 'Token: '
  },
  status: {
    active: 'text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full',
    inactive: 'text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full'
  }
};