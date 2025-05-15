'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'

export type CarouselItemPostData = Pick<Product, 'slug' | 'productType' | 'meta' | 'title'>

export const CarouselItem: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: Product
  showProductTypes?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, showProductTypes, title: titleFromProps } = props

  const { slug, meta, title, productType } = doc || {}
  const { description, image: metaImage } = meta || {}

  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/products/${slug}`
  const productTypeTitle = typeof productType === 'object' ? productType.productType : ''

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
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
          <div className="uppercase text-sm mb-4">{productTypeTitle}</div>
        )}

        {/* Title */}
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}

        {/* Description */}
        {description && <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>}
      </div>
    </article>
  )
}
