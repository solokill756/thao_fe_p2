# Travel Booking Platform

A modern, full-stack travel booking platform built with Next.js, offering users the ability to explore, book, and manage tour packages. The platform includes a comprehensive admin dashboard for managing tours, users, bookings, and customer reviews.

## Overview

This is an enterprise-grade travel booking application that provides both customer-facing features and administrative tools. Users can browse tours, make bookings, write reviews, and manage their profiles, while administrators can manage the entire platform including tours, user accounts, and bookings.

## Features

### Customer Features

- **Browse Tours** - Explore a wide variety of tour packages with detailed information, pricing, and availability
- **Advanced Search & Filter** - Find tours by categories, destinations, price range, and other criteria
- **Tour Booking** - Seamless booking experience with secure payment processing
- **Review System** - Write and read reviews for tours with like/dislike functionality
- **User Profiles** - Manage personal information, booking history, and preferences
- **Multi-language Support** - Full internationalization support (English, Vietnamese)
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode** - Theme toggle for user preference

### Admin Features

- **Tour Management** - Create, edit, and delete tour packages with rich content
- **User Management** - View and manage user accounts and roles
- **Booking Management** - Monitor and manage all bookings with status tracking
- **Dashboard** - Overview of key metrics and platform activity
- **Content Management** - Manage categories, destinations, and tour galleries

## Tech Stack

### Frontend

- **Framework:** Next.js 16 (React 19)
- **Language:** TypeScript
- **Styling:** TailwindCSS, PostCSS
- **State Management:** Redux Toolkit, Zustand
- **Data Fetching:** React Query (TanStack Query)
- **Internationalization:** i18next, next-i18next, react-i18next
- **Authentication:** NextAuth.js
- **UI Components:** Lucide React, React Icons
- **Animation:** Framer Motion
- **Form Validation:** Zod
- **Image Management:** Cloudinary
- **Notifications:** React Hot Toast

### Backend

- **Database:** PostgreSQL
- **ORM:** Prisma
- **Password Security:** bcryptjs

### Development & Testing

- **Testing Framework:** Jest
- **Code Quality:** ESLint (Sunlint)
- **Code Formatting:** Prettier
- **Deployment:** Vercel

## Project Structure

```text
├── app/
│   ├── [locale]/                    # Internationalized routes
│   │   ├── admin/                   # Admin dashboard
│   │   │   ├── tours/              # Tour management
│   │   │   ├── users/              # User management
│   │   │   ├── bookings/           # Booking management
│   │   │   └── dashboard/          # Admin overview
│   │   ├── auth/                   # Authentication pages
│   │   ├── payment/                # Payment processing
│   │   ├── profile/                # User profile
│   │   ├── reviews/                # Reviews section
│   │   ├── tours/                  # Tour listings
│   │   ├── components/             # Shared components
│   │   └── layout.tsx              # Layout wrapper
│   ├── actions/                    # Server actions
│   │   ├── admin/                  # Admin server actions
│   │   ├── auth/                   # Auth server actions
│   │   ├── booking/                # Booking server actions
│   │   └── user/                   # User server actions
│   ├── api/                        # API routes
│   │   ├── auth/                   # Auth endpoints
│   │   └── upload/                 # File upload endpoints
│   ├── components/                 # Global components
│   │   ├── common/                 # Reusable components
│   │   ├── providers/              # Context providers
│   │   └── skeleton/               # Loading skeletons
│   ├── lib/                        # Utilities and services
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── services/               # API services
│   │   ├── stores/                 # Zustand stores
│   │   ├── types/                  # TypeScript types
│   │   ├── utils/                  # Utility functions
│   │   └── data/                   # Mock data
│   └── globals.css                 # Global styles
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/                 # Database migrations
├── public/
│   └── images/                     # Static images
├── dictionaries/
│   ├── en.json                     # English translations
│   └── vi.json                     # Vietnamese translations
└── Configuration Files
    ├── next.config.ts              # Next.js configuration
    ├── tsconfig.json               # TypeScript configuration
    ├── jest.config.js              # Jest testing configuration
    ├── postcss.config.mjs           # PostCSS configuration
    └── eslint.config.mjs            # ESLint configuration
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- PostgreSQL database

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd thao_fe_p2
```

