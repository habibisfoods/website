import { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    useAsTitle: 'storeName',
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
    },
    {
      name: 'storeName',
      label: 'Store Name',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      required: true,
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
      required: true,
    },
    {
      name: 'province',
      label: 'Province',
      type: 'text',
      required: true,
    },
    {
      name: 'products',
      label: 'Products',
      type: 'relationship',
      hasMany: true,
      required: true,
      relationTo: 'products',
    },
  ],
}
