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
      required: true,
    },
    {
      name: 'productType',
      label: 'Product Type',
      type: 'relationship',
      relationTo: 'productTypes',
      required: true,
    },
    {
      name: 'location',
      label: 'Location',
      type: 'join',
      collection: 'locations',
      on: 'products',
    },
  ],
}
