# GoTruck - EAC Freight Logistics Platform

A comprehensive freight logistics management platform for the East African Community (EAC), built with Next.js 16, React 19, and modern web technologies.

## Features

- **Real-time GPS Tracking**: Live location updates for trucks across EAC borders
- **Predictive Analytics**: AI-powered route optimization and fuel efficiency insights
- **Multi-Currency Support**: Handle transactions in KES, UGX, and TZS
- **Multi-tenant Authentication**: Separate portals for drivers, shippers, and admins
- **Cross-border Management**: Automated documentation and customs tracking
- **Offline Support**: PWA capabilities for low-connectivity rural routes
- **Localization**: Support for English, Swahili, and French

## Tech Stack

### Frontend
- Next.js 16 with React 19 Server Components
- Tailwind CSS + Radix UI
- Lucide React icons
- React Hook Form + Zod validation
- Recharts + D3.js for visualization
- React Query + Zustand for state management

### Backend
- Next.js API Routes
- Socket.io for real-time tracking
- BullMQ + Redis for background jobs
- MongoDB Atlas for freight logs
- PostgreSQL for financial transactions

### Infrastructure
- Docker + Kubernetes
- Vercel deployment
- Sentry error tracking
- GitHub Actions CI/CD

## Getting Started

### Prerequisites

- Node.js 20+ and npm/yarn/pnpm
- MongoDB Atlas account
- PostgreSQL database (Supabase recommended)
- Redis instance
- Clerk account for authentication
- Stripe account for payments
- Cloudinary and AWS S3 for storage
- Mapbox account for maps

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gotruck-app.git
cd gotruck-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Copy the environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your credentials:
   - MongoDB URI
   - PostgreSQL connection string
   - Redis URL
   - Clerk keys
   - Stripe keys
   - Cloudinary credentials
   - AWS S3 credentials
   - Mapbox token
   - Sentry DSN

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
gotruck-app/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard pages
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── dashboard/        # Dashboard-specific components
│   └── providers/        # Context providers
├── lib/                   # Utility functions
│   ├── db/               # Database clients
│   ├── services/         # Business logic
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript definitions
├── public/               # Static assets
└── styles/               # Global styles
```

## Development

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Building
```bash
npm run build
```

## Docker

Build and run with Docker:

```bash
docker build -t gotruck-app .
docker run -p 3000:3000 gotruck-app
```

Or use Docker Compose:

```bash
docker-compose up
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@gotruck.com or join our Slack channel.

## Roadmap

- [ ] Mobile apps (React Native)
- [ ] Advanced ML route optimization
- [ ] Blockchain-based document verification
- [ ] Integration with EAC customs systems
- [ ] Driver mobile app with offline capabilities
- [ ] Advanced analytics dashboard
- [ ] Multi-warehouse management

## Acknowledgments

- Built for the East African Community
- Inspired by modern logistics platforms
- Powered by Next.js and Vercel
