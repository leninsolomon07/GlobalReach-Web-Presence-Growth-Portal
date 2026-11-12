/**
 * GlobalReach Web Presence & Growth Portal
 * Theme Manager (Light & Dark Mode)
 * File: js/theme.js
 */

const ThemeManager = (() => {
  const THEME_LIGHT = 'light';
  const THEME_DARK = 'dark';

  // Determine initial theme
  const getPreferredTheme = () => {
    // 1. Check saved preference in localStorage
    if (window.StorageService) {
      const savedTheme = window.StorageService.get(window.StorageService.KEYS.THEME);
      if (savedTheme === THEME_LIGHT || savedTheme === THEME_DARK) {
        return savedTheme;
      }
    }
    // 2. Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEME_DARK;
    }
    return THEME_LIGHT;
  };

  // Apply theme to document root
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    if (window.StorageService) {
      window.StorageService.set(window.StorageService.KEYS.THEME, theme);
    }
    updateToggleButtons(theme);

    // Dispatch event for other components if needed
    window.dispatchEvent(new CustomEvent('globalreach:themeChanged', { detail: { theme } }));
  };

  const updateToggleButtons = (theme) => {
    const buttons = document.querySelectorAll('.theme-toggle-btn');
    buttons.forEach((btn) => {
      const isDark = theme === THEME_DARK;
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || THEME_LIGHT;
    const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    applyTheme(newTheme);
  };

  const init = () => {
    const initialTheme = getPreferredTheme();
    applyTheme(initialTheme);

    // Attach listeners to all theme toggle buttons on the page
    document.addEventListener('click', (event) => {
      const toggleBtn = event.target.closest('.theme-toggle-btn');
      if (toggleBtn) {
        event.preventDefault();
        toggleTheme();
      }
    });

    // Listen for OS scheme change if user hasn't explicitly saved a preference
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!window.StorageService || !window.StorageService.get(window.StorageService.KEYS.THEME)) {
          applyTheme(e.matches ? THEME_DARK : THEME_LIGHT);
        }
      });
    }
  };

  // Apply immediately before DOM loads to prevent flash of wrong theme
  const preInitTheme = () => {
    try {
      const saved = localStorage.getItem('globalreach_theme');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed === THEME_DARK || parsed === THEME_LIGHT) {
          document.documentElement.setAttribute('data-theme', parsed);
          return;
        }
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', THEME_DARK);
      }
    } catch (e) {
      // Ignore
    }
  };

  preInitTheme();

  return {
    init,
    toggleTheme,
    applyTheme,
    getCurrentTheme: () => document.documentElement.getAttribute('data-theme') || THEME_LIGHT
  };
})();

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ThemeManager.init);
} else {
  ThemeManager.init();
}

window.ThemeManager = ThemeManager;
