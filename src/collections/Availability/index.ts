import { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const Availability: CollectionConfig = {
  slug: 'availability',
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
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'storeName',
      label: 'Store Name',
      type: 'relationship',
      relationTo: 'locations',
      required: true,
    },
  ],
}
