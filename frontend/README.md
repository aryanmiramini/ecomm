# ROIDER Frontend

Beautiful, fully-responsive Next.js e-commerce frontend for the ROIDER platform.

## Features

- 🌍 **RTL & Persian Language Support** - Full right-to-left layout support
- 🎨 **Beautiful Design** - Glass morphism UI with custom color palette
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- ⚡ **SEO Optimized** - Server components and meta tags for better SEO
- 🛒 **E-commerce Ready** - Product browsing, cart, wishlist, and orders
- 🔐 **Authentication** - Login and registration with JWT
- 💳 **Payment Ready** - Integration with backend payment system

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

\`\`\`bash
cd frontend
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3001`

### Build

\`\`\`bash
npm run build
npm start
\`\`\`

## Configuration

### Environment Variables

Create `.env.local`:

\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3000/api
\`\`\`

### Backend Connection

The frontend connects to the NestJS backend API. Make sure the backend is running on `http://localhost:3000`.

## Project Structure

\`\`\`
frontend/
├── app/                  # Next.js app directory
├── components/           # React components
│   ├── layout/          # Layout components
│   ├── home/            # Home page components
│   └── products/        # Product components
├── i18n/                # Internationalization
├── lib/                 # Utilities and API
├── store/               # Zustand stores
└── styles/              # Global styles
\`\`\`

## Supported Languages

- Persian (fa) - Default
- English (en)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## License

ISC
