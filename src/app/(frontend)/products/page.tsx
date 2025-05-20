import type { Metadata } from 'next/types'

import React from 'react'

export default async function Page() {
  return <div>Placeholder</div>
}

export function generateMetadata(): Metadata {
  return {
    title: `All Products | Habibis Mediterranean Foods`,
  }
}
