# TimeTracker Frontend - React SPA

Professional time tracking application built with React, TypeScript, and Material-UI.

## Technology Stack

- **Framework:** React 18.2.0
- **Build Tool:** Vite
- **Language:** TypeScript
- **UI Library:** Material-UI (MUI) v5
- **State Management:** Zustand + TanStack Query (React Query)
- **Authentication:** Azure AD (MSAL)
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Forms:** Formik + Yup
- **Testing:** Vitest + React Testing Library + Cypress

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Layout.tsx      # Main application layout
│   └── ProtectedRoute.tsx
├── pages/              # Page components for routes
│   ├── DashboardPage.tsx
│   ├── TimeEntriesPage.tsx
│   ├── LoginPage.tsx
│   └── ...
├── services/           # API service layer
│   ├── apiClient.ts    # Axios instance & interceptors
│   ├── timeEntryService.ts
│   └── ...
├── hooks/              # Custom React hooks
│   └── useApi.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── config/             # Configuration files
│   └── authConfig.ts
├── store/              # Global state (Zustand)
├── utils/              # Utility functions
├── App.tsx             # Main app component with routing
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Valid Azure AD tenant
- TimeTracker API running (Phase 10.4)

### Installation

1. **Clone repository** (or navigate to this directory):
   ```bash
   cd agent-output/timetracker/web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your values:
   ```env
   VITE_API_URL=https://app-timetracker-api-prod.azurewebsites.net
   VITE_AZURE_TENANT_ID=your-tenant-id
   VITE_AZURE_CLIENT_ID=your-app-id
   VITE_AZURE_REDIRECT_URI=http://localhost:3000
   ```

### Development

**Start development server:**
```bash
npm run dev
```

Server runs at `http://localhost:3000`

### Building

**Production build:**
```bash
npm run build
```

Output: `dist/` directory

**Preview production build locally:**
```bash
npm run preview
```

## Testing

### Unit & Component Tests
```bash
npm test
npm test:ui          # Interactive UI mode
npm test:coverage   # With coverage report
```

### End-to-End Tests
```bash
npm run e2e          # Cypress interactive
npm run e2e:headless # Headless mode for CI
```

## Code Quality

### Linting & Formatting
```bash
npm run lint        # Check for issues
```

## API Integration

### API Client Usage

Import the service:
```typescript
import timeEntryService from '@/services/timeEntryService'
import { useApiMutation } from '@/hooks/useApi'

// In component:
const { mutate, isPending } = useApiMutation(
  (data) => timeEntryService.createTimeEntry(data)
)
```

### Adding New API Services

1. Create new service file in `src/services/`
2. Use `apiClient` for HTTP requests
3. Export service functions
4. Import and use in components/hooks

Example:
```typescript
import { apiClient } from './apiClient'

export const projectService = {
  getProjects: async () => {
    const response = await apiClient.get('/api/Projects')
    return response.data
  }
}
```

## Authentication Flow

The app uses Azure AD (MSAL) for authentication:

1. Unauthenticated users redirected to `/login`
2. Login page triggers Azure AD popup
3. On success, token stored in localStorage
4. Protected routes wrapped with `<ProtectedRoute>`
5. API requests include bearer token in headers
6. Token automatically refreshed on expiry (silent flow)

## Deployment

### Azure Static Web App

The app deploys to Azure Static Web App (Phase 10.6):

1. **Build:** Vite creates optimized `dist/` folder
2. **Deploy:** GitHub Actions uploads to Static Web App
3. **URL:** `https://timetracker-web.azurestaticapps.net/`

### CI/CD Pipeline

GitHub Actions workflow: `.github/workflows/timetracker-frontend-deploy.yml`

- Triggers on push to main (in `/web` folder paths)
- Installs deps, lints, tests, builds
- Deploys to Azure Static Web App
- Runs health checks
- Generates deployment summary

## Development Guidelines

### Component Patterns

**Functional Components:**
```typescript
import { FC } from 'react'

interface Props {
  title: string
}

const MyComponent: FC<Props> = ({ title }) => {
  return <div>{title}</div>
}

export default MyComponent
```

**Custom Hooks:**
```typescript
const useMyHook = () => {
  // Hook logic
  return { data, loading }
}
```

### State Management

- **Local:** React state (`useState`)
- **Component tree:** Zustand store (if needed)
- **Server state:** TanStack Query (useQuery, useMutation)
- **Auth:** MSAL useIsAuthenticated, useAccount

### Error Handling

```typescript
const { mutate, isPending, isError } = useApiMutation(apiFunction)

mutate(data, {
  onSuccess: () => toast.success('Operation successful'),
  onError: (error) => toast.error(error.message),
})
```

## Common Tasks

### Add a New Page

1. Create file in `src/pages/MyPage.tsx`
2. Add route in `App.tsx` Routes
3. Add navigation link in `Layout.tsx` sidebar

### Call an API Endpoint

1. Create/update service in `src/services/`
2. Use `useApiMutation` or `useQuery` in component
3. Handle loading/error states
4. Display results

### Add Material-UI Component

```typescript
import { Button, TextField, Dialog } from '@mui/material'

// Use in JSX
<TextField label="Name" />
<Button variant="contained">Click me</Button>
```

## Performance Optimization

- **Code Splitting:** Vite automatically code-splits routes
- **Lazy Loading:** Use `React.lazy()` for route components
- **Image Optimization:** Use next-gen formats (WebP)
- **Bundle Analysis:** `npm run build -- --analyze`
- **Caching:** Static Web App provides CDN caching

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | API base URL | `https://api.example.com` |
| `VITE_AZURE_TENANT_ID` | Azure AD tenant | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `VITE_AZURE_CLIENT_ID` | App registration ID | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `VITE_AZURE_REDIRECT_URI` | Post-auth redirect | `http://localhost:3000` |
| `VITE_APP_TITLE` | Browser title | `TimeTracker` |
| `VITE_ENVIRONMENT` | Deployment environment | `development` \| `production` |

## Troubleshooting

### "Cannot find module '@'" error

Ensure `vite.config.ts` has path aliases configured.

### MSAL login popup blocked

- Check browser popup settings
- Verify redirect URI in Azure AD app registration
- Ensure localhost:3000 is whitelisted

### API 401 Unauthorized

- Token expired - refresh required
- Check MSAL configuration
- Verify Azure AD app has API permissions granted

### CSS not loading

Clear browser cache and rebuild:
```bash
rm -rf node_modules/.vite
npm run dev
```

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/my-feature`
4. Create Pull Request

## License

Proprietary - TimeTracker

## Support

For issues, questions, or suggestions:
- Check existing documentation
- Review API Swagger: `https://app-timetracker-api-prod.azurewebsites.net/swagger`
- Contact development team

---

**Last Updated:** 2026-02-16
