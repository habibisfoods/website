'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import * as turf from '@turf/turf'
import { getServerSideURL } from '@/utilities/getURL'

const MapComponent = dynamic(() => import('@/components/Map/index'))
const DropdownSelector = dynamic(() => import('@/components/DropdownSelector/index'), {
  ssr: false,
})

export default function StoreFinderPage() {
  const [allLocations, setAllLocations] = useState<any[]>([])
  //one filtered locaitons used now
  const [filteredLocations, setFilteredLocations] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState('')
  const [searchStores, setSearchStores] = useState('')
  const [kmRadius, setKmRadius] = useState('')
  const [userCoords, setUserCoords] = useState<[number, number]>([-123.1207, 49.2827])
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null)
  const [warningMessage, setWarningMessage] = useState('')

  const handleSearchStores = async () => {
    if (searchStores.length === 0) return

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchStores)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
    )
    const data = await res.json()

    if (data.features.length > 0) {
      const coords: [number, number] = data.features[0].geometry.coordinates
      setUserCoords(coords)

      await applyFilters(coords)
    } else {
      setWarningMessage('No results found for this location. Please try again.')
    }
  }

  const applyFilters = async (searchCoords: [number, number] | null) => {
    let radiusFiltered = allLocations

    if (searchCoords && Number(kmRadius) > 0) {
      const originPoint = turf.point(searchCoords)

      radiusFiltered = await Promise.all(
        allLocations.map((loc) => {
          if (loc.lon && loc.lat) {
            const dest = turf.point([loc.lon, loc.lat])
            const dist = turf.distance(originPoint, dest, { units: 'kilometers' })

            // adds distance to location object
            if (dist <= Number(kmRadius)) {
              return { ...loc, distance: dist.toFixed(2) }
            } else {
              return null
            }
          }
        }),
      )

      radiusFiltered = radiusFiltered.filter((loc) => loc !== null)
    } else if (searchCoords) {
      //get distance for everythign without km radius
      const originPoint = turf.point(searchCoords)
      radiusFiltered = await Promise.all(
        allLocations.map((loc) => {
          if (loc.lon && loc.lat) {
            const dest = turf.point([loc.lon, loc.lat])
            const dist = turf.distance(originPoint, dest, { units: 'kilometers' })

            return { ...loc, distance: dist.toFixed(2) }
          }
        }),
      )
    }

    let finalFiltered = radiusFiltered
    if (selectedItem) {
      const selectedProduct = products.find((p) => p.productType === selectedItem)
      if (selectedProduct) {
        finalFiltered = radiusFiltered.filter((loc) =>
          loc.products.some((p: any) => p.id === selectedProduct.id),
        )
      }
    }

    finalFiltered = finalFiltered.map((loc) => {
      const googleMapsQuery = `${loc.address.trim().replace(/\s+/g, '+')},+${loc.city.trim().replace(/\s+/g, '+')},+${loc.province.trim().replace(/\s+/g, '+')}`
      const googleMapsLink =
        'https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=' +
        googleMapsQuery

      return {
        ...loc,
        googleMapsLink,
      }
    })

    setFilteredLocations(finalFiltered)
  }

  useEffect(() => {
    applyFilters(userCoords)
  }, [selectedItem, allLocations, products])

  useEffect(() => {
    fetch(`${getServerSideURL()}/api/locations?limit=2000`)
      .then((res) => res.json())
      .then((data) => {
        setAllLocations(data.docs)
      })
      .catch((error) => {
        console.error('Error fetching locations:', error)
      })
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`${getServerSideURL()}/api/productTypes?limit=2000`)
      const data = await res.json()
      setProducts(data.docs)
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserCoords([longitude, latitude])
      },
      () => {
        setUserCoords([-123.1207, 49.2827])
      },
      { enableHighAccuracy: true },
    )
  }, [])

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-0 h-screen">
      <div className="md:w-1/3 bg-white shadow-lg p-4 max-h-96 md:max-h-screen overflow-y-scroll md:overflow-y-auto text-black">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Find a Store</h1>
          <div className="ml-4">
            <DropdownSelector selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
          </div>
        </div>
        {warningMessage && <div className="text-red-600 font-medium mb-2">{warningMessage}</div>}
        <input
          type="text"
          placeholder="Enter a location"
          value={searchStores}
          onChange={(e) => {
            setSearchStores(e.target.value)
            setWarningMessage('')
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearchStores()}
          className="w-full p-2 border border-grey-300 rounded mb-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />

        <input
          type="number"
          inputMode="numeric"
          placeholder="Set Radius (Km)"
          min="0"
          value={kmRadius}
          onChange={(e) => {
            const value = e.target.value

            if (value === '' || /^\d+$/.test(value)) {
              setKmRadius(value)
            }
          }}
          className="w-full p-2 border rounded mb-4 text-black placeholder-gray-400 focus:outline-none transition duration-200"
        />

        <button
          onClick={handleSearchStores}
          className="w-full bg-orange-600 text-white p-2 rounded mb-4 hover:bg-orange-600/90 transition duration-200"
        >
          Search
        </button>

        <ul className="space-y-3 text-black">
          {filteredLocations
            .sort((a, b) => a.distance - b.distance)
            .map((location) => (
              <li
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className="p-4 bg-gray-100 rounded shadow hover:bg-gray-200 transition duration-200"
              >
                <h2 className="text-lg font-semibold">{location.storeName}</h2>

                <p>
                  {location.unit && <span>{location.unit} - </span>}
                  {location.address} {location.street} {location.city}, {location.province}
                  <br />
                  {location.postalCode}
                </p>
                {location.distance && (
                  <p className="text-sm text-gray-600">Distance: {location.distance} km</p>
                )}
                <a
                  href={location.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-orange-600 text-base font-semibold mt-1"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  Get Directions
                </a>
              </li>
            ))}
        </ul>
      </div>

      <div className="w-full h-full md:w-2/3 md:h-screen">
        <div className="w-full h-full">
          <MapComponent
            userCoords={userCoords}
            selectedLocation={selectedLocation}
            locations={filteredLocations}
          />
        </div>
      </div>
    </div>
  )
}
