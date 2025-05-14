import { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const ProductTypes: CollectionConfig<'productTypes'> = {
  slug: 'productTypes',
  admin: {
    useAsTitle: 'productType',
    defaultColumns: ['productType', 'defaultImage'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'productType',
      label: 'Product Type',
      type: 'text',
      unique: true,
      required: true,
    },
    {
      name: 'defaultImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'products',
      label: 'Products',
      type: 'join',
      collection: 'products',
      on: 'productType',
    },
    {
      name: 'locations',
      label: 'Locations',
      type: 'join',
      collection: 'locations',
      on: 'products',
    },
  ],
}
