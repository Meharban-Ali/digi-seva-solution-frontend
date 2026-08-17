# Digi Seva Solution — Brand Assets & Crest Emblem Reference

This document serves as the single source of truth for the official **Digi Seva Solution (जन सेवा केंद्र)** brand identity, emblem specifications, dual-version SVG architecture, color codes, and usage guidelines.

---

## 1. Brand Concept & Crest Anatomy

The brand identity features a classic **Shield/Crest Emblem** incorporating 5 core design elements:

1. **Classic Crest/Shield Outer Silhouette**  
   Rounded pentagon-ish badge contour tapering smoothly to a bottom point — signifying official government service authority, data security, and Jan Seva Kendra trust.
2. **Dimensional Layered "DS" Monogram**  
   A stylized interlocking "DS" (Digi Seva) monogram featuring a 3D layered structure: a lighter sky-blue foreground letterform (`#38BDF8`) set over a darker navy background layer (`#020617` / `#1E293B`) to create depth and spatial hierarchy.
3. **Dynamic Gold/Amber Swoosh**  
   A curved, flowing gold ribbon passing behind the monogram — representing speed, digital connectivity, and fast service processing.
4. **Digital Tech Circuit Nodes**  
   Subtle circuit-board trace lines and connection dots (`#FDE047`) integrated into the tail of the gold swoosh — denoting modern IT and web development capabilities.
5. **Crowning 4-Point Gold Star**  
   A 4-point gold star emblem at the apex of the shield — symbolizing guidance, excellence, and CSC accreditation.

---

## 2. Dual-Version System Architecture

To ensure flawless visual clarity across all display mediums, two official variations have been crafted:

### A. Detailed / Full Brand Version
- **Intended Use**: Large displays, standalone social media profile pictures (WhatsApp Business, Google Business Profile), printed marketing collateral (visiting cards, shopfront vinyl banners, official invoices, letterheads).
- **Features**: Includes full 3D monogram shadow layers, metallic gradient rims, dynamic gold swoosh, tech circuit nodes, crowning star, and full text lockup ("DIGI SEVA" + "SOLUTION" + "GOVERNMENT & DIGITAL SERVICES").

### B. Simplified / Functional Version
- **Intended Use**: Compact UI displays (Website Navbar height 32–40px, browser favicons 16–64px, PWA launcher icons, mobile app bookmarks).
- **Features**: Retains the iconic shield silhouette, high-contrast bold "DS" monogram, clean gold swoosh, and crowning star while stripping away micro circuit dots and 3D shadows that would create visual noise at small pixel dimensions.

---

## 3. Official Brand Palette

| Token Name | Hex Code | Usage Context |
| :--- | :--- | :--- |
| **Deep Navy (Shield Base)** | `#0F172A` | Primary shield background bed, dark text |
| **Royal Indigo (Shield Mid)** | `#1E3A8A` | Shield gradient mid-tone, primary brand elements |
| **Electric Royal Blue** | `#2563EB` | Active buttons, primary links, shield light edge |
| **Sky Blue (Monogram Fg)** | `#38BDF8` / `#60A5FA` | Interlocking 'D' letterform foreground |
| **Warm Gold / Amber** | `#F59E0B` | Dynamic swoosh, 'S' monogram ribbon, "SOLUTION" text |
| **Deep Amber Gold** | `#D97706` | Gold gradient shading, border accents |
| **Bright Canary Yellow** | `#FDE047` | Circuit nodes, crowning star center |

---

## 4. Project File Map & Asset Locations

All files live in `digi-seva-solution-frontend`:

| Asset Name | Path | Dimensions / Type | Version & Primary Use Case |
| :--- | :--- | :--- | :--- |
| **Detailed Icon SVG** | [`/public/assets/logo-icon-detailed.svg`](file:///D:/Meharban-code/digi-seva-solution-frontend/public/assets/logo-icon-detailed.svg) | Scalable SVG | **Detailed**: Master standalone icon |
| **Detailed Lockup SVG** | [`/public/assets/logo-lockup-detailed.svg`](file:///D:/Meharban-code/digi-seva-solution-frontend/public/assets/logo-lockup-detailed.svg) | Scalable SVG | **Detailed**: Master full lockup for print |
| **Simplified Icon SVG** | [`/public/assets/logo-icon-simplified.svg`](file:///D:/Meharban-code/digi-seva-solution-frontend/public/assets/logo-icon-simplified.svg) | Scalable SVG | **Simplified**: Master UI/navbar icon |
| **Simplified Lockup SVG** | [`/public/assets/logo-lockup-simplified.svg`](file:///D:/Meharban-code/digi-seva-solution-frontend/public/assets/logo-lockup-simplified.svg) | Scalable SVG | **Simplified**: Compact navbar lockup |
| **512px Detailed Icon** | [`/public/assets/logo-icon-512x512.png`](file:///D:/Meharban-code/digi-seva-solution-frontend/public/assets/logo-icon-512x512.png) | 512×512 PNG | **Detailed**: High-res social profile pic |
| **192px Detailed Icon** | [`/public/assets/logo-icon-192x192.png`](file:///D:/Meharban-code/digi-seva-solution-frontend/public/assets/logo-icon-192x192.png) | 192×192 PNG | **Detailed**: Social avatar / thumbnails |
| **1200px Detailed Lockup** | [`/public/assets/logo-lockup-1200x380.png`](file:///D:/Meharban-code/digi-seva-solution-frontend/public/assets/logo-lockup-1200x380.png) | 1200×380 PNG | **Detailed**: Print, banners, letterhead |
| **512px Simplified Icon** | [`/public/assets/logo-icon-simplified-512x512.png`](file:///D:/Meharban-code/digi-seva-solution-frontend/public/assets/logo-icon-simplified-512x512.png) | 512×512 PNG | **Simplified**: High-res app launcher |
| **PWA 512 Icon** | [`/public/pwa-512x512.png`](file:///D:/Meharban-code/digi-seva-solution-frontend/public/pwa-512x512.png) | 512×512 PNG | **Simplified**: PWA manifest icon |
| **PWA 192 Icon** | [`/public/pwa-192x192.png`](file:///D:/Meharban-code/digi-seva-solution-frontend/public/pwa-192x192.png) | 192×192 PNG | **Simplified**: PWA mobile launcher |
| **Apple Touch Icon** | [`/public/apple-touch-icon.png`](file:///D:/Meharban-code/digi-seva-solution-frontend/public/apple-touch-icon.png) | 180×180 PNG | **Simplified**: iOS bookmark icon |
| **Favicon Vector** | [`/public/favicon.svg`](file:///D:/Meharban-code/digi-seva-solution-frontend/public/favicon.svg) | Scalable SVG | **Simplified**: Browser tab icon |
| **Favicon PNG** | [`/public/favicon.png`](file:///D:/Meharban-code/digi-seva-solution-frontend/public/favicon.png) | 64×64 PNG | **Simplified**: Micro tab fallback |

---

## 5. Usage & Implementation Guidelines

- **Web Application Header (Navbar)**: Use `logo-icon-simplified.svg` or `logo-lockup-simplified.svg` at heights between `32px` and `44px`.
- **Printed Materials (Visiting Cards, Flex Banners)**: Use `logo-lockup-detailed.svg` or `logo-lockup-1200x380.png` to maintain full 3D depth and typography crispness.
- **Social Media Avatars**: Use `logo-icon-512x512.png` (WhatsApp Business, Google Business Profile).
- **Clear Space**: Maintain a minimum margin equal to `25%` of the icon height (`0.25H`) around the emblem on all sides.
