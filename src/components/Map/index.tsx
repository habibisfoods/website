'use client'

import React, { useEffect, useRef } from 'react'
import mapboxgl, { Marker } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

interface MapComponentProps {
  userCoords: [number, number]
  selectedLocation: any | null
  locations: any[]
}

function plotPoints(locations: any[], markers: any, currentMap?: any) {
  if (!locations || locations.length === 0) return

  locations.forEach((loc: any) => {
    const params = new URLSearchParams({
      address_number: loc.address,
      street: loc.street,
      place: loc.city,
      region: loc.province,
      postcode: loc.postalCode || '',
      country: 'Canada',
      proximity: 'ip',
      access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!,
    })
    const url = `https://api.mapbox.com/search/geocode/v6/forward?${params.toString()}`
    fetch(url)
      .then((res) => res.json())
      .then((geo) => {
        if (!geo.features?.length) return

        const [lng, lat] = geo.features[0].geometry.coordinates

        const el = document.createElement('div')
        el.style.width = '30px'
        el.style.height = '30px'
        el.style.position = 'absolute'
        el.style.display = 'flex'
        el.style.alignItems = 'center'
        el.style.justifyContent = 'center'
        el.style.pointerEvents = 'auto'

        const img = document.createElement('img')
        img.src = '/favicon.svg'
        img.style.width = '100%'
        img.style.height = '100%'
        img.style.objectFit = 'contain'
        img.style.transition = 'transform 0.2s ease'
        img.style.transformOrigin = 'center'

        img.addEventListener('mouseenter', () => (img.style.transform = 'scale(1.2)'))
        img.addEventListener('mouseleave', () => (img.style.transform = 'scale(1)'))

        el.appendChild(img)

        const marker = new mapboxgl.Marker({
          element: el,
          anchor: 'center',
        })
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(`
              <div style="color: black;">
                <strong>${loc.storeName}</strong><br/>
                ${loc.address} ${loc.street}<br/>
                ${loc.city}, ${loc.province} <br/>
                <a 
                href="${loc.googleMapsLink}" target="_blank" rel="noopener noreferrer" class="block text-blue-600 text-base font-semibold mt-1">
                Get Directions
                </a>  
              </div>
            `),
          )
          .addTo(currentMap)

        markers.current.push(marker)
      })
  })
}

const MapComponent: React.FC<MapComponentProps> = ({ userCoords, selectedLocation, locations }) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<Marker[]>([])

  // Initialize map once on startup
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      center: userCoords,
      zoom: 12,
      maxZoom: 15,
    })

    mapRef.current = map
    map.addControl(new mapboxgl.FullscreenControl({ container: document.body }))
    map.addControl(new mapboxgl.NavigationControl(), 'top-left')

    return () => mapRef.current?.remove()
  }, [])

  // Update markers whenever locations change
  useEffect(() => {
    // if (!mapRef.current) return;

    markers.current.forEach((marker) => marker.remove())
    markers.current = []

    plotPoints(locations, markers, mapRef.current)
  }, [locations])

  // Moves map camera when userCoords updates
  useEffect(() => {
    if (userCoords && mapRef.current) {
      mapRef.current.flyTo({ center: userCoords, zoom: 12 })
    }
  }, [userCoords])

  // Focus on selected location marker
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      // const address = `${selectedLocation.parentStore}, ${selectedLocation.address}, ${selectedLocation.city}, ${selectedLocation.province}`;
      const params = new URLSearchParams({
        address_number: selectedLocation.address,
        street: selectedLocation.street,
        place: selectedLocation.city,
        region: selectedLocation.province,
        postcode: selectedLocation.postalCode || '',
        country: 'Canada',
        proximity: 'ip',
        access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!,
      })
      const url = `https://api.mapbox.com/search/geocode/v6/forward?${params.toString()}`
      fetch(url)
        .then((res) => res.json())
        .then((geo) => {
          if (geo.features?.length) {
            const [lng, lat] = geo.features[0].geometry.coordinates
            mapRef.current?.flyTo({ center: [lng, lat], zoom: 14 })

            const marker = markers.current.find((m) => {
              const pos = m.getLngLat()
              return pos.lng === lng && pos.lat === lat
            })
            marker?.togglePopup()
          }
        })
    }
  }, [selectedLocation])

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
}

export default MapComponent
