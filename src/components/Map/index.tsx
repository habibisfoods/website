"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl, { GeoJSONSource, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { stringify } from "qs-esm";
import { Where } from "payload";


// FILTERING FUNCTION, UNUESD FOR NOW
// const getProducts = async (item: string) => {

//   let formattedLocations: string[];
//   let locationOBJ: any;

//   const product_query: Where = {
//     'product_id.product_name': {
//       equals: item,
//     },
//   }

//   let stringifiedQuery = stringify(
//     {
//       where: product_query,
//     },
//     { addQueryPrefix: true },
//   )

//   const product_response = await fetch(
//     `${process.env.NEXT_PUBLIC_SERVER_URL}/api/product_availability${stringifiedQuery}`,
//   );

//   const product_data = await product_response.json();
//   locationOBJ = product_data.docs;

//   formattedLocations = locationOBJ.map(
//     (loc: any) => `${loc.location_id.FINAL_NAME}, ${loc.location_id.Address_by_ID}, ${loc.location_id.City_by_ID}, ${loc.location_id.Province}`
//   );
//   
// }

interface MapComponentProps {
  userCoords: [number, number] | null;
  selectedItem: string | null;
  selectedLocation: any | null;
  locationList: any | null;
  setLocationList: any | null;
}

function plotPoints(locations: any, currentMap: any, markers: any) {
  locations.forEach((loc: any) => {
    let address: string = "";
    let marker: Marker;

    if (!loc.product_id) {
      address = `${loc.FINAL_NAME}, ${loc.Address_by_ID}, ${loc.City_by_ID}, ${loc.Province}`;
    } else {
      address = `${loc.location_id.FINAL_NAME}, ${loc.location_id.Address_by_ID}, ${loc.location_id.City_by_ID}, ${loc.location_id.Province}`;
    }

    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`)
      .then(res => res.json())
      .then(geo => {
        if (!geo.features?.length) return;

        const [lng, lat] = geo.features[0].geometry.coordinates;

        if (!loc.product_id) {
          marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup().setHTML(`
                  <div style="color: black;">
                    ${loc.FINAL_NAME}<br/>
                    ${loc.Address_by_ID}<br/>
                    ${loc.City_by_ID}, ${loc.Province}
                  </div>
                `))
            .addTo(currentMap);
        } else {
          marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup().setHTML(`
                  <div style="color: black;">
                    ${loc.location_id.FINAL_NAME}<br/>
                    ${loc.location_id.Address_by_ID}<br/>
                    ${loc.location_id.City_by_ID}, ${loc.location_id.Province}
                  </div>
                `))
            .addTo(currentMap);
        }


        markers.current.push(marker);
      });
  });
}

const MapComponent: React.FC<MapComponentProps> = ({ userCoords, selectedItem, selectedLocation, locationList, setLocationList }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  let markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        center: [-123.1207, 49.2827],
        zoom: 10,
        maxZoom: 15,
      });

      mapRef.current = map;

      const plotMarkers = async () => {
        if (!selectedItem) return;

        const query: Where = {
          'product_id.product_name': { equals: selectedItem }
        };

        const stringifiedQuery = stringify({ where: query }, { addQueryPrefix: true });

        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/product_availability${stringifiedQuery}`);
        const data = await response.json();
        const locations = data.docs;



        //look here
        setLocationList(locations.map((loc: any) => loc.location_id));




        markers.current.forEach(marker => marker.remove());
        plotPoints(locations, map, markers)
      };

      plotMarkers();

      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/locations?limit=1000`)
        .then((res) => res.json())
        .then((data) => {
          markers.current.forEach(marker => marker.remove());
          const locations = data.docs;
          plotPoints(locations, map, markers)

          //fullscreen 
          map.addControl(new mapboxgl.FullscreenControl({ container: document.querySelector('body') }));

          // Add zoom controls
          map.addControl(new mapboxgl.NavigationControl(), "top-left");

        });

      // Clean up on unmount
      return () => {
        map.remove();
        mapRef.current = null;
      };
    }
  }, [selectedItem]);


  useEffect(() => {
    if (userCoords && mapRef.current) {
      mapRef.current.flyTo({ center: userCoords, zoom: 12 });
    }
  }, [userCoords]);


  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      const address = `${selectedLocation.FINAL_NAME}, ${selectedLocation.Address_by_ID}, ${selectedLocation.City_by_ID}, ${selectedLocation.Province}`;

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