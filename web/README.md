# Resume Scoring Dashboard

A modern React-based dashboard for monitoring and managing the Resume Scoring API backend system.

## Features

### 📊 **Dashboard Overview**
- Real-time metrics and statistics
- System health monitoring
- Processing queue status
- Email monitoring status

### 📝 **Resume Submissions**
- View all resume submissions
- Filter by status and search candidates
- Track processing progress
- View scoring results

### 💼 **Job Descriptions**
- Manage job postings and requirements
- Add keywords for better matching
- Track active vs inactive positions
- View submission statistics per job

### 📈 **Scoring Results**
- Detailed scoring analysis
- Score breakdown by category (Technical, Experience, Education, Skills, Communication)
- Filter by score ranges and recommendations
- Export results for reporting

### 📧 **Email Monitoring**
- Monitor email configurations
- Track email response status
- View email templates
- Monitor SMTP connections

### 🔍 **System Logs**
- Comprehensive audit trail
- User activity tracking
- System event monitoring
- Filter logs by action type and time

## Tech Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Iconify** - Icon library integration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Resume Scoring API backend running on `http://localhost:8000`

### Installation

1. **Install dependencies:**
   ```bash
   cd web
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## API Integration

The dashboard connects to the Resume Scoring API backend with the following endpoints:

### Dashboard Metrics
- `GET /api/dashboard/metrics` - System overview metrics
- `GET /api/dashboard/processing-stats` - Processing statistics
- `GET /api/dashboard/scoring-stats` - Scoring analytics

### Resume Management
- `GET /api/resume-submissions/` - List all submissions
- `POST /api/resume-submissions/` - Create new submission
- `GET /api/resume-submissions/{id}` - Get submission details

### Job Descriptions
- `GET /api/job-descriptions/` - List all job descriptions
- `POST /api/job-descriptions/` - Create new job description
- `PUT /api/job-descriptions/{id}` - Update job description

### Scoring Results
- `GET /api/scoring-results/` - List all scoring results
- `GET /api/scoring-results/{id}` - Get detailed scoring result

### Email Management
- `GET /api/email-configs/` - List email configurations
- `GET /api/email-responses/` - List email responses
- `POST /api/email-configs/` - Create email configuration

### System Monitoring
- `GET /api/audit-logs/` - List system audit logs
- `GET /health` - API health check
- `GET /api/health/database` - Database health check
- `GET /api/health/redis` - Redis health check
- `GET /api/health/email` - Email service health check

## Project Structure

```
web/
├── src/
│   ├── components/
│   │   ├── resume/           # Resume scoring components
│   │   │   ├── ResumeMetrics.tsx
│   │   │   ├── RecentSubmissions.tsx
│   │   │   ├── EmailMonitoringCard.tsx
│   │   │   ├── SystemHealthCard.tsx
│   │   │   ├── ResumeProcessingChart.tsx
│   │   │   └── ScoringStatisticsChart.tsx
│   │   ├── common/           # Shared components
│   │   ├── ui/              # UI components
│   │   └── ...
│   ├── pages/
│   │   ├── Dashboard/        # Main dashboard
│   │   ├── ResumeScoring/    # Resume scoring pages
│   │   │   ├── ResumeSubmissions.tsx
│   │   │   ├── JobDescriptions.tsx
│   │   │   ├── ScoringResults.tsx
│   │   │   ├── EmailMonitoring.tsx
│   │   │   └── SystemLogs.tsx
│   │   └── ...
│   ├── layout/              # Layout components
│   ├── context/             # React context
│   ├── hooks/               # Custom hooks
│   └── icons/               # Icon components
├── public/                  # Static assets
└── package.json
```

## Key Features

### Real-time Updates
- Auto-refresh metrics every 30 seconds
- Live system health monitoring
- Real-time processing queue updates

### Advanced Filtering
- Search across all data
- Filter by status, date ranges, and categories
- Multi-criteria filtering

### Responsive Design
- Mobile-friendly interface
- Dark/light theme support
- Adaptive layouts

### Data Visualization
- Interactive charts and graphs
- Progress indicators
- Status badges and icons

## Development

### Adding New Components

1. Create component in appropriate directory
2. Add TypeScript interfaces for data
3. Implement API integration
4. Add to routing if needed

### Styling

The project uses Tailwind CSS with custom configuration. Follow the existing patterns for:
- Color schemes (primary, success, warning, danger)
- Spacing and layout
- Dark mode support

### API Integration

All API calls use the `fetch` API with error handling:
```typescript
const fetchData = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/endpoint");
    if (response.ok) {
      const data = await response.json();
      // Handle data
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
```

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Ensure the backend API is running on `http://localhost:8000`
   - Check CORS configuration in the API
   - Verify network connectivity

2. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run lint`

3. **Development Server Issues**
   - Clear Vite cache: `rm -rf node_modules/.vite`
   - Restart development server

## Contributing

1. Follow the existing code structure
2. Add TypeScript types for all data
3. Include error handling for API calls
4. Test responsive design
5. Update documentation as needed

## License

This project is part of the Resume Scoring System.
