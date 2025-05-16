import { cn } from '@/utilities/ui'
import React from 'react'

// import { CarouselItem } from '@/components/CarouselItem'
import { Product } from '@/payload-types'
import { CarouselWrapper } from './CarouselWrapper'

export type Props = {
  products: Product[]
  showDescription?: boolean
  showProductTypes?: boolean
}

export const ProductCarousel: React.FC<Props> = (props) => {
  const { products, showDescription, showProductTypes } = props

  return (
    <div className={cn('container')}>
      <CarouselWrapper
        products={products}
        showDescription={showDescription}
        showProductTypes={showProductTypes}
      />
    </div>
  )
}
