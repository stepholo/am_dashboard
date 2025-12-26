# **App Name**: TractorLink

## Core Features:

- Firebase Authentication: Secure the dashboard with Google Sign-In, restricting access to users with the @hellotractor.com domain.
- Role-Based Access Control: Implement role-based permissions using Firestore to manage dashboard links (add, edit, delete) for admins and read-only access for viewers.
- Secured Dashboard: Develop a secured dashboard application with protected routes that redirect unauthenticated users to a login page.
- Sidebar Navigation: Create a responsive sidebar navigation layout featuring sections such as PAYG Operations, Invoicing, Tractor Service, Reports, and Utilities.
- Dynamic Dashboard Links: Load dashboard links dynamically from Firestore to support external portals and embedded Google Sheets.
- Link Customization: Enable users to select how each embedded link should open (on dashboard (default), split screen, or new tab). Support new tab on portal and autoamtion urls.
- Split Screen Toggle: Provide an interface for split screen options and swap sides on embedded links

## Style Guidelines:

- Primary color: Hello Tractor orange (#FF481D) to reflect the brand's identity and evoke a sense of energy and action. It ensures the app's branding is immediately recognizable, fostering a sense of trust and reliability for its users.
- Background color: Light grey (#F5F5F5), which provides a clean and neutral backdrop that doesn't distract from the content. Its subtle tint offers a gentle contrast to the Hello Tractor orange.
- Accent color: Deep orange (#FF957C), which brings visual interest to secondary interactive elements such as button hovers and section highlights.
- Body and headline font: 'Inter' for a modern and professional appearance; offers excellent readability for dashboard elements
- Note: currently only Google Fonts are supported.
- Crisp and professional icon set aligning with each section, creating visual anchors for quick navigation.
- Desktop-first responsive layout with a consistent sidebar for easy navigation and scalability.
- Subtle transitions and hover effects for a smooth user experience.