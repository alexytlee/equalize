# Equalize.fi Landing Page

A modern, responsive landing page for Equalize - a next-generation RWA (Real World Assets) protocol.

## Features

- 🎨 Modern, gradient-based design
- 📱 Fully responsive layout
- ✨ Smooth animations and transitions
- 🎯 Email notification form
- ⚡ Fast and lightweight
- 🌐 SEO-friendly

## Getting Started

Simply open `index.html` in your browser to view the landing page.

### Local Development

For development with live reload, you can use any simple HTTP server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Project Structure

```
equalize/
├── index.html      # Main HTML file
├── styles.css      # Stylesheet
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Customization

### Colors

Edit the CSS variables in `styles.css` to change the color scheme:

```css
:root {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --secondary: #8b5cf6;
  --accent: #ec4899;
  /* ... */
}
```

### Content

Modify the text content in `index.html` to match your messaging.

### Email Integration

Update the form submission handler in `script.js` to integrate with your email service provider (e.g., Mailchimp, SendGrid, etc.).

## Deployment

This is a static site and can be deployed to:

- GitHub Pages
- Vercel
- Netlify
- AWS S3
- Any static hosting service

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2025 Equalize. All rights reserved.
