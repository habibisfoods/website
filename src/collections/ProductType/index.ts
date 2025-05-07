import { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const ProductTypes: CollectionConfig = {
  slug: 'productTypes',
  admin: {
    useAsTitle: 'productType',
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
      required: true,
    },
    {
      name: 'products',
      label: 'Products',
      type: 'join',
      collection: 'products',
      on: 'productType',
    },
  ],
}
