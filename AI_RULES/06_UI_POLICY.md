# UI Policy

## Strict Rules

### 1. Never Redesign
- Do not suggest or implement visual redesigns unless explicitly requested
- Do not change colors, spacing, fonts, or layout without instruction
- Do not "improve" the UI as a side effect of other changes

### 2. Match Existing Style
- All new UI must match the existing component library
- Use existing Tailwind classes, not new custom CSS
- Use existing color variables (`primary-600`, `neutral-800`, etc.)
- Use existing font classes (`font-heading`, `font-body`)

### 3. Component Reuse
- Check for existing components before creating new ones
- Use `Badge`, `Button`, `Stars`, `Modal` from `src/components/ui/`
- Extend existing components with props, don't duplicate

### 4. No Framework Changes
- Do not add new UI frameworks (no ShadCN, Chakra, MUI unless asked)
- Do not add new icon libraries unless specifically requested
- TailwindCSS v4 is the styling solution

### 5. Responsive
- All UI must work on desktop, tablet, and mobile
- Use Tailwind responsive prefixes (`md:`, `lg:`)
- Test with `npx next build` to catch compilation errors
