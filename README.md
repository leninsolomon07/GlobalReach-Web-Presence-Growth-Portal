# GlobalReach Web Presence & Growth Portal

> **“Take your business beyond borders.”**  
> A modern, accessible, and responsive static web portal designed for small businesses, independent professionals, local shops, and creative studios.

---

## 📌 Project Purpose

**GlobalReach** helps visitors understand how a credible, well-engineered website can improve visibility, credibility, customer enquiries, and growth opportunities across regional and global markets.

> *Core principle: A stronger online presence can help your business reach more potential customers and generate more enquiries.*

---

## ✨ Feature List

1. **Responsive Multi-Device Layout:**
   - Pixel-perfect experience across **320px**, **768px**, **1024px**, and wide desktop viewports.
   - Semantic HTML5 (`header`, `nav`, `main`, `section`, `article`, `footer`).
   - Accessible hamburger drawer on mobile with ARIA compliance (`aria-expanded`, keyboard ESC handling).

2. **Interactive Project Cost Calculator:**
   - Built on our transparent **₹800 per hour** benchmark.
   - Presets for custom websites, e-commerce shops, portfolios, landing pages, and web apps.
   - Optional modular add-ons: Responsive Mobile PWA, 1-Year Maintenance, 7-Day Express Delivery, Multilingual SEO.
   - Real-time client-side calculation with zero unsafe `eval()`.
   - Automatic persistence of the latest estimate into `localStorage`.

3. **Transparent Pricing Models:**
   - **Hourly Engagement:** ₹800/hour flexible billing.
   - **Fixed Bundles:**
     - **Starter:** ₹9,999 (3-page core presence)
     - **Growth (Most Popular):** ₹24,999 (6-page presence with lead capture & search setup)
     - **Global:** ₹49,999 (12-page multilingual showcase)

4. **3-Year Website Support Guarantee:**
   - Complete coverage: implementation defect resolution, minor content updates, and technical guidance for 3 years.
   - Explicit exclusions: third-party hosting outages, major new redesigns, domain renewal fees, client-caused alterations, and guaranteed sales/profit outcomes.

5. **Client Authentication & Portals:**
   - `register.html`: Comprehensive client onboarding with strict regex validation (`fullName`, `empId`, `email`, `mobile`, `dept`, `password`, `confirmPassword`). Real-time inline feedback and live submit-button state toggle.
   - `signup.html`: Lightweight quick onboarding.
   - `signin.html`: Login interface with show/hide password eye toggle, error banners, and demo client access (`demo@globalreach.com` / `Demo@2026!`).
   - `home.html`: High-productivity client dashboard utilizing CSS Grid (`grid-template-columns: 250px 1fr 300px;` on desktop >= 768px and stacked Flexbox on mobile < 768px).

6. **Interactive Floating Chatbot (`ReachBot`):**
   - Floating Action Button (FAB) anchored at bottom-right.
   - Keyword responses for `pricing`, `bundle`, `hourly`, `guarantee`, `support`, `consultation`, `contact`, and `website`.
   - Chat history preserved across reloads using `localStorage`.
   - Accessible scroll lock, auto-scroll (`scrollTop = scrollHeight`), and clear chat feature.
   - Includes configurable external JavaScript chatbot integration block for seamless Intercom/Crisp/Tawk.to insertion.

7. **Light & Dark Theme Engine (`theme.js`):**
   - CSS custom property design system (`variables.css`).
   - Immediate pre-render application to eliminate theme flicker (FOIT).
   - Synchronized toggle buttons and persistent `localStorage` preference.

8. **Safe REST API Integration (`api.js`):**
   - Live asynchronous fetch from public placeholder API with visual loading spinner and error retry fallback.
   - Safe DOM node generation using `textContent` (zero unsafe `innerHTML`).

---

## 📂 Folder Structure

```text
micro web/
├── index.html              # Main landing page (12 structured sections)
├── register.html           # Multi-field client registration with regex validation
├── signup.html             # Streamlined account onboarding
├── signin.html             # Client login with password reveal & error alerts
├── home.html               # Client dashboard (250px 1fr 300px desktop grid)
├── vercel.json             # Vercel deployment configuration & security headers
├── README.md               # Project documentation & deployment guide
├── css/
│   ├── variables.css       # Design tokens, color palette, dark mode variables
│   ├── layout.css          # Structural containers, navbar, drawer, dashboard grid
│   └── styles.css          # Components, buttons, cards, chatbot, accordions
├── js/
│   ├── storage.js          # Safe localStorage abstraction & fallback store
│   ├── theme.js            # Light/Dark mode manager & OS scheme listener
│   ├── validation.js       # Form validation regex engine & DOM sanitization
│   ├── calculator.js       # ₹800/hr project cost & timeline calculator
│   ├── chatbot.js          # ReachBot floating assistant & keyword engine
│   ├── api.js              # REST API data fetcher with loading/error handling
│   └── app.js              # Navigation, accordions, modals, and portal logic
└── assets/
    └── favicon.svg         # SVG vector favicon and branding mark
```

---

## 💻 How to Run Locally

