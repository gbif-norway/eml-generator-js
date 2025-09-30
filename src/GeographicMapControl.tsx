import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './locationfilter.css';
import { ControlProps } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Box, Typography, TextField, Grid, Button } from '@mui/material';

// Load the location filter code
import './gbif-locationfilter.js';

// Extend Leaflet types to include LocationFilter
declare global {
  namespace L {
    interface LocationFilter {
      addTo(map: L.Map): LocationFilter;
      remove(): void;
      enable(): void;
      disable(): void;
      setBounds(bounds: L.LatLngBounds): void;
      getBounds(): L.LatLngBounds;
      on(event: string, handler: (e: any) => void): void;
      off(event: string, handler: (e: any) => void): void;
      fire(event: string, data?: any): void;
    }
    
    interface LocationFilterOptions {
      enable?: boolean;
      enableButton?: boolean | { enableText: string; disableText: string };
      adjustButton?: boolean | { text: string };
      bounds?: L.LatLngBounds;
      buttonPosition?: string;
    }
    
    namespace Control {
      class LocationFilter {
        constructor(options?: LocationFilterOptions);
        addTo(map: L.Map): LocationFilter;
        remove(): void;
        enable(): void;
        disable(): void;
        setBounds(bounds: L.LatLngBounds): void;
        getBounds(): L.LatLngBounds;
        on(event: string, handler: (e: any) => void): void;
        off(event: string, handler: (e: any) => void): void;
        fire(event: string, data?: any): void;
      }
    }
  }
}

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

// Component to handle the LocationFilter integration
const LocationFilterHandler: React.FC<{
  bounds: Bounds;
  onBoundsChange: (bounds: Bounds) => void;
}> = ({ bounds, onBoundsChange }) => {
  const map = useMap();
  const locationFilterRef = useRef<any>(null);

  useEffect(() => {
    // Check if LocationFilter is available
    if (!(L as any).LocationFilter) {
      console.error('LocationFilter not available. Check if gbif-locationfilter is properly loaded.');
      return;
    }

    // Initialize the LocationFilter with default bounds if none are set
    let initialBounds;
    if (bounds.north !== 0 || bounds.south !== 0 || bounds.east !== 0 || bounds.west !== 0) {
      initialBounds = L.latLngBounds([bounds.south, bounds.west], [bounds.north, bounds.east]);
    } else {
      // Set default bounds to cover all of Norway
      initialBounds = L.latLngBounds(
        [58.0, 4.0],   // Southwest corner (South Norway, West coast)
        [71.0, 31.0]   // Northeast corner (North Norway, East border)
      );
    }

    console.log('Creating LocationFilter with bounds:', initialBounds);
    const locationFilter = new (L as any).LocationFilter({
      enable: true,
      enableButton: false,
      adjustButton: false,
      bounds: initialBounds
    });


    // Add to map using the proper method
    map.addLayer(locationFilter);
    locationFilterRef.current = locationFilter;

    // Listen for changes
    const handleChange = (e: any) => {
      const filterBounds = e.bounds;
      const newBounds: Bounds = {
        north: filterBounds.getNorth(),
        south: filterBounds.getSouth(),
        east: filterBounds.getEast(),
        west: filterBounds.getWest()
      };
      onBoundsChange(newBounds);
    };

    locationFilter.on('change', handleChange);

    // If we initialized with default bounds, update the state
    if (bounds.north === 0 && bounds.south === 0 && bounds.east === 0 && bounds.west === 0) {
      const defaultBounds: Bounds = {
        north: initialBounds.getNorth(),
        south: initialBounds.getSouth(),
        east: initialBounds.getEast(),
        west: initialBounds.getWest()
      };
      onBoundsChange(defaultBounds);
    }

    // Cleanup function
    return () => {
      if (locationFilterRef.current) {
        locationFilterRef.current.off('change', handleChange);
        map.removeLayer(locationFilterRef.current);
      }
    };
  }, [map, onBoundsChange, bounds.north, bounds.south, bounds.east, bounds.west]);

  // Update LocationFilter when bounds change from external source
  useEffect(() => {
    if (locationFilterRef.current) {
      if (bounds.north !== 0 || bounds.south !== 0 || bounds.east !== 0 || bounds.west !== 0) {
        const leafletBounds = L.latLngBounds(
          [bounds.south, bounds.west],
          [bounds.north, bounds.east]
        );
        locationFilterRef.current.setBounds(leafletBounds);
      }
    }
  }, [bounds.north, bounds.south, bounds.east, bounds.west]);

  return null;
};

