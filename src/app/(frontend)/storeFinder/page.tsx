'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect, use } from 'react';
import * as turf from '@turf/turf';


const MapComponent = dynamic(() => import("@/components/Map/index"));
const DropdownSelector = dynamic(() => import("@/components/DropdownSelector/index"), { ssr: false });

export default function StoreFinderPage() {
  const [selectedItem, setSelectedItem] = useState('');

  const [locations, setLocations] = useState<any[]>([]);
  const [searchStores, setSearchStores] = useState('');
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [filteredLocations, setFilteredLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [kmRadius, setKmRadius] = useState(0);
  const [locationList, setLocationList] = useState<any[]>([]);

  console.log("locationList full:", locationList);



  const handleSearchStores = async () => {
    if (searchStores.length === 0) return;

    const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchStores)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`);
    const data = await res.json();

    if (data.features.length > 0) {
      const coords: [number, number] = [
        data.features[0].geometry.coordinates[0],
        data.features[0].geometry.coordinates[1],
      ];

      setUserCoords(coords);



      const originPoint = turf.point(coords);


      const nearby = await Promise.all(
        locations.map(async (loc) => {
          const address = [
            loc.FINAL_NAME,
            loc.Address_by_ID,
            loc.City_by_ID,
            loc.Province
          ].join(', ');


          const geores = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
          );
          const j = await geores.json();
          if (!j.features?.length) return null;


          const [lng, lat] = j.features[0].geometry.coordinates;
          const dest = turf.point([lng, lat]);
          const dist = turf.distance(originPoint, dest, { units: 'kilometers' });


          return dist <= kmRadius ? loc : null;
        })
      );

      setFilteredLocations(nearby.filter((loc) => loc !== null));





    } else {
      console.log("No results found for the given location.");
    }
  };





  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/locations?limit=1000`)
      .then((res) => res.json())
      .then((data) => {
        const locations = data.docs;

        setLocations(locations);
      })
      .catch((error) => {
        console.error('Error. Could not fetch locations:', error);
      });
  }, []);


  const listToDisplay = locationList.length > 0 ? locationList : filteredLocations.length > 0 ? filteredLocations : locations;





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

        <input type="number"
          placeholder='Set Radius'
          value={kmRadius}
          onChange={(e) => setKmRadius(Number(e.target.value))}
          className="w-full p-2 border border-grey-300 rounded mb-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />



        <button onClick={handleSearchStores} className="w-full bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-600 transition duration-200">
          Search
        </button>

        <ul className="space-y-3 text-black" >
          {listToDisplay.map((location) => (
            <li key={location.id} onClick={() => setSelectedLocation(location)} className="p-4 bg-gray-100 rounded shadow hover:bg-gray-200 transition duration-200">
              <h2 className="text-lg font-semibold">{location.FINAL_NAME}</h2>
              <p>{location.Address_by_ID}, {location.City_by_ID}, {location.Province}</p>
            </li>
          ))}
        </ul>

      </div>


      <div className="w-2/3 h-screen">
        <div className="w-full h-full">
          <MapComponent userCoords={userCoords} selectedItem={selectedItem} selectedLocation={selectedLocation} locationList={locationList} setLocationList={setLocationList} />        </div>
      </div>

    </div>







  );
}






