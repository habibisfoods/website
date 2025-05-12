import { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const ProductTypes: CollectionConfig = {
  slug: 'productTypes',
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
      name: 'defaultImage',
      type: 'upload',
      relationTo: 'media',
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
