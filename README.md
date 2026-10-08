# EML Generator

A React-based EML (Ecological Metadata Language) generator with an interactive map for geographic coverage selection.

## Features

- **Interactive Map**: Select geographic coverage using an interactive map with selectable NSWE (North, South, West, East) bounding coordinates
- **Coordinate Input**: Manual coordinate entry with validation
- **World Coverage**: Quick selection for global datasets
- **Real-time Updates**: Map and coordinate inputs stay synchronized

## Running the Application

### Development (Docker-first workflow)
```bash
# Start development server with hot reload
docker compose up web
# or
npm run start:docker

# Build all Docker images
docker compose build
# or
npm run build:docker
```

If you want to use a proxy (if you have multiple docker images running for example), you can use https://github.com/gbif-norway/nginx-proxy and fill in `0.0.0.0    eml.localhost` or similar in your hosts file.

### Production Build
```bash
docker compose up web-prod
```
This will serve the production build on port 8080.

### GitHub Pages Deployment

GitHub Pages publishes the `docs/` directory on the `master` branch. Source changes
only appear on the site after the generated files in `docs/` are committed and pushed.

#### Build the Pages files with Docker
```bash
# Build the deploy image
docker compose build deploy

# Build the site into docs/
docker compose --profile deploy run --rm deploy
# or
npm run deploy:docker
```

#### Build the Pages files with local Node.js
```bash
npm run deploy
```

Both methods will:
1. Build the React application
2. Replace the generated files in `docs/`

Commit and push the updated `docs/` directory to `master` to publish the site.

The site will be available at: https://gbif-norway.github.io/eml-generator-js

## Geographic Coverage Map

The application includes an interactive map component for selecting geographic coverage:

- Click on the map to set initial bounds
- Adjust coordinates manually using the input fields
- Use "World Coverage" button for global datasets
- Use "Clear" button to reset coordinates
- The red rectangle shows the selected geographic area
- Coordinates are validated (latitude: -90 to 90, longitude: -180 to 180)

## Dependencies

- React 18
- JsonForms for form handling
- Leaflet and React-Leaflet for map functionality
- Material-UI for components

## Docker Services

- `web`: Development server with hot reload
- `web-prod`: Production build served with nginx
- `deploy`: Builds the files in `docs/` for GitHub Pages (use with `--profile deploy`)