1. **Install dependencies**

```bash
npm install
```

1. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Database
POSTGRES_URL=postgresql://user:password@localhost:5432/travel_db
POSTGRES_URL_NON_POOLING=postgresql://user:password@localhost:5432/travel_db

# NextAuth
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Gateway (if applicable)
NEXT_PUBLIC_PAYMENT_KEY=your_payment_key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

1. **Set up the database**

```bash
npx prisma migrate dev
```

1. **Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

### Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Testing

- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report

### Code Quality

- `npm run lint` - Run linter on all files
- `npm run lint:changed` - Lint only changed files
- `npm run lint:security` - Run security linter
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without changes

### Database

- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma db push` - Push schema changes to database
- `npx prisma generate` - Generate Prisma client

## Database Schema

The application uses PostgreSQL with the following main entities:

- **User** - User accounts with profiles and authentication
- **Tour** - Tour packages with details and pricing
- **Booking** - Tour bookings made by users
- **Review** - Customer reviews and ratings
- **Category** - Tour categories
- **Destination** - Travel destinations
- **TourGallery** - Tour images and media
- **TourPlan** - Detailed tour itineraries

## Authentication

The platform uses NextAuth.js for secure authentication:

- Support for multiple auth providers (local, OAuth)
- JWT-based sessions
- Role-based access control (User, Admin)
- Password hashing with bcryptjs

## Internationalization

The application supports multiple languages through i18next:

- **English** - Default language
- **Vietnamese** - Localized content

Language files are stored in the `dictionaries/` directory and can be easily extended.

## Deployment

### Deploy to Vercel

The project is configured for easy deployment to Vercel:

1. **Push code to GitHub**

```bash
git push origin main
```

1. **Connect to Vercel**

- Go to [Vercel Dashboard](https://vercel.com)
- Click "New Project"
- Import the GitHub repository
- Add environment variables
- Deploy

1. **Production build**

```bash
npm run build
npm start
```

See `vercel.json` for Vercel-specific configuration.

## API Reference

The application uses both REST endpoints and Server Actions. Key API routes:

### Authentication Endpoints

- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signout` - User logout

### Tour Endpoints

- `GET /api/tours` - Get all tours
- `GET /api/tours/[id]` - Get specific tour
- `POST /api/tours` - Create new tour (Admin)

### Booking Endpoints

- `POST /api/bookings` - Create booking
- `GET /api/bookings/user` - Get user bookings

### Upload Endpoints

- `POST /api/upload` - Upload image (Cloudinary)

## Running Tests

The project uses Jest for unit and integration testing:

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Test files are colocated with source code in `__tests__/` directories.

## Code Quality & Formatting

### Linting

```bash
npm run lint              # Lint all files
npm run lint:changed      # Lint only changed files
npm run lint:security     # Security audit
```

### Formatting

```bash
npm run format            # Format all files
npm run format:check      # Check without modifying
```

## Performance & Optimization

- **Image Optimization** - Next.js Image component with Cloudinary CDN
- **Component Caching** - React Server Components and caching
- **Code Splitting** - Automatic route-based code splitting
- **Lazy Loading** - Dynamic imports for heavy components
- **Database Indexing** - Strategic indexes on frequently queried fields
- **Query Optimization** - React Query for efficient data fetching

## Security

- **Authentication** - Secure JWT-based session management
- **Password Security** - bcryptjs for password hashing
- **Input Validation** - Zod schema validation on all inputs
- **CORS** - Configured CORS policies
- **Environment Variables** - Sensitive data in environment files
- **SQL Injection Prevention** - Prisma ORM parameterized queries

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a new branch for your feature
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check `POSTGRES_URL` in `.env.local`
- Run `npx prisma db push` to sync schema

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Run `npm run build` again

### Port Already in Use

- Change port: `npm run dev -- -p 3001`
- Or kill process: `lsof -ti:3000 | xargs kill -9`

## Related Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TailwindCSS Guide](https://tailwindcss.com/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [i18next Guide](https://www.i18next.com/)

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.

## Authors

- Development Team: solokill756
- Repository: [thao_fe_p2](https://github.com/solokill756/thao_fe_p2)

---

**Last Updated:** November 28, 2025
