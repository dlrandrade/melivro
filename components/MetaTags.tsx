import React, { useEffect } from 'react';

interface MetaTagsProps {
  title: string;
  description: string;
  imageUrl?: string;
  type?: string; // e.g., 'website', 'article', 'book', 'profile'
}

// A simple utility to set or create a meta tag
const setMetaTag = (attr: 'name' | 'property', value: string, content: string) => {
  let element = document.querySelector(`meta[${attr}='${value}']`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, value);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const MetaTags: React.FC<MetaTagsProps> = ({ 
  title, 
  description, 
  imageUrl = 'https://i.imgur.com/gSjY8OQ.png', // Default social image
  type = 'website' 
}) => {
  
  useEffect(() => {
    // Basic Meta Tags
    document.title = title;
    setMetaTag('name', 'description', description);

    // Open Graph (for Facebook, LinkedIn, etc.)
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:image', imageUrl);
    setMetaTag('property', 'og:url', window.location.href);
    setMetaTag('property', 'og:site_name', 'livr.me');

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', imageUrl);

  }, [title, description, imageUrl, type]);

  return null; // This component does not render anything
};

export default MetaTags;