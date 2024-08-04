import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ city, animate }) => {
  const [position, setPosition] = useState([51.505, -0.09]); // Default position (London)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCoordinates = async () => {
      setLoading(true);
      try {
        const apiKey = '0a3268c161bf99b890901132475ac31f'; // Replace with your actual API key
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`);
        const data = await response.json();
        if (data.coord) {
          setPosition([data.coord.lat, data.coord.lon]);
        } else {
          console.error('Coordinates not found for city:', city);
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchCoordinates();
    }
  }, [city]);

  const MapCenter = () => {
    const map = useMap();
    useEffect(() => {
      if (position) {
        if (animate) {
          map.flyTo(position, 10, { duration: 2 });
        } else {
          map.setView(position, 10);
        }
      }
    }, [position, animate, map]);

    return null;
  };

  return (
    <MapContainer center={position} zoom={10} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapCenter />
      <Marker position={position} icon={new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        shadowSize: [41, 41]
      })}>
        <Popup>
          {city}
        </Popup>
      </Marker>
      {loading && <div className="loading">Loading...</div>}
    </MapContainer>
  );
};

export default Map;