import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { SITE_CONFIG } from "@/constants/siteConfig";

export interface SeoHeadProps {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  ogType?: "website" | "article";
}

const DEFAULT_SITE_URL = SITE_CONFIG.baseUrl;
const DEFAULT_OG_IMAGE = "/pwa-192x192.png";

export function SeoHead({
  title,
  description,
  path = "",
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
}: SeoHeadProps) {
  const { i18n } = useTranslation();

  const baseUrl = typeof window !== "undefined" ? window.location.origin : DEFAULT_SITE_URL;
  const canonicalUrl = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const fullOgImageUrl = ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`;

  const lang = i18n.language || "en";
  const locale = lang.startsWith("hi") ? "hi_IN" : "en_IN";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "GovernmentPermitService",
    "name": SITE_CONFIG.name,
    "alternateName": "Jan Seva Kendra New Ashok Nagar",
    "url": canonicalUrl,
    "logo": `${baseUrl}/pwa-192x192.png`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": SITE_CONFIG.address.street,
      "addressLocality": SITE_CONFIG.address.city,
      "addressRegion": SITE_CONFIG.address.state,
      "postalCode": SITE_CONFIG.address.pincode,
      "addressCountry": "IN",
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "07:00",
      "closes": "24:00",
    },
  };

  return (
    <Helmet>
      {/* Standard HTML Title & Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags (WhatsApp, Facebook, LinkedIn) */}
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullOgImageUrl} />
      <meta property="og:locale" content={locale} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImageUrl} />

      {/* Structured Data (Schema.org / JSON-LD) */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
}

export default SeoHead;
