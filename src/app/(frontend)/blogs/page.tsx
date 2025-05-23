import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    where: {
      postType: {
        equals: 'blog',
      },
    },
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })
  const [latestPost, ...restPosts] = posts.docs

  return (
    <div className="pt-24 pb-24">
      <PageClient />

      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Blogs</h1>
        </div>
      </div>

      {latestPost && (
        <div className="container mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">{latestPost.title}</h2>
              <p className="text-gray-600 mb-4">{latestPost.meta?.description}</p>
              <CMSLink
                type="custom"
                url={`/posts/${latestPost.slug}`}
                appearance="inline"
                className="text-orange-500 hover:underline"
              >
                Read More →
              </CMSLink>
            </div>
            <div className="relative w-[500px] h-[500px] bg-gray-200 rounded-lg">
              {typeof latestPost?.meta?.image === 'object' && latestPost.meta.image && (
                <Media
                  resource={latestPost.meta.image}
                  imgClassName="absolute inset-0 w-full h-full object-cover rounded-xl"
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={restPosts} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Blog Posts | Habibis Mediterranean Foods`,
    openGraph: {
      images: [{ url: `${getServerSideURL()}/Habibis-Full-Logo.svg` }],
    },
  }
}
