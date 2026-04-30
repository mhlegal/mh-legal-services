import { useEffect } from 'react';
import { siteConfig } from '@/lib/site-config';

interface SeoProps {
  title?: string;
  description?: string;
}

export function useSeo({ title, description }: SeoProps = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
    const metaDescription = description || siteConfig.description;

    document.title = fullTitle;

    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) {
      descEl.setAttribute('content', metaDescription);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = metaDescription;
      document.head.appendChild(meta);
    }
  }, [title, description]);
}
