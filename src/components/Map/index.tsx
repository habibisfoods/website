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
  locations.forEach(async (loc) => {
    if (!loc.lon || !loc.lat) {
      return
    }
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

    const address = loc.unit ? `${loc.unit} - ${loc.address}` : loc.address

    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'center',
    })
      .setLngLat([loc.lon, loc.lat])
      .setPopup(
        new mapboxgl.Popup({ closeButton: false }).setHTML(`
            <div style="color: black; position: relative;">
              <div style="text-align: right;">

                <button 
                  onclick="this.closest('.mapboxgl-popup').remove()"
                  style="
                    position: relative;
                    font-size: 26px;
                    font-weight: bold;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: black;
                  ">
                  ×
                </button>
              </div>

              <strong>${loc.storeName}</strong><br/>
              ${address} ${loc.street}<br/>
              ${loc.city}, ${loc.province} <br/>

              <a 
                href="${loc.googleMapsLink}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="block text-orange-600 text-base font-semibold mt-1">
                Get Directions
              </a>

            </div>`),
      )
      .addTo(currentMap)
    markers.current.push(marker)
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
      mapRef.current?.flyTo({ center: [selectedLocation.lon, selectedLocation.lat], zoom: 14 })

      const marker = markers.current.find((m) => {
        const pos = m.getLngLat()
        return pos.lng === selectedLocation.lon && pos.lat === selectedLocation.lat
      })
      marker?.togglePopup()
    }
  }, [selectedLocation])

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
}

export default MapComponent
