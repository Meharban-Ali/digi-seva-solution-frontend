import { SITE_CONFIG } from "@/constants/siteConfig";

interface GoogleMapEmbedProps {
  className?: string;
  height?: string;
}

export function GoogleMapEmbed({ className = "h-72 sm:h-96 w-full", height }: GoogleMapEmbedProps) {
  const containerStyle = height ? { height } : undefined;
  return (
    <div
      style={containerStyle}
      className={`rounded-xl overflow-hidden shadow-sm border border-slate-200 ${height ? "w-full" : className}`}
    >
      <iframe
        title="Digi Seva Solution Location Map"
        src={SITE_CONFIG.mapEmbedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}

export default GoogleMapEmbed;
