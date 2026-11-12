/**
 * GlobalReach Web Presence & Growth Portal
 * Project Cost Estimator & Calculator
 * File: js/calculator.js
 */

const ProjectCalculator = (() => {
  const HOURLY_RATE = 800; // ₹800 per hour

  const SERVICE_PRESETS = {
    custom_web: { name: 'Full Custom Website Development', baseHours: 25, minHours: 15 },
    ecommerce: { name: 'E-commerce & Product Catalog Store', baseHours: 40, minHours: 25 },
    portfolio: { name: 'Brand & Professional Portfolio', baseHours: 15, minHours: 10 },
    landing: { name: 'High-Conversion Landing Page', baseHours: 12, minHours: 8 },
    webapp: { name: 'Interactive Web Application Prototype', baseHours: 50, minHours: 30 },
    consultation: { name: 'Dedicated Hourly Consultation & Revisions', baseHours: 10, minHours: 2 }
  };

  const ADDONS = {
    mobile_opt: { name: 'Responsive Mobile Optimization & PWA', price: 3500 },
    maintenance_1yr: { name: '1-Year Priority Support & Backups', price: 6000 },
    express_delivery: { name: '7-Day Fast-Track Express Delivery', price: 5000 },
    seo_setup: { name: 'Multilingual Search Optimization (SEO)', price: 4500 },
    domain_setup: { name: 'Domain DNS & SSL Cloudflare Setup', price: 2000 }
  };

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateEstimate = (options) => {
    const { serviceKey, hours, selectedAddons = [] } = options;

    // Validate inputs safely
    const numHours = parseFloat(hours);
    if (isNaN(numHours) || numHours <= 0 || !isFinite(numHours)) {
      return {
        isValid: false,
        error: 'Please enter a valid positive number of development hours (minimum 1 hour).'
      };
    }

    if (numHours > 500) {
      return {
        isValid: false,
        error: 'For projects exceeding 500 hours, please schedule a bespoke enterprise consultation.'
      };
    }

    const serviceInfo = SERVICE_PRESETS[serviceKey] || { name: 'Custom Hourly Package', baseHours: numHours };
    const baseCost = Math.round(numHours * HOURLY_RATE);

    let addonsCost = 0;
    const addonDetails = [];

    selectedAddons.forEach((addonKey) => {
      if (ADDONS[addonKey]) {
        addonsCost += ADDONS[addonKey].price;
        addonDetails.push({
          key: addonKey,
          name: ADDONS[addonKey].name,
          price: ADDONS[addonKey].price
        });
      }
    });

    const totalCost = baseCost + addonsCost;

    // Estimate timeline safely based on 25 productive hours/week
    const estimatedWeeks = Math.max(1, Math.ceil(numHours / 20));
    const timeline = estimatedWeeks === 1 ? '1 to 2 Weeks' : `${estimatedWeeks} to ${estimatedWeeks + 1} Weeks`;

    return {
      isValid: true,
      serviceKey,
      serviceName: serviceInfo.name,
      hours: numHours,
      hourlyRate: HOURLY_RATE,
      baseCost,
      addonsCost,
      addonDetails,
      totalCost,
      timeline,
      timestamp: new Date().toISOString()
    };
  };

  const saveEstimate = (estimate) => {
    if (window.StorageService && estimate.isValid) {
      window.StorageService.set(window.StorageService.KEYS.ESTIMATE, estimate);
    }
  };

  const getSavedEstimate = () => {
    if (window.StorageService) {
      return window.StorageService.get(window.StorageService.KEYS.ESTIMATE, null);
    }
    return null;
  };

  const init = () => {
    const calcForm = document.getElementById('projectCalculatorForm');
    if (!calcForm) return;

    const serviceSelect = document.getElementById('calcServiceSelect');
    const hoursInput = document.getElementById('calcHoursInput');
    const clearBtn = document.getElementById('calcClearBtn');
    const resultBox = document.getElementById('calcResultBox');
    const totalCostDisplay = document.getElementById('calcTotalCost');
    const baseCostDisplay = document.getElementById('calcBaseCost');
    const addonsCostDisplay = document.getElementById('calcAddonsCost');
    const timelineDisplay = document.getElementById('calcTimeline');
    const errorBanner = document.getElementById('calcErrorBanner');
    const savedNotice = document.getElementById('calcSavedBadge');

    // Auto-update hours when service is selected
    if (serviceSelect && hoursInput) {
      serviceSelect.addEventListener('change', () => {
        const key = serviceSelect.value;
        if (SERVICE_PRESETS[key]) {
          hoursInput.value = SERVICE_PRESETS[key].baseHours;
        }
      });
    }

    const renderResult = (estimate) => {
      if (!estimate || !estimate.isValid) {
        if (errorBanner) {
          errorBanner.textContent = estimate ? estimate.error : 'Invalid calculation.';
          errorBanner.style.display = 'block';
        }
        return;
      }

      if (errorBanner) {
        errorBanner.style.display = 'none';
      }

      if (totalCostDisplay) totalCostDisplay.textContent = formatINR(estimate.totalCost);
      if (baseCostDisplay) baseCostDisplay.textContent = `${formatINR(estimate.baseCost)} (${estimate.hours} hrs @ ₹${HOURLY_RATE}/hr)`;
      if (addonsCostDisplay) addonsCostDisplay.textContent = formatINR(estimate.addonsCost);
      if (timelineDisplay) timelineDisplay.textContent = estimate.timeline;

      if (savedNotice) {
        savedNotice.style.display = 'inline-block';
        savedNotice.textContent = `✓ Saved to your local browser (${new Date(estimate.timestamp).toLocaleTimeString()})`;
      }

      if (resultBox) {
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    };

    // Form submit / calculate
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const serviceKey = serviceSelect ? serviceSelect.value : 'custom_web';
      const hours = hoursInput ? hoursInput.value : 25;

      const checkedAddons = [];
      const addonCheckboxes = calcForm.querySelectorAll('input[name="calcAddon"]:checked');
      addonCheckboxes.forEach((cb) => checkedAddons.push(cb.value));

      const estimate = calculateEstimate({
        serviceKey,
        hours,
        selectedAddons: checkedAddons
      });

      if (estimate.isValid) {
        saveEstimate(estimate);
      }
      renderResult(estimate);
    });

    // Clear Button
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        calcForm.reset();
        if (serviceSelect) serviceSelect.value = 'custom_web';
        if (hoursInput) hoursInput.value = 25;
        if (totalCostDisplay) totalCostDisplay.textContent = formatINR(25 * HOURLY_RATE);
        if (baseCostDisplay) baseCostDisplay.textContent = `${formatINR(25 * HOURLY_RATE)} (25 hrs @ ₹${HOURLY_RATE}/hr)`;
        if (addonsCostDisplay) addonsCostDisplay.textContent = '₹0';
        if (timelineDisplay) timelineDisplay.textContent = '1 to 2 Weeks';
        if (errorBanner) errorBanner.style.display = 'none';
        if (savedNotice) savedNotice.style.display = 'none';
      });
    }

    // Check for saved estimate on page load
    const saved = getSavedEstimate();
    if (saved && saved.isValid) {
      if (serviceSelect && saved.serviceKey) serviceSelect.value = saved.serviceKey;
      if (hoursInput && saved.hours) hoursInput.value = saved.hours;

      if (saved.addonDetails) {
        const keys = saved.addonDetails.map(a => a.key);
        const addonCheckboxes = calcForm.querySelectorAll('input[name="calcAddon"]');
        addonCheckboxes.forEach(cb => {
          cb.checked = keys.includes(cb.value);
        });
      }

      renderResult(saved);
      if (savedNotice) {
        savedNotice.textContent = `✓ Loaded previously saved estimate (${new Date(saved.timestamp).toLocaleDateString()})`;
        savedNotice.style.display = 'inline-block';
      }
    }
  };

  return {
    HOURLY_RATE,
    SERVICE_PRESETS,
    ADDONS,
    formatINR,
    calculateEstimate,
    saveEstimate,
    getSavedEstimate,
    init
  };
})();

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ProjectCalculator.init);
} else {
  ProjectCalculator.init();
}

window.ProjectCalculator = ProjectCalculator;
