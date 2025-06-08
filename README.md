# Attendance Tracker

A comprehensive web application for tracking attendance at events, classes, or sessions across multiple sites. The application features a powerful dashboard with time-based monitoring and export capabilities.

![Attendance Tracker Dashboard](./generated-icon.png)

## Features

### Core Functionality
- **Multi-site Support**: Track attendance across different locations or venues
- **Person Management**: Maintain a master list of participants and volunteers
- **Session Registration**: Register attendees for specific sessions or dates
- **Attendance Tracking**: Record attendance status (present/absent) for each session
- **Mobile-Friendly**: Responsive design works on all devices

### Enhanced Dashboard
- **Time-based Monitoring**: Track attendance trends over time with customizable date ranges
- **Comparative Analysis**: Compare current period metrics with previous periods
- **Visual Indicators**: See attendance patterns with trend indicators and heatmaps
- **Customizable Views**: Filter by site, date range, and person type
- **Attendance Patterns**: Visualize attendance by day of week and time

### Export Capabilities
- **Multiple Formats**: Export data in CSV and JSON formats
- **Customizable Exports**: Select date ranges, sites, and person types to include
- **Detailed Reports**: Include timestamps and person IDs in exports
- **One-click Download**: Easily download attendance data for offline analysis

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Components**: Shadcn UI components with Tailwind CSS
- **State Management**: React Query for server state, React Context for local state
- **Data Visualization**: Recharts for charts and graphs
- **Backend**: Express.js with TypeScript
- **Database**: Drizzle ORM with PostgreSQL (via Neon Database)
- **Authentication**: Passport.js (local strategy)
- **Deployment**: Ready for deployment on any platform supporting Node.js

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Neon Database account)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/attendance-tracker.git
   cd attendance-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=your_database_connection_string
   SESSION_SECRET=your_session_secret
   PORT=5000
   NODE_ENV=development
   ```

4. Initialize the database:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5000`

### Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Project Structure

```
attendance-tracker/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main application component
├── server/                 # Backend Express application
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data storage interface
│   ├── export.ts           # Export functionality
│   └── vite.ts             # Vite server configuration
├── shared/                 # Shared code between client and server
│   └── schema.ts           # Database schema and types
└── public/                 # Static assets
```

## API Endpoints

### Sites

- `GET /api/sites` - Get all sites
- `GET /api/site/:id` - Get site by ID

### People

- `GET /api/people` - Get all people
- `GET /api/person/:id` - Get person by ID

### Registered Attendees

- `GET /api/registered-attendees/:sessionId` - Get registered attendees by session ID
- `GET /api/registered-attendees/site/:siteId/date/:date` - Get registered attendees by site and date
- `POST /api/registered-attendees` - Update registered attendees for a site and date

### Attendance

- `GET /api/attendance-logs` - Get all attendance logs
- `POST /api/attendance` - Save attendance records

### Export

- `GET /api/export/csv` - Export attendance data as CSV
- `GET /api/export/json` - Export attendance data as JSON
- `GET /api/export/summary` - Get attendance summary statistics

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `SESSION_SECRET` | Secret for session encryption | - |
| `PORT` | Port for the server | `5000` |
| `NODE_ENV` | Environment mode | `development` |

### Database Configuration

The application uses Drizzle ORM with PostgreSQL. You can configure the database connection in `drizzle.config.ts`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Recharts](https://recharts.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

