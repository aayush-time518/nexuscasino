# NexusGamingCasino

A fully functional casino web application built with Next.js 14, TypeScript, Tailwind CSS, and Prisma. This is an educational project demonstrating modern web development practices for casino gaming platforms.

## Features

### Core Features
- **User Authentication** - Secure email/password authentication
- **Game Lobby** - Browse 12+ casino games (slots, table games, live dealer, jackpots)
- **Game Play Interface** - Immersive full-screen gaming experience with betting controls
- **Payment Methods** - Manage credit cards, bank accounts, and digital wallets
- **Transactions** - Complete financial history with deposits, withdrawals, and game results
- **Promotions & Bonuses** - Welcome bonuses, reload bonuses, free spins, cashback, VIP offers
- **Loyalty Program** - Tier-based rewards system with redeemable points
- **Responsible Gaming** - Deposit limits, loss limits, session time tracking
- **Account Dashboard** - Comprehensive account management and verification

### Technical Features
- **Server-Side Rendering** with Next.js 14 App Router
- **Type Safety** with TypeScript
- **Database** - SQLite with Prisma ORM
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Real-time Updates** - Live balance updates and transaction tracking
- **Security** - JWT authentication, encrypted connections

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Database Setup:**
```bash
npx prisma migrate dev
npx prisma db seed
```

3. **Run the development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:4028`

### Build for Production
```bash
npm run build
npm start
```

## Application Routes

### Public Routes
- `/` - Redirects to game lobby
- `/login` - Login page
- `/registration` - Multi-step registration form
- `/game-lobby` - Browse all available games
- `/promotions-bonuses` - View promotions and bonuses

### Protected Routes (Requires Authentication)
- `/account-dashboard` - Account overview and management
- `/payment-methods` - Payment management, deposits, withdrawals
- `/transaction-history` - Complete transaction history with filters and export
- `/game-play-interface` - Full-screen game play with betting controls

## Technologies Used

- **Frontend:** Next.js 14.2.0, React 18, TypeScript
- **Styling:** Tailwind CSS 3.4.6 with custom design system
- **Database:** SQLite with Prisma ORM
- **Icons:** Heroicons (Outline & Solid variants)
- **State Management:** React Hooks

## License

Educational project. All trademarks belong to their respective owners.

---

**Built for educational purposes to demonstrate modern web development practices.**
