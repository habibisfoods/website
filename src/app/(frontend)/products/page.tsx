import type { Metadata } from 'next/types'
import { getServerSideURL } from '@/utilities/getURL'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ProductCarousel } from '@/components/ProductCarousel'
import React from 'react'
import type { Product } from '@/payload-types'

export const dynamic = 'force-static'
export const revalidate = 600

type PTS = {
  title: string
  products: Product[]
}

export default async function Page() {
  const result = await generateCarouselProducts()

  return (
    <article className="pt-8 pb-16 flex flex-col gap-4 container">
      <h1 className="text-5xl text-center pb-4">All Products</h1>
      {result &&
        result.map((pts, index) => {
          return (
            <div key={index}>
              <h2 className="text-2xl pl-10 font-bold underline pb-2">{pts.title}</h2>
              {pts.products && pts.products.length > 0 && (
                <ProductCarousel products={pts.products} />
              )}
            </div>
          )
        })}
    </article>
  )
}

async function generateCarouselProducts(): Promise<PTS[] | null> {
  const payload = await getPayload({ config: configPromise })
  const productTypes = await payload.find({
    collection: 'productTypes',
    overrideAccess: false,
    depth: 1,
  })
  const types = productTypes.docs.reverse()
  const result: PTS[] = []

  if (types.length < 0) return null

  for (let i = 0; i < types.length; i++) {
    const products = await payload.find({
      collection: 'products',
      where: {
        productType: {
          equals: types[i]?.id,
        },
      },
    })

    result.push({
      title: types[i]?.productType || '',
      products: products.docs || [],
    })
  }

  return result
}

export function generateMetadata(): Metadata {
  return {
    title: `All Products | Habibis Mediterranean Foods`,
    description: 'Taste the flavours of the Mediterranean',
    openGraph: {
      images: [{ url: `${getServerSideURL()}/Toum-5.jpg` }],
    },
  }
}
