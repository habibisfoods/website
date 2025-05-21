'use client'
import { Media as MediaProps } from '@/payload-types'
import { Media } from '../Media'
import React, { useState } from 'react'

export const ImageSelect: React.FC<{ images: (number | MediaProps)[] }> = (props) => {
  const { images } = props

  const [selected, setSelected] = useState(0)

  return (
    <div className="justify-items-center">
      <Media resource={images[selected]} size="33vw" />
      <div className="flex flex-row gap-2 justify-items-center border-4 border-orange-600 rounded">
        {images?.map((image, index) => {
          return (
            <button
              className="m-1"
              key={index}
              onClick={() => {
                setSelected(index)
              }}
            >
              <Media
                resource={image}
                className="w-20 md:w-48 aspect-square items-center justify-items-center"
                imgClassName="w-full h-full object-cover"
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
