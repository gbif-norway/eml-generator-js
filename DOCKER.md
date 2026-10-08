# Docker Development Workflow

Docker can run the development server and prepare the static files for GitHub Pages.

## Quick Start

### Development (Most Common)
```bash
# Start development environment
docker compose --profile dev up --build

# Access your app at: http://localhost:3001
```

### Build GitHub Pages files
```bash
# Rebuild docs/ from the React source
docker compose --profile deploy run --build --rm deploy
```

GitHub Pages serves `docs/` from `master`. Commit and push the updated files to publish them.

## Services Overview

| Service | Purpose | Port | When to Use |
|---------|---------|------|-------------|
| `dev` | Development with hot reload | 3001 | Daily development |
| `deploy` | Build GitHub Pages files into `docs/` | - | Before committing site changes |

## Common Commands

```bash
# Start development
docker compose --profile dev up --build

# Build GitHub Pages files
docker compose --profile deploy run --build --rm deploy

# Stop all services
docker compose down

# Clean up Docker resources
docker compose down --volumes --remove-orphans
docker system prune -f
```

## Why This Setup?

- **Simplified**: Only run what you need using profiles
- **Isolated**: Each service has a specific purpose
- **Consistent**: Same environment for development and production
- **Fast**: Uses Docker layer caching for faster builds

## Troubleshooting

### Port Conflicts
If port 3001 is in use, you can change it in `docker-compose.yml`:
```yaml
ports:
  - '3002:3000'  # Change 3001 to 3002
```

### Clean Rebuild
```bash
docker compose down --volumes --remove-orphans
docker system prune -f
docker compose --profile dev up --build
```

### View Logs
```bash
docker compose logs -f dev
```
