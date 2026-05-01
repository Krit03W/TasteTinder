---
name: TasteTinder
colors:
  surface: '#fbfaee'
  surface-dim: '#dbdbcf'
  surface-bright: '#fbfaee'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f4e8'
  surface-container: '#efeee3'
  surface-container-high: '#e9e9dd'
  surface-container-highest: '#e4e3d7'
  on-surface: '#1b1c15'
  on-surface-variant: '#57423b'
  inverse-surface: '#303129'
  inverse-on-surface: '#f2f1e5'
  outline: '#8b7169'
  outline-variant: '#dec0b6'
  surface-tint: '#a43c12'
  primary: '#a43c12'
  on-primary: '#ffffff'
  primary-container: '#ff7f50'
  on-primary-container: '#6c2000'
  inverse-primary: '#ffb59c'
  secondary: '#904d00'
  on-secondary: '#ffffff'
  secondary-container: '#fd8b00'
  on-secondary-container: '#603100'
  tertiary: '#62603d'
  on-tertiary: '#ffffff'
  tertiary-container: '#a9a57d'
  on-tertiary-container: '#3d3b1c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59c'
  on-primary-fixed: '#380c00'
  on-primary-fixed-variant: '#822800'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77d'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#e9e4b8'
  tertiary-fixed-dim: '#ccc89e'
  on-tertiary-fixed: '#1e1c03'
  on-tertiary-fixed-variant: '#4a4828'
  background: '#fbfaee'
  on-background: '#1b1c15'
  surface-variant: '#e4e3d7'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-padding: 20px
  stack-gap: 16px
---

## Brand & Style

This design system is built to evoke the warmth of Thai hospitality and the excitement of discovery. The brand personality is adventurous yet comforting, acting as a friendly local guide that is both enthusiastic and reliable. The target audience includes modern travelers and food enthusiasts looking for an accessible, joyful way to navigate Thailand’s culinary and scenic landscapes.

The visual style is **Soft-Minimalism with Tactile Depth**. It avoids the sterility of traditional flat design by utilizing organic, highly rounded shapes and layered shadows to create a sense of physical presence. The interface should feel "bouncy" and responsive, using subtle gradients to mimic the natural glow of a sunset. The background remains clean and breathable to ensure that high-vibrancy photography of street food and landmarks remains the focal point.

## Colors

The palette is inspired by the "Golden Hour" in Thailand. 

- **Primary (Coral):** Used for main actions, active states, and brand-heavy elements. It provides a modern, energetic pulse to the UI.
- **Secondary (Sun-kissed Orange):** Used for secondary interactions and highlighting key information like ratings or price levels.
- **Tertiary (Soft Yellow):** Used for subtle backgrounds, tag containers, and de-emphasized cards.
- **Neutral (Cream White):** The foundational background color (#FDFCF0). It is warmer than pure white, reducing eye strain and reinforcing the "friendly" aesthetic.
- **Surface Colors:** Use semi-transparent white overlays on top of images to ensure text legibility while maintaining the vibrant color of the photography.

## Typography

This design system utilizes **Plus Jakarta Sans** for its balanced, modern, and slightly rounded letterforms which perfectly align with the highly rounded UI elements. 

- **Headlines:** Use Bold or ExtraBold weights with tighter letter spacing to create a high-impact, editorial feel for destination names and food titles.
- **Body Text:** Use Medium weight for primary descriptions to maintain readability against the warm background.
- **Labels:** Use SemiBold with slight tracking (letter spacing) for small metadata like "Distance" or "Open Now" to ensure clarity at small scales.

## Layout & Spacing

The layout follows a **Fluid Content Model** with generous internal padding to create a sense of luxury and ease. 

- **Rhythm:** An 8px base grid governs all dimensions.
- **Margins:** Use a standard 20px side margin for mobile views to keep content centered but breathable.
- **Gaps:** Vertical stacks should favor a 16px or 24px gap to prevent the UI from feeling cluttered.
- **Padding:** Content inside cards must have a minimum of 24px padding to match the large exterior corner radius.

## Elevation & Depth

Hierarchy is established through **Ambient, Multi-layered Shadows** rather than harsh lines.

- **Soft Depth:** Use a primary shadow with a large blur (30px-40px) and low opacity (10%), tinted with a touch of the Primary Coral color to keep shadows from looking "dirty" on the cream background.
- **Floating Elements:** Key action buttons (FABs) and the primary "Match" cards should use a secondary, tighter shadow layered underneath the ambient one to suggest they are physically higher in the stack.
- **Gradients:** Apply very subtle linear gradients (top-left to bottom-right) on interactive surfaces to give them a slight 3D "pill" volume.

## Shapes

The shape language is the defining characteristic of this design system. It is **Exaggeratedly Rounded** to communicate friendliness and safety.

- **Component Radius:** All main containers and cards must use a radius of 24px or 32px.
- **Buttons:** Primary buttons should be fully pill-shaped (rounded-full).
- **Images:** Photography must always follow the container's corner radius; never use sharp-edged images.
- **Interactive States:** When an item is pressed, it should subtly "shrink" (scale 0.98) to emphasize the tactile, squishy nature of the UI.

## Components

- **Swipe Cards:** The centerpiece of the experience. These must feature edge-to-edge high-quality imagery with a Soft Yellow to Transparent gradient overlay at the bottom to house white typography.
- **Action Buttons:** Large, circular buttons for "Pass" or "Like" interactions, utilizing the multi-layered shadow system and Soft-Minimalist gradients.
- **Discovery Chips:** Small, highly rounded capsules used for food categories (e.g., "Spicy," "Street Food"). Use Soft Yellow backgrounds with Sun-kissed Orange text.
- **Search Bar:** A deep-set, pill-shaped input with a subtle inner shadow to look recessed into the cream background.
- **Lists:** Use "Tiles" rather than simple rows, where each list item is its own rounded card with a soft shadow.
- **Navigation Bar:** A floating, blurred glass (Glassmorphism) bottom bar that allows the vibrant colors of the scrollable content to peek through while keeping navigation icons clear.
