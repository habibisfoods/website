"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl, { GeoJSONSource, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapComponentProps {
  userCoords: [number, number] | null;
  selectedItem: string | null;
  selectedLocation: any | null;
  products: any[];
  setLocations: any;
}

function plotPoints(locations: any, currentMap: any, markers: any) {
  locations.forEach((loc: any) => {
    const address = `${loc.address}, ${loc.city}, ${loc.province}`;

    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`)
      .then(res => res.json())
      .then(geo => {
        if (!geo.features?.length) return;

        const [lng, lat] = geo.features[0].geometry.coordinates;

        const googleMapsQuery = `${loc.address.trim().replace(/\s+/g, '+')},+${loc.city.trim().replace(/\s+/g, '+')},+${loc.province.trim().replace(/\s+/g, '+')}`;
        const googleMapsLink = 'https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=' + googleMapsQuery;

        const marker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup().setHTML(`
              <div style="color: black;">
                ${loc.storeName}<br/>
                ${loc.address}<br/>
                ${loc.city}, ${loc.province} <br/>
                <a href=\'${googleMapsLink}\' target=\'_blank\'>Get Directions</a>
              </div>
            `))
          .addTo(currentMap);

        markers.current.push(marker);
      });
  });
}

const MapComponent: React.FC<MapComponentProps> = ({ userCoords, setLocations, selectedItem, selectedLocation, products}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  let markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const map = new mapboxgl.Map({
        container: mapContainer.current!,
        center: [longitude, latitude],
        zoom: 12,
        maxZoom: 15,
      });

      mapRef.current = map;

      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/locations?limit=2000`)
        .then(res => res.json())
        .then(data => {
          plotPoints(data.docs, map, markers);
        });

      map.addControl(new mapboxgl.FullscreenControl({ container: document.querySelector('body')! }));
      map.addControl(new mapboxgl.NavigationControl(), "top-left");
    },
    (error) => {
      console.error("Error getting location:", error);
      const map = new mapboxgl.Map({
        container: mapContainer.current!,
        center: [-123.1207, 49.2827], 
        zoom: 12,
        maxZoom: 15,
      });

      mapRef.current = map;

      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/locations?limit=2000`)
        .then(res => res.json())
        .then(data => {
          plotPoints(data.docs, map, markers);
        });

      map.addControl(new mapboxgl.FullscreenControl({ container: document.querySelector('body')! }));
      map.addControl(new mapboxgl.NavigationControl(), "top-left");
    },
    { enableHighAccuracy: true }
  );


  return () => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  };
}, []);

    

      

     useEffect(() => {
    const plotFilteredMarkers = async () => {
      if (!selectedItem || !mapRef.current) return;
      
      const selectedProduct = products.find((p: any) => p.productName === selectedItem );
      
     
      const selectedProductId = selectedProduct?.id;
      if (!selectedProductId) return;
      

      const query = new URLSearchParams({
        'where[products][in]': selectedProductId, 'limit': '2000'
      }).toString();

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/locations?${query}`);
      const data = await response.json();
      const locations = data.docs;

      setLocations(locations);

    
      markers.current.forEach(marker => marker.remove());
      markers.current = [];

      plotPoints(locations, mapRef.current, markers);
    };

    plotFilteredMarkers();
  }, [selectedItem, products]);


  useEffect(() => {
    if (userCoords && mapRef.current) {
      mapRef.current.flyTo({ center: userCoords, zoom: 12 });
    }
  }, [userCoords]);


  useEffect(() => {
    if (selectedLocation && mapRef.current) {
  const address = `${selectedLocation.parentStore}, ${selectedLocation.address}, ${selectedLocation.city}, ${selectedLocation.province}`;

      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`)
        .then(res => res.json())
        .then(geo => {

          if (geo.features?.length) {
            const [lng, lat] = geo.features[0].geometry.coordinates;
            mapRef.current?.flyTo({
              center: [lng, lat],
              zoom: 14
            });

            const marker = markers.current.find(m => {
              const markerLngLat = m.getLngLat();
              return markerLngLat.lng === lng && markerLngLat.lat === lat;
            });
            marker?.togglePopup();
          }
        });
    }
  }, [selectedLocation]);


  return (

    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default MapComponent;