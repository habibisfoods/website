"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl, { Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { set } from "react-hook-form";

interface MapComponentProps {
  userCoords: [number, number] | null;
  selectedLocation: any | null;
  locations: any[];
  setUserCoords: (coords: [number, number]) => void; 
}

function plotPoints(locations: any[], currentMap: any, markers: any) {
  if (!locations || locations.length === 0) return;

  locations.forEach((loc: any) => {
    const address = `${loc.address}, ${loc.city}, ${loc.province}`;

    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`)
      .then(res => res.json())
      .then(geo => {
        if (!geo.features?.length) return;

        const [lng, lat] = geo.features[0].geometry.coordinates;

        const marker = new mapboxgl.Marker({
          color: "#FF0000",
        })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup().setHTML(`
              <div style="color: black;">
                <strong>${loc.storeName}</strong><br/>
                ${loc.address}<br/>
                ${loc.city}, ${loc.province} <br/>
                <a 
                href="${loc.googleMapsLink}" target="_blank" rel="noopener noreferrer" class="block text-blue-600 underline text-sm mt-1">
                Get Directions
                </a>  
              </div>
            `))
          .addTo(currentMap);

        markers.current.push(marker);
      });
  });
}

const MapComponent: React.FC<MapComponentProps> = ({ userCoords, selectedLocation, locations, setUserCoords }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<Marker[]>([]);

  // Initialize map once on startup
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setUserCoords([longitude, latitude]);

        const map = new mapboxgl.Map({
          container: mapContainer.current!,
          center: [longitude, latitude],
          zoom: 12,
          maxZoom: 15,
        });

        mapRef.current = map;
        map.addControl(new mapboxgl.FullscreenControl({ container: document.body }));
        map.addControl(new mapboxgl.NavigationControl(), "top-left");
      },
      () => {
        const map = new mapboxgl.Map({
          container: mapContainer.current!,
          center: [-123.1207, 49.2827],
          zoom: 12,
          maxZoom: 15,
        });

        mapRef.current = map;
        map.addControl(new mapboxgl.FullscreenControl({ container: document.body }));
        map.addControl(new mapboxgl.NavigationControl(), "top-left");
      },
      { enableHighAccuracy: true }
    );

    return () => mapRef.current?.remove();
  }, []);

  // Update markers whenever locations change
  useEffect(() => {
    // if (!mapRef.current) return;

    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    plotPoints(locations, mapRef.current, markers);
  }, [locations]);

  // Moves map camera when userCoords updates
  useEffect(() => {
    if (userCoords && mapRef.current) {
      mapRef.current.flyTo({ center: userCoords, zoom: 12 });
    }
  }, [userCoords]);

  // Focus on selected location marker
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      const address = `${selectedLocation.parentStore}, ${selectedLocation.address}, ${selectedLocation.city}, ${selectedLocation.province}`;

      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`)
        .then(res => res.json())
        .then(geo => {
          if (geo.features?.length) {
            const [lng, lat] = geo.features[0].geometry.coordinates;
            mapRef.current?.flyTo({ center: [lng, lat], zoom: 14 });

            const marker = markers.current.find(m => {
              const pos = m.getLngLat();
              return pos.lng === lng && pos.lat === lat;
            });
            marker?.togglePopup();
          }
        });
    }
  }, [selectedLocation]);

  return (
    <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
  );
};

export default MapComponent;
