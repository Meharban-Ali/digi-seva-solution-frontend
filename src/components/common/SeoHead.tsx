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

const DEFAULT_OG_IMAGE = "/logo512.png";

export function SeoHead({
  title,
  description,
  path = "",
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
}: SeoHeadProps) {
  const { i18n } = useTranslation();

  const baseUrl = SITE_CONFIG.baseUrl; // "https://digisevasolution.online"
  const normalizedPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  const canonicalUrl = `${baseUrl}${normalizedPath}`;
  const fullOgImageUrl = ogImage.startsWith("http")
    ? ogImage
    : `${baseUrl}${ogImage.startsWith("/") ? ogImage : `/${ogImage}`}`;

  const lang = i18n.language || "en";
  const locale = lang.startsWith("hi") ? "hi_IN" : "en_IN";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": SITE_CONFIG.name,
    "description": description,
    "url": canonicalUrl,
    "telephone": "+917900867261",
    "email": "digisevasolution01@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": SITE_CONFIG.address.street,
      "addressLocality": SITE_CONFIG.address.city,
      "addressRegion": SITE_CONFIG.address.state,
      "postalCode": SITE_CONFIG.address.pincode,
      "addressCountry": "IN",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "28.6139",
      "longitude": "77.3125",
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "07:00",
      "closes": "00:00",
    },
    "serviceType": [
      "Aadhaar Update", "PAN Card", "AEPS Banking", "RTO Services", "Driving Licence",
      "Vehicle Registration", "Income Certificate", "Caste Certificate", "Voter ID",
      "Passport Assistance", "ITR Filing", "GST Registration", "MSME Registration",
      "Web Development", "App Development", "Custom Software", "Java Development",
      "Axis Bank Account Opening", "SBI Account Opening", "Insurance", "Utility Bills",
      "Money Transfer", "Jan Seva Kendra", "CSC Center", "Cyber Cafe Services"
    ],
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": { "@type": "GeoCoordinates", "latitude": "28.6139", "longitude": "77.3125" },
      "geoRadius": "10000",
    },
    "priceRange": "₹50 - ₹5000",
    "sameAs": [baseUrl],
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/logo512.png`,
    },
    "image": fullOgImageUrl,
  };

  return (
    <Helmet>
      {/* Standard HTML Title & Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags (WhatsApp, Google Search Snippets, Social Previews) */}
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullOgImageUrl} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
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
