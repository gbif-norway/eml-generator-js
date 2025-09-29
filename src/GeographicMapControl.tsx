import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Rectangle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ControlProps } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Box, Typography, TextField, Grid, Button } from '@mui/material';

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

// Component to handle interactive rectangle selection
const InteractiveRectangle: React.FC<{
  bounds: Bounds;
  onBoundsChange: (bounds: Bounds) => void;
  onMapClick: (lat: number, lng: number) => void;
}> = ({ bounds, onBoundsChange, onMapClick }) => {
  const map = useMap();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<L.LatLng | null>(null);
  const [currentBounds, setCurrentBounds] = useState<L.LatLngBounds | null>(null);

  // Handle map clicks to create initial selection
  useMapEvents({
    click: (e) => {
      if (!isDragging) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
    mousedown: (e) => {
      if (e.originalEvent.button === 0) { // Left mouse button
        setIsDragging(true);
        setDragStart(e.latlng);
      }
    },
    mousemove: (e) => {
      if (isDragging && dragStart) {
        const newBounds = L.latLngBounds(dragStart, e.latlng);
        setCurrentBounds(newBounds);
      }
    },
    mouseup: (e) => {
      if (isDragging && dragStart) {
        const finalBounds = L.latLngBounds(dragStart, e.latlng);
        const newBounds: Bounds = {
          north: finalBounds.getNorth(),
          south: finalBounds.getSouth(),
          east: finalBounds.getEast(),
          west: finalBounds.getWest()
        };
        onBoundsChange(newBounds);
        setCurrentBounds(null);
        setIsDragging(false);
        setDragStart(null);
      }
    }
  });

  // Update map view when bounds change
  useEffect(() => {
    if (bounds.north !== 0 || bounds.south !== 0 || bounds.east !== 0 || bounds.west !== 0) {
      const leafletBounds = L.latLngBounds(
        [bounds.south, bounds.west],
        [bounds.north, bounds.east]
      );
      map.fitBounds(leafletBounds);
    }
  }, [bounds, map]);

  // Show current dragging bounds
  if (currentBounds) {
    return (
      <Rectangle
        bounds={currentBounds}
        color="blue"
        weight={2}
        fillOpacity={0.1}
        dashArray="5, 5"
      />
    );
  }

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

  const handleMapClick = useCallback((lat: number, lng: number) => {
    // If no bounds are set, create initial bounds around the clicked point
    if (bounds.north === 0 && bounds.south === 0 && bounds.east === 0 && bounds.west === 0) {
      const newBounds: Bounds = {
        north: lat + 0.1,
        south: lat - 0.1,
        east: lng + 0.1,
        west: lng - 0.1
      };
      setBounds(newBounds);
      
      const newData = {
        ...data,
        northBoundingCoordinate: newBounds.north.toString(),
        southBoundingCoordinate: newBounds.south.toString(),
        eastBoundingCoordinate: newBounds.east.toString(),
        westBoundingCoordinate: newBounds.west.toString()
      };
      
      handleChange(path, newData);
    }
  }, [bounds, data, handleChange, path]);

  const handleBoundsChange = useCallback((newBounds: Bounds) => {
    setBounds(newBounds);
    
    const newData = {
      ...data,
      northBoundingCoordinate: newBounds.north.toString(),
      southBoundingCoordinate: newBounds.south.toString(),
      eastBoundingCoordinate: newBounds.east.toString(),
      westBoundingCoordinate: newBounds.west.toString()
    };
    
    handleChange(path, newData);
  }, [data, handleChange, path]);


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
        Click on the map to set initial bounds, or drag to create a selection area. You can also adjust coordinates manually.
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
          
          {/* Show rectangle if bounds are set */}
          {bounds.north !== 0 || bounds.south !== 0 || bounds.east !== 0 || bounds.west !== 0 ? (
            <Rectangle
              bounds={[
                [bounds.south, bounds.west],
                [bounds.north, bounds.east]
              ]}
              color="red"
              weight={2}
              fillOpacity={0.1}
            />
          ) : null}
          
          <InteractiveRectangle 
            bounds={bounds} 
            onBoundsChange={handleBoundsChange}
            onMapClick={handleMapClick}
          />
        </MapContainer>
      </Box>
    </Box>
  );
};

export default withJsonFormsControlProps(GeographicMapControl);
