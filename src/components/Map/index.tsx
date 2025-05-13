"use client";

import React, { useEffect, useRef, useState } from "react";
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

async function fetchAllLocations() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/locations?limit=2000`);
  const data = await res.json();
  return data.docs;
}


const MapComponent: React.FC<MapComponentProps> = ({ userCoords, setLocations, selectedItem, selectedLocation, products }) => {

  // GLOBAL MAP COMPONENT VARIABLES
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  let markers = useRef<mapboxgl.Marker[]>([]);
  const [locationObj, setLocationObj] = useState<any[] | null>(null)

  // STARTUP USE EFFECT, RUNS ONCE
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

        // ONLY TIME DATABASE IS QUERIED
        fetchAllLocations().then((locationsObj) => {
          setLocationObj(locationsObj);
          plotPoints(locationsObj, mapRef.current, markers);

          map.addControl(new mapboxgl.FullscreenControl({ container: document.querySelector('body')! }));
          map.addControl(new mapboxgl.NavigationControl(), "top-left");
        });
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

        fetchAllLocations().then((locationsObj) => {
          setLocationObj(locationsObj);
          plotPoints(locationsObj, mapRef.current, markers);
        });

        map.addControl(new mapboxgl.FullscreenControl({ container: document.querySelector('body')! }));
        map.addControl(new mapboxgl.NavigationControl(), "top-left");

      },
      {
        enableHighAccuracy: true
      }
    );

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [setLocationObj]);







  // ITEM FILTER USE EFFECT, ONLY RUNS WHEN ITEM FILTER IS USED
  useEffect(() => {
    const plotFilteredMarkers = async () => {
      if (!mapRef.current) return;

      if(!selectedItem) {
        plotPoints(locationObj, mapRef.current, markers);
      }

      const selectedProduct = products.find((p: any) => p.productName === selectedItem);
      const selectedProductId = selectedProduct?.id;
      if (!selectedProductId) return;
      // const query = new URLSearchParams({
      //   'where[products][in]': selectedProductId, 'limit': '2000'
      // }).toString();

      // const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/locations?${query}`);
      // const data = await response.json();
      // const locations = data.docs;

      //----
      let locations: any[] = [];

      locationObj?.forEach((location) => {
        location.products.forEach((product: any) => {
          if (product.id === selectedProductId) {
            locations.push(location);
          }
        });
      });
      //----

      setLocations(locations);


      markers.current.forEach(marker => marker.remove());
      markers.current = [];

      plotPoints(locations, mapRef.current, markers);
    };

    plotFilteredMarkers();
  }, [selectedItem, products]);

// MOVES CAMERA WHEN SEARCHED BUTTON IS PRESSED
  useEffect(() => {
    if (userCoords && mapRef.current) {
      mapRef.current.flyTo({ center: userCoords, zoom: 12 });
    }
  }, [userCoords]);

  // TRIGGERS WHEN A LOCATION IS SELECTED ON THE LEFT PANEL
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