import { cn } from '@/utilities/ui'
import React from 'react'

// import { CarouselItem } from '@/components/CarouselItem'
import { Product } from '@/payload-types'
import { CarouselWrapper } from './CarouselWrapper'

export type Props = {
  products: Product[]
}

export const ProductCarousel: React.FC<Props> = (props) => {
  const { products } = props

  return (
    <div className={cn('container')}>
      {/* <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
        {products?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return (
              <div className="col-span-4" key={index}>
                <CarouselItem className="h-full" doc={result} showProductTypes />
              </div>
            )
          }

          return null
        })}
      </div> */}

      <CarouselWrapper products={products} />
    </div>
  )
}
