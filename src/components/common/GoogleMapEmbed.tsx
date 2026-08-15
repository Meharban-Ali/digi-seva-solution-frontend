interface GoogleMapEmbedProps {
  className?: string;
}

export function GoogleMapEmbed({ className = "h-72 sm:h-96 w-full" }: GoogleMapEmbedProps) {
  return (
    <div className={`rounded-xl overflow-hidden shadow-sm border border-slate-200 ${className}`}>
      <iframe
        title="Digi Seva Solution Location Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14013.195022137684!2d77.3005!3d28.5908!2m3!1f0!1f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce4efed26393b%3A0x6e2e50cf840ecff1!2sNew%20Ashok%20Nagar%2C%20New%20Delhi%2C%20Delhi%20110096!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
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
