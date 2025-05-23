import { CollectionAfterChangeHook } from 'payload'
import { Location } from '@/payload-types'

export const coordsAfterChangeHook: CollectionAfterChangeHook<Location> = async ({
  context,
  doc,
  req,
}) => {
  if (context.triggerAfterChange === false) {
    return
  }
  const params = new URLSearchParams({
    address_number: doc.address,
    street: doc.street,
    place: doc.city,
    region: doc.province,
    postcode: doc.postalCode || '',
    country: 'Canada',
    proximity: 'ip',
    access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!,
  }).toString()

  const url = `https://api.mapbox.com/search/geocode/v6/forward?${params}`

  await fetch(url)
    .then((res) => res.json())
    .then((geo) => {
      if (geo.features?.length) {
        return geo.features[0].geometry.coordinates
      } else {
        return null
      }
    })
    .then((coords) => {
      if (coords) {
        req.payload.update({
          collection: 'locations',
          id: doc.id,
          data: {
            lon: coords[0],
            lat: coords[1],
          },
          context: {
            triggerAfterChange: false,
          },
        })
      }
    })
}
