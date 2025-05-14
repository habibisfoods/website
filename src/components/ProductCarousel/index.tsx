import { cn } from '@/utilities/ui'
import React from 'react'

import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

import { CarouselItem, CarouselItemPostData } from './CarouselItem'

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
}

export type Props = {
  products: CarouselItemPostData[]
}

export const ProductCarousel: React.FC<Props> = (props) => {
  const { products } = props

  return (
    <div className={cn('container')}>
      <Carousel responsive={responsive}>
        {products?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return (
              <div className="col-span-4" key={index}>
                <CarouselItem
                  className="h-full"
                  doc={result}
                  relationTo="products"
                  showProductTypes
                />
              </div>
            )
          }
        })}
      </Carousel>
    </div>
  )
}
