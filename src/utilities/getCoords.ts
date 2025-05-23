import { Location } from '@/payload-types'

export type Coordinate = {
  longitude: number
  latitude: number
}

export async function getCoords(loc: Location): Promise<Coordinate | undefined> {
  const params = new URLSearchParams({
    address_number: loc.address,
    street: loc.street,
    place: loc.city,
    region: loc.province,
    postcode: loc.postalCode || '',
    country: 'Canada',
    proximity: 'ip',
    access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!,
  }).toString()

  const url = `https://api.mapbox.com/search/geocode/v6/forward?${params}`

  const res = await fetch(url)
  const geo = await res.json()
  if (geo.features?.length) {
    const [lon, lat] = geo.features[0].geometry.coordinates
    return { longitude: lon, latitude: lat }
  }
}
