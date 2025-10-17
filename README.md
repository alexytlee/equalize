# Equalize.fi Landing Page

A modern, responsive landing page for Equalize - a licensed crypto OTC trading desk in Hong Kong.

## Features

- 🎨 Modern, gradient-based design
- 📱 Fully responsive layout
- ✨ Netflix-level smooth animations
- 🌐 Multi-language support (EN, 繁體中文, 简体中文)
- ⚡ Fast and lightweight
- ♿ Accessibility features (reduced motion support)

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
├── index.html      # Main landing page
├── prices.html     # Live prices page with multi-source quotes
├── styles.css      # Global stylesheet
├── script.js       # Main page JavaScript
├── prices.js       # Price fetching from multiple APIs
├── i18n.js         # Internationalization (EN, 繁體中文, 简体中文)
└── README.md       # This file
```

## Features

### Live Price Quotes

The prices page (`prices.html`) displays real-time cryptocurrency prices from multiple sources:

- **CoinGecko** - Market data and 24h price changes
- **Binance** - World's largest crypto exchange
- **Coinbase** - Leading US crypto exchange
- **Kraken** - Major institutional exchange
- **Bitfinex** - Professional trading platform
- **OKX** - Global crypto exchange

#### Price Features:

- ✨ **Flash Animations** - Prices flash green when going up, red when going down
- 🔄 **Auto-refresh** - Updates every 30 seconds with countdown timer
- 📊 **24h Change** - Shows percentage change with color indicators
- 📱 **Fully Responsive** - Optimized for desktop, laptop, tablet, and mobile
- 🎯 **Multi-source** - Compare prices across 6 major exchanges
- ⚡ **Real-time** - All data fetched from free public APIs

Prices are fetched from free public APIs with proper rate limiting to ensure reliability.

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
