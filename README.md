# EML generator

A React-based EML (Ecological Metadata Language) generator with an interactive map for geographic coverage selection.

## Features

- **Interactive Map**: Select geographic coverage using an interactive map with selectable NSWE (North, South, West, East) bounding coordinates
- **Coordinate Input**: Manual coordinate entry with validation
- **World Coverage**: Quick selection for global datasets
- **Real-time Updates**: Map and coordinate inputs stay synchronized

## Running the Application

Should run using `docker-compose run web`, and then `npm start`. If you want to use a proxy (if you have multiple docker images running for example), you can use https://github.com/gbif-norway/nginx-proxy and fill in `0.0.0.0    eml.localhost` or similar in your hosts file.

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
