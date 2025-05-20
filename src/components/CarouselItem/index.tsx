'use client'
import { cn } from '@/utilities/ui'
import { CMSLink } from '../Link'
import React from 'react'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'

export type CarouselItemPostData = Pick<Product, 'slug' | 'productType' | 'meta' | 'title'>

function shorten(desc: string) {
  if (desc.length < 110) return desc

  return desc.substring(0, 107) + '...'
}

export const CarouselItem: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: Product
  showDescription?: boolean
  showProductTypes?: boolean
  title?: string
}> = (props) => {
  const { className, doc, showDescription, showProductTypes, title: titleFromProps } = props

  const { slug, meta, title, productType } = doc || {}
  const { description, image: metaImage } = meta || {}

  const titleToUse = titleFromProps || title

  const shortenedDescription = description ? shorten(description) : ''

  const sanitizedDescription = shortenedDescription?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/products/${slug}`
  const productTypeTitle = typeof productType === 'object' ? productType.productType : ''

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-orange-200 hover:cursor-pointer',
        className,
      )}
    >
      {/* Image */}
      <div className="relative w-full ">
        {!metaImage && <div className="">No image</div>}
        {metaImage && typeof metaImage !== 'string' && <Media resource={metaImage} size="33vw" />}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Product Type */}
        {showProductTypes && productType && (
          <div className="uppercase text-sm mb-2">{productTypeTitle}</div>
        )}

        {/* Title */}
        {titleToUse && (
          <div className="prose">
            <h4>
              <CMSLink
                className="text-black no-underline hover:underline"
                appearance="inline"
                type="custom"
                url={href}
              >
                {titleToUse}
              </CMSLink>
            </h4>
          </div>
        )}

        {/* Description */}
        {description && (
          <div className="mt-2 aspect-3/2 overflow-hidden">
            {showDescription && description && <p>{sanitizedDescription}</p>}
          </div>
        )}
      </div>
    </article>
  )
}
