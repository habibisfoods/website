import { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'productName',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'productName',
      label: 'Product Name',
      type: 'text',
      unique: true,
      required: true,
    },
    {
      name: 'productImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'productType',
      label: 'Product Type',
      type: 'relationship',
      relationTo: 'productTypes',
      required: true,
    },
    {
      name: 'locations',
      label: 'Locations',
      type: 'join',
      collection: 'availability',
      on: 'productName',
    },
  ],
}
