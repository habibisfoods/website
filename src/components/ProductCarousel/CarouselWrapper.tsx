'use client'
import React from 'react'
import Carousel, { ResponsiveType } from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { CarouselItem } from '@/components/CarouselItem'
import { Product } from '@/payload-types'

export type Props = {
  products: Product[]
  showDescription?: boolean
  showProductTypes?: boolean
}

const responsive: ResponsiveType = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 256 },
    items: 2,
  },
  mini: {
    breakpoint: { max: 256, min: 0 },
    items: 1,
  },
}

export const CarouselWrapper: React.FC<Props> = (props) => {
  const { products, showDescription, showProductTypes } = props

  return (
    <Carousel
      responsive={responsive}
      draggable
      minimumTouchDrag={80}
      infinite
      removeArrowOnDeviceType={['mobile']}
    >
      {products?.map((result, index) => {
        if (typeof result === 'object' && result !== null) {
          return (
            <div key={index} className="p-2">
              <CarouselItem
                className="h-full"
                doc={result}
                showProductTypes={showProductTypes}
                showDescription={showDescription}
              />
            </div>
          )
        }

        return null
      })}
    </Carousel>
  )
}
