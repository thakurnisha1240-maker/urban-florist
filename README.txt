URBAN BLOOM FLORIST - ASSIGNMENT 2b FINAL WEBSITE

HOW TO RUN
Open index.html in Chrome (double-click it), or run "python -m http.server 8000"
in this folder and visit http://localhost:8000

PAGES
Home, Flowers, Services, Contact (4 HTML pages) + style.css + script.js + images/ folder
(images/flower-1.webp to flower-8.webp must be in the images folder).

JAVASCRIPT FEATURES (script.js, no libraries)
1. Mobile hamburger menu (aria-expanded, Escape key closes it)
2. Flowers: category filter buttons, price/name sorting, live result count, empty message
3. Contact form: inline validation (name, email, message), character counter,
   focus moves to first error, confirmation summary
4. Enquire links prefill the form (contact.html?bouquet=Soft+Blush)
5. Services: FAQ accordion and delivery suburb checker
6. Home/Contact: "Open now / Closed" badge using Auckland time

CHANGES SINCE ASSIGNMENT 2a
- Semantic structure: one h1 per page, nav landmark, skip link, aria-current on active link
- Responsive: 3 / 2 / 1 column layouts, collapsible mobile menu
- Accessibility: visible focus styles, error messages linked with aria-describedby, aria-live feedback,
  reduced-motion support, image width/height, lazy-loading
- CSS variables, hover effects, favicon, meta descriptions
- JavaScript rewritten into separate, commented functions

LIMITATIONS
The enquiry form does not send emails and there is no checkout or database (enquiry-only, per the case pack).
Photos: provided by student. Check permission and cite original sources in your report.
