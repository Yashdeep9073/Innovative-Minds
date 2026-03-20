
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'course';
  schema?: any;
}

export const StandardizedSEO: React.FC<SEOProps> = ({
  title = "Innovative Minds Institute - Future of Education",
  description = "Empowering the next generation of African leaders through AI-driven, solar-powered, and accessible digital learning.",
  canonical = "https://iminstitute.online",
  ogImage = "https://iminstitute.online/og-image.jpg",
  ogType = "website",
  schema
}) => {
  const fullTitle = title.includes("Innovative Minds Institute") ? title : `${title} | Innovative Minds Institute`;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="Innovative Minds Institute" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Security Headers (Meta equivalents for client-side) */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}

      {/* Default EducationalOrganization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "Innovative Minds Institute",
          "url": "https://iminstitute.online",
          "logo": "https://iminstitute.online/logo.png",
          "description": description,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Lusaka",
            "addressCountry": "ZM"
          },
          "sameAs": [
            "https://www.facebook.com/1imist",
            "https://twitter.com/iminstitute",
            "https://linkedin.com/company/iminstitute"
          ]
        })}
      </script>
    </Helmet>
  );
};
