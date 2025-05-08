// blocks/SocialMedia/Component.tsx

import React from 'react';
import { FaFacebook, FaLinkedin, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
// Define types for the block fields (you can adjust this according to your actual fields)
export interface SocialMediaProps {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'github'; // Add any other platforms if needed
  url: string;
}

// The SocialMediaConverter component will be used to render the SocialMedia block
const SocialMediaConverter: React.FC<SocialMediaProps> = ({ platform, url }) => {
  let platformIcon;

  switch (platform) {
    case 'facebook':
      platformIcon = <FaFacebook />;
      break;
    case 'twitter':
      platformIcon = <FaXTwitter />;
      break;
    case 'instagram':
      platformIcon = <FaInstagram />;
      break;
    case 'linkedin':
      platformIcon = <FaLinkedin />;
      break;
    case 'youtube':
      platformIcon = <FaYoutube />;
      break;
    case 'github':
      platformIcon = <FaGithub />;
      break;
    default:
      platformIcon = <i className="fas fa-share-alt" />;
      break;
  }

  return (
    <div className="social-media-block">
      <a href={url} target="_blank" rel="noopener noreferrer" className="social-media-link">
        {platformIcon}
        <span>{platform}</span>
      </a>
    </div>
  );
};

export default SocialMediaConverter;