'use client'

import React, { useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import NextImage from 'next/image'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon, AlignJustifyIcon } from 'lucide-react'
import { getServerSideURL } from '@/utilities/getURL'

import { Drawer } from '@material-tailwind/react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  const [open, setOpen] = useState(false)

  const openDrawer = () => setOpen(true)
  const closeDrawer = () => setOpen(false)

  return (
    <nav className="flex gap-3 items-center">
      <button
        onClick={openDrawer}
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <AlignJustifyIcon className="w-5 text-primary" />
      </button>
      <Drawer placement="right" open={open} onClose={closeDrawer} className="p-4 bg-orange-600">
        <div className="container justify-items-center">
          <NextImage
            src={`${getServerSideURL()}/Habibis-Full-Logo.svg`}
            alt="Habibis Logo"
            width={200}
            height={100}
          />
        </div>

        <ul className="space-y-2 font-medium">
          {navItems.map(({ link }, i) => {
            return (
              <li key={i}>
                <CMSLink {...link} appearance="link" />
              </li>
            )
          })}
          <li>
            <Link href="/search">
              <span className="sr-only">Search</span>
              <SearchIcon className="w-5 text-primary" />
            </Link>
          </li>
        </ul>
      </Drawer>
    </nav>
  )
}
