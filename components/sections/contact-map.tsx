import { addressFull } from "@/lib/config";

export function ContactMap() {
  const query = encodeURIComponent(addressFull);
  const embedSrc = `https://www.google.com/maps?q=${query}&output=embed`;
  const directionsHref = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-border-subtle">
      <iframe
        src={embedSrc}
        title={`Map showing the VIA ABROAD OVERSEAS office location: ${addressFull}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-72 w-full border-0 sm:h-96"
      />
      <div className="bg-surface-muted px-5 py-3 text-sm">
        <a href={directionsHref} target="_blank" rel="noopener noreferrer" className="font-medium text-gold-700 hover:text-gold-600">
          Get directions to our office &rarr;
        </a>
      </div>
    </div>
  );
}
