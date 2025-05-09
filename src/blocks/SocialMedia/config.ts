// payload/blocks/socialMediaLink.ts
import { Block } from 'payload';

import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa'
import type { IconType } from 'react-icons'

export const iconMap: Record<string, IconType> = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  youtube: FaYoutube,
  github: FaGithub,
}

export const SocialMedia: Block = {
  slug: 'socialMedia',
  labels: {
    singular: 'Social Media Links',
    plural: 'Social Media Links',
  },
  fields: [
    {
      name: 'links',
      label: 'Social Media Links',
      type: 'array',          // <-- switch to an array
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              label: 'Platform',
              options: Object.keys(iconMap),
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              label: 'Profile URL',
              required: true,
            },
          ],
        },
      ],
    },
  ],
};
