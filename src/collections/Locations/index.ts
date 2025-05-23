import { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { coordsAfterChangeHook } from './hooks/getCoords'
import { FieldHook } from 'payload'
import { Location } from '@/payload-types'

type UpperCaseHook = FieldHook<Location, string | undefined>
const upperCaseHook: UpperCaseHook = (args) => {
  const { value } = args
  if (typeof value === 'string') {
    return value.trim().toUpperCase()
  }
  return value
}

export const Locations: CollectionConfig<'locations'> = {
  slug: 'locations',
  admin: {
    useAsTitle: 'storeName',
    defaultColumns: ['storeName', 'address', 'street', 'city', 'province'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [coordsAfterChangeHook],
  },
  fields: [
    {
      name: 'parentStore',
      label: 'Parent Store',
      type: 'text',
      required: true,
      hooks: {
        beforeValidate: [upperCaseHook],
      },
    },
    {
      name: 'storeName',
      label: 'Store Name',
      type: 'text',
      unique: true,
      required: true,
      hooks: {
        beforeValidate: [upperCaseHook],
      },
    },
    {
      name: 'address',
      label: 'Address Number (Omit street & unit #)',
      type: 'text',
      required: true,
      hooks: {
        beforeValidate: [upperCaseHook],
      },
    },
    {
      name: 'street',
      label: 'Street',
      type: 'text',
      required: true,
      hooks: {
        beforeValidate: [upperCaseHook],
      },
    },
    {
      name: 'unit',
      label: 'Building/Unit #',
      type: 'text',
      hooks: {
        beforeValidate: [upperCaseHook],
      },
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
      required: true,
      hooks: {
        beforeValidate: [upperCaseHook],
      },
    },
    {
      name: 'province',
      label: 'Province',
      type: 'select',
      options: ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'],
      required: true,
    },
    {
      name: 'postalCode',
      label: 'Postal Code',
      type: 'text',
      hooks: {
        beforeValidate: [upperCaseHook],
      },
    },
    {
      name: 'lon',
      label: 'Longitude',
      type: 'number',
      admin: { position: 'sidebar' },
    },
    {
      name: 'lat',
      label: 'Latitude',
      type: 'number',
      admin: { position: 'sidebar' },
    },
    {
      name: 'products',
      label: 'Products',
      type: 'relationship',
      relationTo: 'productTypes',
      hasMany: true,
    },
  ],
}
