import type { Product, CarouselBlock as CarouselProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { ProductCarousel } from '@/components/ProductCarousel'

export const CarouselBlock: React.FC<
  CarouselProps & {
    id?: string
  }
> = async (props) => {
  const { id, selectedType, introContent, limit: limitFromProps, populateBy } = props

  const limit = limitFromProps || 5

  let products: Product[] = []

  const payload = await getPayload({ config: configPromise })

  if (populateBy === 'type') {
    const fetchedProducts = await payload.find({
      collection: 'products',
      depth: 1,
      limit,
      where: {
        productType: {
          in: selectedType,
        },
      },
    })

    products = fetchedProducts.docs
  } else {
    const fetchedProducts = await payload.find({
      collection: 'products',
      depth: 1,
      limit,
    })

    products = fetchedProducts.docs
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <ProductCarousel products={products} />
    </div>
  )
}
