import React from 'react';
import {
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaGithub
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import type { IconType } from 'react-icons';

// Map of supported icons
export const iconMap: Record<string, IconType> = {
  facebook: FaFacebook,
  twitter: FaXTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  github: FaGithub,
};

// Define individual link type
export interface SocialMediaLink {
  platform: keyof typeof iconMap;
  url: string;
}

// Define props for the block which now accepts an array of links
export interface SocialMediaProps {
  links: SocialMediaLink[];
}

// Converter component that renders multiple links
const SocialMediaConverter: React.FC<SocialMediaProps> = ({ links }) => {
  return (
    <div className="social-media-block flex space-x-4">
      {links.map((link, idx) => {
        const Icon = iconMap[link.platform] || (() => <i className="fas fa-share-alt" />);
        return (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-media-link flex items-center space-x-1"
          >
            <Icon />
            <span className="sr-only">{link.platform}</span>
          </a>
        );
      })}
    </div>
  );
};

export default SocialMediaConverter;