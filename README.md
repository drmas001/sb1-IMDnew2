# IMD-Care: Internal Medicine Department Management System

A comprehensive patient management system designed specifically for internal medicine departments.

## Features

- Patient Management
- Appointment Scheduling
- Medical Records
- Department-wise Patient Distribution
- Real-time Updates
- Reporting System
- User Management
- Role-based Access Control

## Tech Stack

- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Supabase for backend
- Zustand for state management
- Vitest for testing
- Lucide React for icons

## Prerequisites

- Node.js 18.x or later
- PostgreSQL 14.x or later
- npm or yarn

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/imd-care.git
   cd imd-care
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file and configure it:
   ```bash
   cp .env.example .env
   ```

4. Set up the database:
   ```bash
   psql -U your_username -d your_database -f schema.sql
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run coverage` - Generate test coverage report
- `npm run lint` - Run linter

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist` directory, ready for deployment.

## Testing

Run the test suite:
```bash
npm run test
```

Generate coverage report:
```bash
npm run coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@imd-care.com or open an issue in the repository.