import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';

const MealMap = ({ meals, center, zoom = 12 }) => {
  const [selectedMeal, setSelectedMeal] = useState(null);

  const mapContainerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '8px'
  };

  const defaultCenter = center || {
    lat: 39.1031,
    lng: -84.5120
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={zoom}
      >
        {meals.map((meal) => {
          // Parse location if it's in POINT format
          let position = null;
          
          if (meal.restaurant_location) {
            // Handle PostGIS POINT format
            const match = meal.restaurant_location.match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/);
            if (match) {
              position = {
                lng: parseFloat(match[1]),
                lat: parseFloat(match[2])
              };
            }
          } else if (meal.lat && meal.lng) {
            // Handle separate lat/lng fields
            position = {
              lat: parseFloat(meal.lat),
              lng: parseFloat(meal.lng)
            };
          }

          if (!position) return null;

          return (
            <Marker
              key={meal.id}
              position={position}
              onClick={() => setSelectedMeal(meal)}
              icon={{
                url: meal.is_free 
                  ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                  : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              }}
            />
          );
        })}

        {selectedMeal && (
          <InfoWindow
            position={{
              lat: parseFloat(selectedMeal.lat),
              lng: parseFloat(selectedMeal.lng)
            }}
            onCloseClick={() => setSelectedMeal(null)}
          >
            <div style={{ padding: '0.5rem', maxWidth: '250px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                {selectedMeal.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>
                📍 {selectedMeal.restaurant_name}
              </p>
              {selectedMeal.description && (
                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {selectedMeal.description}
                </p>
              )}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {selectedMeal.is_free ? (
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    backgroundColor: '#10b98120', 
                    color: '#10b981', 
                    borderRadius: '4px', 
                    fontWeight: '600',
                    fontSize: '0.875rem'
                  }}>
                    FREE
                  </span>
                ) : (
                  <span style={{ fontSize: '1rem', fontWeight: '600', color: '#667eea' }}>
                    ${selectedMeal.discounted_price}
                  </span>
                )}
                {selectedMeal.distance_km && (
                  <span style={{ fontSize: '0.75rem', color: '#666' }}>
                    {parseFloat(selectedMeal.distance_km).toFixed(1)} km away
                  </span>
                )}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MealMap;