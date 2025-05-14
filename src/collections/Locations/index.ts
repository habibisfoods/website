import { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Locations: CollectionConfig<'locations'> = {
  slug: 'locations',
  admin: {
    useAsTitle: 'storeName',
    defaultColumns: ['storeName', 'parentStore', 'address', 'city', 'province'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'parentStore',
      label: 'Parent Store',
      type: 'text',
      required: true,
      hooks: { beforeValidate: [({ value }) => value.trim().toUpperCase()] },
    },
    {
      name: 'storeName',
      label: 'Store Name',
      type: 'text',
      unique: true,
      required: true,
      hooks: { beforeValidate: [({ value }) => value.trim().toUpperCase()] },
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      required: true,
      hooks: { beforeValidate: [({ value }) => value.trim().toUpperCase()] },
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
      required: true,
      hooks: { beforeValidate: [({ value }) => value.trim().toUpperCase()] },
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
      hooks: { beforeValidate: [({ value }) => value?.trim().toUpperCase()] },
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
