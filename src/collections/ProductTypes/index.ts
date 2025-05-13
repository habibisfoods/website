import { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'

export const ProductTypes: CollectionConfig = {
  slug: 'productTypes',
  defaultPopulate: {
    slug: true,
  },
  admin: {
    useAsTitle: 'productName',
    defaultColumns: ['productName', 'defaultImage'],
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
    ...slugField(),
  ],
}
