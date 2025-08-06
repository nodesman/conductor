# Example: The Inconsistent UI

## The Scenario

A developer is building a new e-commerce website. They ask the AI to "create a product details page" and then, in a separate session, to "build the shopping cart page."

The developer has a specific brand identity in mind: minimalist, with a defined color palette (e.g., shades of blue and grey) and a preference for a specific font. They also want a consistent layout, with primary action buttons always appearing in the top-right corner.

Because this context was never explicitly provided or stored, the AI approaches each request as an independent task.

## The Cost

1.  **A Patchwork of Styles:**
    *   For the product page, the AI uses a popular CSS framework like **Bootstrap**, creating blue, square-edged buttons and a standard grid layout.
    *   For the shopping cart page, it decides to use **Tailwind CSS** utility classes, resulting in grey, rounded buttons and a different spacing system.
    *   The font is different on each page. The heading sizes don't match. The overall look is disjointed and unprofessional.

2.  **Manual, Tedious Rework:** The developer now has to manually refactor the CSS for both pages. They have to go through the generated code, overriding styles, adjusting classes, and enforcing a consistent design system that should have been in place from the beginning.

3.  **Increased Complexity:** The final project now contains two different CSS frameworks, increasing the bundle size and making future maintenance more complex. A new developer joining the project would be confused by the conflicting styles.

4.  **Erosion of Brand Identity:** The final product looks amateurish and fails to convey the intended minimalist, professional brand identity. This can directly impact user trust and sales.

## How the Scaffolder Helps

The Scaffolder would have prompted the developer with a question like: *"Are there any specific UI/UX design preferences? (e.g., minimalist, Material Design, a specific brand guide)"*.

The developer's answer—"Minimalist design, use the 'Inter' font, primary color #2563eb, and all primary buttons should be top-right"—would be saved. The AI would then use this **single source of truth** for every UI component it generates, ensuring a consistent, professional, and on-brand user experience from the start.
