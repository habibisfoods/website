import type { Metadata } from 'next'

import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Product } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { generateMeta } from '@/utilities/generateMeta'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { ProductCarousel } from '@/components/ProductCarousel'
import { Media } from '@/components/Media'
import { ImageSelect } from '@/components/ImageSelect'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = products.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Product({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/products/' + slug
  const product = await queryProductBySlug({ slug })

  if (!product) return <PayloadRedirects url={url} />

  const carouselProducts = await generateCarouselProducts(product)

  return (
    <article className="pt-8 pb-16">
      <PayloadRedirects disableNotFound url={url} />
      <div className="flex flex-col items-center gap-4 pt-8">
        <h1 className="text-3xl text-center font-bold pb-4">{product.title}</h1>
        {/* pics */}
        {product.productImage && (
          <div className="container pb-8 justify-items-center">
            {product.productImage && !Array.isArray(product.productImage) && (
              <Media resource={product.productImage} size="33vw" />
            )}
            {product.productImage && Array.isArray(product.productImage) && (
              <ImageSelect images={product.productImage} />
            )}
          </div>
        )}

        <div className="container">
          {product.description && (
            <RichText
              className="max-w-[48rem] mx-auto"
              data={product.description}
              enableGutter={false}
            />
          )}
        </div>
        <h2 className="text-lg underline">Related Products</h2>
        <ProductCarousel
          products={carouselProducts}
          showDescription={false}
          showProductTypes={false}
        />
      </div>
    </article>
  )
}

export async function generateMetaData({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const product = await queryProductBySlug({ slug })
  return generateMeta({ doc: product })
}

const queryProductBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  return result.docs?.[0] || null
})

export async function generateCarouselProducts(product: Product): Promise<Product[]> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    limit: 10,
    pagination: false,
    where: {
      productType: {
        in: product.productType,
      },
    },
  })

  return result.docs
}
