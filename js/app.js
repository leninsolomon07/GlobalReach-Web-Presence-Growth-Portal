/**
 * GlobalReach Web Presence & Growth Portal
 * Core Application Logic, UI Interactivity & Navigation
 * File: js/app.js
 */

const App = (() => {
  /**
   * Mobile Hamburger Navigation Drawer Controller
   */
  const initMobileNav = () => {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const drawer = document.querySelector('.mobile-drawer');
    const overlay = document.querySelector('.mobile-drawer-overlay');
    const navLinks = document.querySelectorAll('.mobile-nav-link');

    if (!toggleBtn || !drawer) return;

    const openDrawer = () => {
      drawer.classList.add('open');
      if (overlay) overlay.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeDrawer);
    }

    navLinks.forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
        toggleBtn.focus();
      }
    });
  };

  /**
   * FAQ Accordions with ARIA
   */
  const initFaqAccordions = () => {
    const faqButtons = document.querySelectorAll('.faq-question-btn');
    if (!faqButtons.length) return;

    faqButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        const panel = btn.nextElementSibling;

        // Optional: close other panels for clean accordion behavior
        faqButtons.forEach((otherBtn) => {
          if (otherBtn !== btn) {
            otherBtn.setAttribute('aria-expanded', 'false');
            if (otherBtn.nextElementSibling) {
              otherBtn.nextElementSibling.classList.remove('open');
              otherBtn.nextElementSibling.style.maxHeight = null;
            }
          }
        });

        if (isExpanded) {
          btn.setAttribute('aria-expanded', 'false');
          if (panel) {
            panel.classList.remove('open');
            panel.style.maxHeight = null;
          }
        } else {
          btn.setAttribute('aria-expanded', 'true');
          if (panel) {
            panel.classList.add('open');
            panel.style.maxHeight = panel.scrollHeight + 'px';
          }
        }
      });
    });
  };

  /**
   * Password Visibility Eye Toggle
   */
  const initPasswordToggles = () => {
    const toggleButtons = document.querySelectorAll('.password-toggle-btn');
    toggleButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target') || 'password';
        const input = document.getElementById(targetId);
        if (!input) return;

        const isPassword = input.getAttribute('type') === 'password';
        input.setAttribute('type', isPassword ? 'text' : 'password');
        btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        btn.setAttribute('title', isPassword ? 'Hide password' : 'Show password');

        // Toggle icon visually
        const eyeOpen = btn.querySelector('.icon-eye');
        const eyeSlash = btn.querySelector('.icon-eye-slash');
        if (eyeOpen && eyeSlash) {
          eyeOpen.style.display = isPassword ? 'none' : 'block';
          eyeSlash.style.display = isPassword ? 'block' : 'none';
        }
      });
    });
  };

  /**
   * Contact & Consultation Form Handler
   */
  const initContactForm = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const alertBanner = document.getElementById('contactAlertBanner');

    if (window.FormValidator) {
      window.FormValidator.bindForm(form, submitBtn);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
      let isValid = true;

      requiredInputs.forEach((input) => {
        if (!window.FormValidator.validateField(input, form)) {
          isValid = false;
        }
      });

      if (!isValid) {
        if (alertBanner) {
          alertBanner.className = 'alert-banner alert-danger show';
          alertBanner.textContent = 'Please review and correct the highlighted fields before submitting.';
        }
        return;
      }

      // Collect sanitized enquiry data
      const enquiry = {
        name: window.FormValidator.sanitize(form.querySelector('#contactName')?.value || ''),
        email: window.FormValidator.sanitize(form.querySelector('#contactEmail')?.value || ''),
        phone: window.FormValidator.sanitize(form.querySelector('#contactPhone')?.value || ''),
        businessType: window.FormValidator.sanitize(form.querySelector('#contactBusinessType')?.value || ''),
        serviceInterest: window.FormValidator.sanitize(form.querySelector('#contactService')?.value || ''),
        message: window.FormValidator.sanitize(form.querySelector('#contactMessage')?.value || ''),
        submittedAt: new Date().toISOString()
      };

      // Save to localStorage enquiries
      if (window.StorageService) {
        const list = window.StorageService.get(window.StorageService.KEYS.ENQUIRIES, []);
        list.push(enquiry);
        window.StorageService.set(window.StorageService.KEYS.ENQUIRIES, list);
      }

      // Show simulated confirmation feedback
      if (alertBanner) {
        alertBanner.className = 'alert-banner alert-success show';
        alertBanner.textContent = `Thank you, ${enquiry.name}! Your consultation request has been recorded. Our team will contact you at ${enquiry.email} within 24 business hours.`;
      }

      form.reset();
      form.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));
      if (submitBtn) {
        submitBtn.setAttribute('disabled', 'disabled');
      }
    });
  };

  /**
   * Registration Page Handler (register.html)
   */
  const initRegisterPage = () => {
    const form = document.getElementById('registrationForm');
    if (!form) return;

    const submitBtn = document.getElementById('registerSubmitBtn');
    const alertBanner = document.getElementById('registerAlert');

    if (window.FormValidator) {
      window.FormValidator.bindForm(form, submitBtn);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputs = form.querySelectorAll('input[required], select[required]');
      let formValid = true;

      inputs.forEach((input) => {
        if (!window.FormValidator.validateField(input, form)) {
          formValid = false;
        }
      });

      if (!formValid) {
        if (alertBanner) {
          alertBanner.className = 'alert-banner alert-danger show';
          alertBanner.textContent = 'Please correct the invalid fields above.';
        }
        return;
      }

      // Non-sensitive user profile details stored safely
      const profile = {
        fullName: window.FormValidator.sanitize(document.getElementById('fullName').value),
        empId: window.FormValidator.sanitize(document.getElementById('empId').value.toUpperCase()),
        email: window.FormValidator.sanitize(document.getElementById('email').value.toLowerCase()),
        mobile: window.FormValidator.sanitize(document.getElementById('mobile').value),
        division: window.FormValidator.sanitize(document.getElementById('dept').value),
        registeredAt: new Date().toISOString(),
        role: 'Client Member',
        currentPackage: 'Growth Bundle'
      };

      if (window.StorageService) {
        window.StorageService.set(window.StorageService.KEYS.USER, profile);
        window.StorageService.set(window.StorageService.KEYS.SESSION, {
          isLoggedIn: true,
          email: profile.email,
          name: profile.fullName,
          loginTime: new Date().toISOString()
        });
      }

      if (alertBanner) {
        alertBanner.className = 'alert-banner alert-success show';
        alertBanner.textContent = 'Registration successful! Redirecting to your dashboard...';
      }

      setTimeout(() => {
        window.location.href = 'home.html';
      }, 1000);
    });
  };

  /**
   * Sign-Up Page Handler (signup.html)
   */
  const initSignupPage = () => {
    const form = document.getElementById('signupForm');
    if (!form) return;

    const submitBtn = document.getElementById('signupSubmitBtn');
    const alertBanner = document.getElementById('signupAlert');

    if (window.FormValidator) {
      window.FormValidator.bindForm(form, submitBtn);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputs = form.querySelectorAll('input[required]');
      let formValid = true;

      inputs.forEach((input) => {
        if (!window.FormValidator.validateField(input, form)) {
          formValid = false;
        }
      });

      if (!formValid) {
        if (alertBanner) {
          alertBanner.className = 'alert-banner alert-danger show';
          alertBanner.textContent = 'Please verify all inputs before proceeding.';
        }
        return;
      }

      const fullName = window.FormValidator.sanitize(document.getElementById('fullName').value);
      const email = window.FormValidator.sanitize(document.getElementById('email').value.toLowerCase());

      const userProfile = {
        fullName,
        email,
        empId: 'GR' + Math.floor(100000 + Math.random() * 900000),
        division: 'Business Owner',
        registeredAt: new Date().toISOString(),
        role: 'Standard Client',
        currentPackage: 'Starter Bundle'
      };

      if (window.StorageService) {
        window.StorageService.set(window.StorageService.KEYS.USER, userProfile);
        window.StorageService.set(window.StorageService.KEYS.SESSION, {
          isLoggedIn: true,
          email,
          name: fullName,
          loginTime: new Date().toISOString()
        });
      }

      if (alertBanner) {
        alertBanner.className = 'alert-banner alert-success show';
        alertBanner.textContent = 'Account created successfully! Redirecting to client portal...';
      }

      setTimeout(() => {
        window.location.href = 'home.html';
      }, 800);
    });
  };

  /**
   * Sign-In Page Handler (signin.html)
   */
  const initSigninPage = () => {
    const form = document.getElementById('signinForm');
    if (!form) return;

    const alertBanner = document.getElementById('signinAlert');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('signinEmail');
      const passwordInput = document.getElementById('signinPassword');
      const rememberCheckbox = document.getElementById('rememberMe');

      const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
      const password = passwordInput ? passwordInput.value : '';

      if (!email || !password) {
        if (alertBanner) {
          alertBanner.className = 'alert-banner alert-danger show';
          alertBanner.textContent = 'Please enter both your registered email and password.';
        }
        return;
      }

      // Check stored user or accept demo client login
      let user = null;
      if (window.StorageService) {
        user = window.StorageService.get(window.StorageService.KEYS.USER, null);
      }

      // Demo login allowance: if matches registered or demo credentials
      const isDemo = (email === 'demo@globalreach.com' && password.length >= 8);
      const isRegistered = user && user.email === email && password.length >= 8;

      if (isDemo || isRegistered) {
        const clientName = user ? user.fullName : 'Valued Client';
        if (window.StorageService) {
          window.StorageService.set(window.StorageService.KEYS.SESSION, {
            isLoggedIn: true,
            email,
            name: clientName,
            remember: rememberCheckbox ? rememberCheckbox.checked : false,
            loginTime: new Date().toISOString()
          });
        }

        if (alertBanner) {
          alertBanner.className = 'alert-banner alert-success show';
          alertBanner.textContent = `Welcome back, ${clientName}! Redirecting to your dashboard...`;
        }

        setTimeout(() => {
          window.location.href = 'home.html';
        }, 800);
      } else {
        if (alertBanner) {
          alertBanner.className = 'alert-banner alert-danger show';
          alertBanner.textContent = 'Invalid credentials. If you are new, please register an account or use demo credentials (demo@globalreach.com).';
        }
      }
    });
  };

  /**
   * Client Dashboard Handler (home.html)
   */
  const initDashboard = () => {
    const dashboardRoot = document.getElementById('clientDashboard');
    if (!dashboardRoot) return;

    let user = null;
    let session = null;
    let estimate = null;

    if (window.StorageService) {
      user = window.StorageService.get(window.StorageService.KEYS.USER, null);
      session = window.StorageService.get(window.StorageService.KEYS.SESSION, null);
      estimate = window.StorageService.get(window.StorageService.KEYS.ESTIMATE, null);
    }

    // Set Welcome Name
    const welcomeName = document.getElementById('dashWelcomeName');
    const clientName = (user && user.fullName) || (session && session.name) || 'Valued Partner';
    if (welcomeName) {
      welcomeName.textContent = clientName;
    }

    // Client ID & Division
    const clientDept = document.getElementById('dashClientDept');
    if (clientDept && user && user.division) {
      clientDept.textContent = `${user.division} (${user.empId || 'GR-2026'})`;
    }

    // Saved Estimate Card
    const savedEstimateContainer = document.getElementById('dashSavedEstimate');
    if (savedEstimateContainer) {
      if (estimate && estimate.isValid) {
        savedEstimateContainer.innerHTML = ''; // safe since we build elements
        const title = document.createElement('h5');
        title.style.fontSize = '1.05rem';
        title.textContent = estimate.serviceName;

        const costP = document.createElement('p');
        costP.className = 'text-accent';
        costP.style.fontSize = '1.4rem';
        costP.style.fontWeight = 'bold';
        costP.textContent = ProjectCalculator ? ProjectCalculator.formatINR(estimate.totalCost) : `₹${estimate.totalCost}`;

        const metaP = document.createElement('p');
        metaP.className = 'text-xs text-muted';
        metaP.textContent = `${estimate.hours} hours development • ${estimate.timeline} estimated timeline`;

        const link = document.createElement('a');
        link.href = 'index.html#calculator';
        link.className = 'btn btn-outline btn-sm';
        link.style.marginTop = '0.5rem';
        link.textContent = 'Adjust in Calculator';

        savedEstimateContainer.appendChild(title);
        savedEstimateContainer.appendChild(costP);
        savedEstimateContainer.appendChild(metaP);
        savedEstimateContainer.appendChild(link);
      } else {
        savedEstimateContainer.textContent = '';
        const emptyP = document.createElement('p');
        emptyP.className = 'text-sm text-secondary';
        emptyP.textContent = 'No custom project estimate saved yet. Explore our interactive estimator to calculate your bespoke project investment.';

        const calcLink = document.createElement('a');
        calcLink.href = 'index.html#calculator';
        calcLink.className = 'btn btn-primary btn-sm';
        calcLink.style.marginTop = '0.75rem';
        calcLink.textContent = 'Open Project Calculator';

        savedEstimateContainer.appendChild(emptyP);
        savedEstimateContainer.appendChild(calcLink);
      }
    }

    // Logout Button
    const logoutBtn = document.getElementById('dashLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.StorageService) {
          window.StorageService.remove(window.StorageService.KEYS.SESSION);
        }
        window.location.href = 'signin.html';
      });
    }
  };

  /**
   * Main App Initialization
   */
  const init = () => {
    initMobileNav();
    initFaqAccordions();
    initPasswordToggles();
    initContactForm();
    initRegisterPage();
    initSignupPage();
    initSigninPage();
    initDashboard();
  };

  return {
    init
  };
})();

// Initialize once DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', App.init);
} else {
  App.init();
}

window.App = App;