const GeographicMapControl: React.FC<ControlProps> = (props) => {
  const { data, handleChange, path } = props;
  const [bounds, setBounds] = useState<Bounds>({
    north: 0,
    south: 0,
    east: 0,
    west: 0
  });
  const mapRef = useRef<L.Map>(null);

  // Initialize bounds from data
  useEffect(() => {
    if (data) {
      const newBounds: Bounds = {
        north: parseFloat(data.northBoundingCoordinate || '0'),
        south: parseFloat(data.southBoundingCoordinate || '0'),
        east: parseFloat(data.eastBoundingCoordinate || '0'),
        west: parseFloat(data.westBoundingCoordinate || '0')
      };
      setBounds(newBounds);
    }
  }, [data]);

  const handleCoordinateChange = (coordinate: keyof Bounds, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newBounds = { ...bounds, [coordinate]: numValue };
    setBounds(newBounds);
    
    // Update the form data
    const coordinateMap = {
      north: 'northBoundingCoordinate',
      south: 'southBoundingCoordinate',
      east: 'eastBoundingCoordinate',
      west: 'westBoundingCoordinate'
    };
    
    const newData = {
      ...data,
      [coordinateMap[coordinate]]: value
    };
    
    handleChange(path, newData);
  };

  const handleBoundsChange = (newBounds: Bounds) => {
    setBounds(newBounds);
    
    const newData = {
      ...data,
      northBoundingCoordinate: newBounds.north.toString(),
      southBoundingCoordinate: newBounds.south.toString(),
      eastBoundingCoordinate: newBounds.east.toString(),
      westBoundingCoordinate: newBounds.west.toString()
    };
    
    handleChange(path, newData);
  };


  const resetToWorld = () => {
    const worldBounds: Bounds = {
      north: 90,
      south: -90,
      east: 180,
      west: -180
    };
    setBounds(worldBounds);
    
    const newData = {
      ...data,
      northBoundingCoordinate: '90',
      southBoundingCoordinate: '-90',
      eastBoundingCoordinate: '180',
      westBoundingCoordinate: '-180'
    };
    
    handleChange(path, newData);
  };

  const resetToEmpty = () => {
    const emptyBounds: Bounds = {
      north: 0,
      south: 0,
      east: 0,
      west: 0
    };
    setBounds(emptyBounds);
    
    const newData = {
      ...data,
      northBoundingCoordinate: '',
      southBoundingCoordinate: '',
      eastBoundingCoordinate: '',
      westBoundingCoordinate: ''
    };
    
    handleChange(path, newData);
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Geographic Coverage
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Use the draggable rectangle on the map to select your geographic area. Drag the corners to resize or drag the center to move the selection.
      </Typography>
      
      {/* Coordinate Input Fields */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6} sm={3}>
          <TextField
            label="North"
            type="number"
            value={bounds.north}
            onChange={(e) => handleCoordinateChange('north', e.target.value)}
            fullWidth
            size="small"
            inputProps={{ step: "0.000001", min: -90, max: 90 }}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="South"
            type="number"
            value={bounds.south}
            onChange={(e) => handleCoordinateChange('south', e.target.value)}
            fullWidth
            size="small"
            inputProps={{ step: "0.000001", min: -90, max: 90 }}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="East"
            type="number"
            value={bounds.east}
            onChange={(e) => handleCoordinateChange('east', e.target.value)}
            fullWidth
            size="small"
            inputProps={{ step: "0.000001", min: -180, max: 180 }}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="West"
            type="number"
            value={bounds.west}
            onChange={(e) => handleCoordinateChange('west', e.target.value)}
            fullWidth
            size="small"
            inputProps={{ step: "0.000001", min: -180, max: 180 }}
          />
        </Grid>
      </Grid>

      {/* Control Buttons */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <Button variant="outlined" size="small" onClick={resetToWorld}>
          World Coverage
        </Button>
        <Button variant="outlined" size="small" onClick={resetToEmpty}>
          Clear
        </Button>
      </Box>

      {/* Map Container */}
      <Box sx={{ height: '400px', width: '100%', border: '1px solid #ccc', borderRadius: 1 }}>
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <LocationFilterHandler 
            bounds={bounds} 
            onBoundsChange={handleBoundsChange}
          />
        </MapContainer>
      </Box>
    </Box>
  );
};

export default withJsonFormsControlProps(GeographicMapControl);