Because this project is built entirely with vanilla **HTML5, CSS3, and ES6 JavaScript**, it requires **no backend or build tools** (no Node.js or npm needed to run).

### Option 1: Direct File Opening
Double-click `index.html` in Windows Explorer, or right-click `index.html` and select **Open with > Google Chrome** (or Edge / Firefox / Brave).

### Option 2: Using VS Code Live Server
1. Open the folder `H:\WEB TECH\Micro Project\micro web` in Visual Studio Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Click **"Go Live"** in the bottom status bar, or right-click `index.html` and select **"Open with Live Server"**.
4. The site will launch automatically at `http://127.0.0.1:5500/index.html`.

### Option 3: Using Python HTTP Server (if installed)
Open PowerShell in the `micro web` directory and run:
```powershell
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

---

## 🚀 How to Deploy to Vercel

This repository is pre-configured with `vercel.json` for one-click static hosting.

### Method 1: Deploy via GitHub & Vercel Dashboard (Recommended)
1. Initialize Git in the project directory:
   ```powershell
   cd "H:\WEB TECH\Micro Project\micro web"
   git init
   git add .
   git commit -m "feat: initial GlobalReach web presence portal release"
   ```
2. Create a new repository on [GitHub](https://github.com/new) (e.g., `globalreach-portal`).
3. Link and push your local branch:
   ```powershell
   git remote add origin https://github.com/leninsolomon07/GlobalReach-Web-Presence-Growth-Portal.git
   git branch -M main
   git push -u origin main
   ```
4. Sign in to [Vercel](https://vercel.com).
5. Click **"Add New Project"**, select your GitHub repository `GlobalReach-Web-Presence-Growth-Portal`.
6. Leave the default settings (Framework Preset: **Other**, Root Directory: `./`).
7. Click **Deploy**. Your website will be live with HTTPS in under 30 seconds!

### Method 2: Deploy via Vercel CLI
If you have Vercel CLI installed:
```powershell
vercel login
vercel --prod
```

### Deployment URLs
- **GitHub Repository:** `https://github.com/leninsolomon07/GlobalReach-Web-Presence-Growth-Portal`
- **Vercel Live URL:** `https://globalreach-portal.vercel.app`

---

## 🛡️ Three-Year Support Guarantee Summary

| Guarantee Dimension | Included Coverage | Exclusions / Limitations |
| :--- | :--- | :--- |
| **Defect Remediation** | Fixing implementation bugs, CSS alignment flaws, and broken form scripts in delivered code. | Bugs resulting from client modifications, external plugins, or third-party code tampering. |
| **Content Updates** | Minor text updates, phone number/email changes, operating hour edits, and address revisions. | Structural rebuilds, major page additions, or complete redesigns outside original scope. |
| **Guidance & Advisory** | Email assistance regarding web operations, DNS guidance, and browser compatibility patches. | Third-party cloud hosting/server outages, domain registrar expirations, or renewal fees. |
| **Commercial Outcome** | Guidance on maximizing reach and visitor enquiry pathways. | No guarantee of commercial sales volumes, search ranking positions, or profit increases. |

---

## 🧪 Testing Checklist

- [x] **Responsive Viewport Testing:** Verified layouts at **320px** (small phones), **768px** (tablets/drawers), **1024px** (laptops), and **1440px** (desktops).
- [x] **CSS Grid & Flexbox Verification:** Dashboard displays `grid-template-columns: 250px 1fr 300px;` on desktop and switches to stacked `flex-direction: column;` on screens below 768px.
- [x] **Form Validation Regex Checks:**
  - Full Name: `/^[a-zA-Z\s]{2,50}$/`
  - Employee ID: `/^[A-Z0-9]{6,12}$/i`
  - Email: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`
  - Mobile: `/^[6-9]\d{9}$/`
  - Password: 8+ chars with uppercase, lowercase, digit, and symbol from `@$!%*?&`.
- [x] **Submit Button State:** Remains disabled until all required fields pass validation.
- [x] **Cost Calculator Integrity:** Handles zero, negative values, and non-numeric inputs gracefully without division errors or `eval()`.
- [x] **Theme Persistence:** Theme switch persists in `localStorage` and loads instantly across all five pages without flicker.
- [x] **Chatbot Functionality:** Responds accurately to `pricing`, `bundle`, `hourly`, `guarantee`, `support`, `consultation`, `contact`, and `website`.
- [x] **Security / XSS Protection:** All dynamic content is rendered through `textContent` and sanitized DOM elements; no unsafe `innerHTML`.

---

## 👥 Project Team Roles

- **Project Manager:** Schedule, scope governance, cost estimation, and delivery coordination.
- **Product Manager:** Fixed bundles definition, customer discovery, and value articulation.
- **UI/UX Engineer:** Figma wireframes, responsive design system, and WCAG accessibility.
- **Quality Assurance Engineer:** Regex validation, cross-browser compatibility, and viewport audits.
- **DevOps Engineer:** Git version control branching and Vercel cloud deployment.
- **Security Analyst:** Input sanitization, XSS mitigation, and safe DOM manipulation.

---
*Created for the Web Technology Micro Project Coursework.*
