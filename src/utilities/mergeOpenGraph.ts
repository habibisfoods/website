import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Vegetarian food with a Mediterranean twist',
  images: [
    {
      url: `${getServerSideURL()}/Habibis-Full-Logo.svg`,
    },
  ],
  siteName: 'Habibis Mediterranean Foods',
  title: 'Habibis Mediterranean Foods',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
