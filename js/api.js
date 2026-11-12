/**
 * GlobalReach Web Presence & Growth Portal
 * Public Placeholder API Integration & Live Data Feeds
 * File: js/api.js
 */

const ApiService = (() => {
  // Safe public REST placeholder endpoint
  const API_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=3';

  // High-fidelity fallback data for offline or restricted environments
  const FALLBACK_DISPATCHES = [
    {
      id: 101,
      title: 'Expanding Artisanal Crafts to Nordic Retailers',
      body: 'How a local ceramic workshop in Jaipur leveraged an accessible, multilingual showcase to receive enquiries from three international boutiques.',
      author: 'Aarav Sharma',
      location: 'Jaipur, India'
    },
    {
      id: 102,
      title: 'Optimizing Mobile Conversions for Boutique Law Practices',
      body: 'Transforming consultation booking times with lightweight, responsive pages and transparent client fee schedules.',
      author: 'Priya Iyer',
      location: 'Bengaluru, India'
    },
    {
      id: 103,
      title: 'Establishing Digital Trust for Independent Financial Advisors',
      body: 'Building clear credibility markers, client testimonials, and 3-year guaranteed web uptime for global NRI consultation.',
      author: 'Vikram Mehta',
      location: 'Mumbai, India'
    }
  ];

  /**
   * Fetches latest dispatches / case updates with loading and error states
   */
  const fetchRecentDispatches = async (containerElement) => {
    if (!containerElement) return;

    // 1. Show Loading State
    containerElement.textContent = '';
    const loadingBox = document.createElement('div');
    loadingBox.className = 'api-status-box';
    
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    
    const loadingText = document.createElement('span');
    loadingText.textContent = 'Fetching latest verified growth spotlights from public feed...';
    
    loadingBox.appendChild(spinner);
    loadingBox.appendChild(loadingText);
    containerElement.appendChild(loadingBox);

    try {
      // Setup timeout controller for fast fallback if network is constrained
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(API_URL, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const rawPosts = await response.json();
      
      // Transform public placeholder posts into realistic client spotlights
      const items = rawPosts.map((post, idx) => ({
        id: post.id,
        title: post.title.charAt(0).toUpperCase() + post.title.slice(1, 45) + '...',
        body: FALLBACK_DISPATCHES[idx] ? FALLBACK_DISPATCHES[idx].body : post.body.slice(0, 120) + '...',
        author: FALLBACK_DISPATCHES[idx] ? FALLBACK_DISPATCHES[idx].author : `Client Partner #${post.userId}`,
        location: FALLBACK_DISPATCHES[idx] ? FALLBACK_DISPATCHES[idx].location : 'Verified Partner'
      }));

      renderDispatches(containerElement, items, false);
    } catch (err) {
      console.warn('Network request failed or offline. Rendering verified local data:', err);
      // Graceful fallback to verified showcase items with offline notice
      renderDispatches(containerElement, FALLBACK_DISPATCHES, true);
    }
  };

  /**
   * Renders dispatch items safely using DOM nodes (no innerHTML)
   */
  const renderDispatches = (container, items, isFallback) => {
    container.textContent = '';

    if (isFallback) {
      const offlineNotice = document.createElement('div');
      offlineNotice.className = 'text-xs text-muted';
      offlineNotice.style.marginBottom = '1rem';
      offlineNotice.textContent = 'ℹ️ Note: Currently showing cached client growth spotlights (offline fallback enabled).';
      container.appendChild(offlineNotice);
    }

    const grid = document.createElement('div');
    grid.className = 'grid-3';

    items.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'card card-hover';

      const tag = document.createElement('span');
      tag.className = 'badge badge-teal';
      tag.style.alignSelf = 'flex-start';
      tag.style.marginBottom = '0.75rem';
      tag.textContent = 'Spotlight';

      const title = document.createElement('h4');
      title.style.fontSize = '1.05rem';
      title.style.marginBottom = '0.5rem';
      title.textContent = item.title;

      const body = document.createElement('p');
      body.className = 'text-sm text-secondary';
      body.style.marginBottom = '1rem';
      body.textContent = item.body;

      const footer = document.createElement('div');
      footer.style.marginTop = 'auto';
      footer.style.paddingTop = '0.75rem';
      footer.style.borderTop = '1px solid var(--border-light)';
      footer.style.display = 'flex';
      footer.style.justifyContent = 'space-between';
      footer.style.fontSize = '0.75rem';
      footer.style.color = 'var(--text-muted)';

      const authorSpan = document.createElement('span');
      authorSpan.style.fontWeight = '600';
      authorSpan.textContent = item.author;

      const locationSpan = document.createElement('span');
      locationSpan.textContent = item.location;

      footer.appendChild(authorSpan);
      footer.appendChild(locationSpan);

      card.appendChild(tag);
      card.appendChild(title);
      card.appendChild(body);
      card.appendChild(footer);

      grid.appendChild(card);
    });

    container.appendChild(grid);
  };

  const init = () => {
    const feedContainer = document.getElementById('apiDispatchesFeed');
    if (feedContainer) {
      fetchRecentDispatches(feedContainer);
    }
  };

  return {
    init,
    fetchRecentDispatches
  };
})();

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ApiService.init);
} else {
  ApiService.init();
}

window.ApiService = ApiService;
