import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Carousel: Block = {
  slug: 'carousel',
  interfaceName: 'CarouselBlock',
  fields: [
    {
      name: 'introContent',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Intro Content',
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'all',
      options: [
        {
          label: 'All Products',
          value: 'all',
        },
        {
          label: 'Product Type',
          value: 'type',
        },
      ],
    },
    {
      name: 'selectedType',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'type',
      },
      relationTo: 'productTypes',
      label: 'Product Type To Show',
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        step: 1,
      },
      defaultValue: 10,
      label: 'Limit',
    },
  ],
  labels: {
    plural: 'Carousels',
    singular: 'Carousel',
  },
}
