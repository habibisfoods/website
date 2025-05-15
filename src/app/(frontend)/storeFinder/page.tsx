'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import * as turf from '@turf/turf';

const MapComponent = dynamic(() => import("@/components/Map/index"));
const DropdownSelector = dynamic(() => import("@/components/DropdownSelector/index"), { ssr: false });

export default function StoreFinderPage() {
  const [allLocations, setAllLocations] = useState<any[]>([]);
  //one filtered locaitons used now
  const [filteredLocations, setFilteredLocations] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [searchStores, setSearchStores] = useState('');
  const [kmRadius, setKmRadius] = useState(0);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);

  const handleSearchStores = async () => {
    if (searchStores.length === 0) return;

    const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchStores)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`);
    const data = await res.json();

    if (data.features.length > 0) {
      const coords: [number, number] = data.features[0].geometry.coordinates;
      setUserCoords(coords);

      await applyFilters(coords);
    } else {
      console.log("No results found for the given location.");
    }
  };
  

 const applyFilters = async (searchCoords: [number, number] | null) => {
  let radiusFiltered = allLocations;

  if (searchCoords && kmRadius > 0) {
    const originPoint = turf.point(searchCoords);

    radiusFiltered = await Promise.all(allLocations.map(async (loc) => {
      const address = `${loc.store_name}, ${loc.address}, ${loc.city}, ${loc.province}`;
      const geoRes = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`);
      const geoData = await geoRes.json();
      if (!geoData.features?.length) return null;

      const [lng, lat] = geoData.features[0].geometry.coordinates;
      const dest = turf.point([lng, lat]);
      const dist = turf.distance(originPoint, dest, { units: 'kilometers' });

      // adds distance to location object
      if (dist <= kmRadius) {
        return { ...loc, distance: dist.toFixed(2) };
      } else {
        return null;
      }
    }));

    radiusFiltered = radiusFiltered.filter((loc) => loc !== null);


    

  } else if (searchCoords) {
    //get distance for everythign without km radius
    const originPoint = turf.point(searchCoords);
    radiusFiltered = await Promise.all(allLocations.map(async (loc) => {
      const address = `${loc.store_name}, ${loc.address}, ${loc.city}, ${loc.province}`;
      const geoRes = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`);
      const geoData = await geoRes.json();
      if (!geoData.features?.length) return null;

      const [lng, lat] = geoData.features[0].geometry.coordinates;
      const dest = turf.point([lng, lat]);
      const dist = turf.distance(originPoint, dest, { units: 'kilometers' });

      return { ...loc, distance: dist.toFixed(2) };
    }));
  }

 
  let finalFiltered = radiusFiltered;
  if (selectedItem) {
    const selectedProduct = products.find(p => p.productType === selectedItem);
    if (selectedProduct) {
      finalFiltered = radiusFiltered.filter(loc =>
        loc.products.some((p: any) => p.id === selectedProduct.id)
      );
    }
  }

  finalFiltered = finalFiltered.map((loc) => {
  const googleMapsQuery = `${loc.address.trim().replace(/\s+/g, '+')},+${loc.city.trim().replace(/\s+/g, '+')},+${loc.province.trim().replace(/\s+/g, '+')}`;
  const googleMapsLink = 'https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=' + googleMapsQuery;

  return {
    ...loc,
    googleMapsLink,
  };
});
    


  setFilteredLocations(finalFiltered);
};



  useEffect(() => {
    applyFilters(userCoords);
  }, [selectedItem, allLocations, products, kmRadius]);


  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/locations?limit=2000`)
      .then((res) => res.json())
      .then((data) => {
        setAllLocations(data.docs);
      })
      .catch((error) => {
        console.error('Error fetching locations:', error);
      });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/productTypes?limit=2000`);
      const data = await res.json();
      setProducts(data.docs); 
    };
    fetchProducts();
  }, []);


  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-white shadow-lg p-4 overflow-y-auto text-black">
        <div className="flex flex-col gap-4">
          <DropdownSelector selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
        </div>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Find a Store</h1>

        <input
          type="text"
          placeholder="Enter a location"
          value={searchStores}
          onChange={(e) => setSearchStores(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearchStores()}
          className="w-full p-2 border border-grey-300 rounded mb-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />

        <input
          type="number"
          placeholder="Set Radius"
          min="0"
          value={kmRadius}
          onChange={(e) => setKmRadius(Number(e.target.value))}
          className="w-full p-2 border border-grey-300 rounded mb-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />

        <button
          onClick={handleSearchStores}
          className="w-full bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-600 transition duration-200"
        >
          Search
        </button>

        <ul className="space-y-3 text-black">
          {filteredLocations.map((location) => (
            <li
              key={location.id}
              onClick={() => setSelectedLocation(location)}
              className="p-4 bg-gray-100 rounded shadow hover:bg-gray-200 transition duration-200"
            >
              <h2 className="text-lg font-semibold">{location.storeName}</h2>
              <p>{location.address}, {location.city}, {location.province}</p>
              {location.distance && (
              <p className="text-sm text-gray-600">
                Distance: {location.distance} km
              </p>
          )}
              <a
                href={location.googleMapsLink} target="_blank" rel="noopener noreferrer" className="block text-blue-600 text-base font-semibold mt-1" onClick={(e) => {
                  e.stopPropagation(); 
                }}
              >
                Get Directions
            </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-2/3 h-screen">
        <div className="w-full h-full">
          <MapComponent
          userCoords={userCoords}
          selectedLocation={selectedLocation}
          locations={filteredLocations} 
          setUserCoords={setUserCoords}
        />
        </div>
      </div>
    </div>
  );
}
