import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  url?: string;
  schema?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage = 'https://iminstitute.online/og-image.jpg',
  url = 'https://iminstitute.online',
  schema,
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Multilingual / Region Tags */}
      <link rel="alternate" hrefLang="en-ZA" href={`${url}`} />
      <link rel="alternate" hrefLang="fr-FR" href={`${url}/fr`} />
      <link rel="alternate" hrefLang="pt-PT" href={`${url}/pt`} />
      <link rel="alternate" hrefLang="ar" href={`${url}/ar`} />
      <link rel="alternate" hrefLang="x-default" href={`${url}`} />
      
      <link rel="canonical" href={url} />

      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};
