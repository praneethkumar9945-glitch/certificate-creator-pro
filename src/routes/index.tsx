import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import templateAsset from "@/assets/certificate-template.png.asset.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MICS Certificate Generator" },
      {
        name: "description",
        content:
          "Generate Mangalore Inter-College Sports & Games Championship certificates of achievement.",
      },
    ],
  }),
  component: CertificateGenerator,
});

function CertificateGenerator() {
  const [name, setName] = useState("Participant Name");
  const [place, setPlace] = useState("1st Place");
  const [event, setEvent] = useState("Badminton Tournament");
  const [date, setDate] = useState("6th May 2026");
  const [venue, setVenue] = useState("US Mallya Indoor Stadium, Mangaluru");
  const [organizer, setOrganizer] = useState("MICS");
  const [photo, setPhoto] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setPhoto(r.result as string);
    r.readAsDataURL(file);
  }

  async function download() {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `${name.replace(/\s+/g, "_")}_certificate.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/40 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            MICS Championship — Certificate Generator
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in the participant details, upload a photo, and download the certificate.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* Form */}
          <aside className="space-y-4 rounded-xl border bg-card p-5 shadow-sm h-fit lg:sticky lg:top-6">
            <div className="space-y-2">
              <Label htmlFor="name">Participant Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="place">Place / Position</Label>
              <Input id="place" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="1st Place" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event">Event</Label>
              <Input id="event" value={event} onChange={(e) => setEvent(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Textarea id="venue" rows={2} value={venue} onChange={(e) => setVenue(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizer">Organized by</Label>
              <Input id="organizer" value={organizer} onChange={(e) => setOrganizer(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo">Participant Photo</Label>
              <Input id="photo" type="file" accept="image/*" onChange={onPhoto} />
            </div>
            <Button onClick={download} disabled={downloading} className="w-full">
              {downloading ? "Generating…" : "Download Certificate"}
            </Button>
          </aside>

          {/* Preview */}
          <div className="overflow-auto rounded-xl border bg-card p-4 shadow-sm">
            <div className="mx-auto" style={{ maxWidth: 1100 }}>
              <CertificatePreview
                ref={certRef}
                name={name}
                place={place}
                event={event}
                date={date}
                venue={venue}
                organizer={organizer}
                photo={photo}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type PreviewProps = {
  name: string;
  place: string;
  event: string;
  date: string;
  venue: string;
  organizer: string;
  photo: string | null;
};

const CertificatePreview = (() => {
  const Inner = (
    {
      name,
      place,
      event,
      date,
      venue,
      organizer,
      photo,
    }: PreviewProps,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    return (
      <div
        ref={ref}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "2000 / 1414",
          backgroundImage: `url(${templateAsset.url})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          fontFamily: "Poppins, sans-serif",
          color: "#0b1437",
        }}
      >
        {/* Participant photo (over the polaroid placeholder) */}
        <div
          style={{
            position: "absolute",
            left: "8.3%",
            top: "46.5%",
            width: "14.5%",
            height: "29%",
            background: photo ? `center/cover no-repeat url(${photo})` : "#111",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        />

        {/* Name */}
        <div
          style={{
            position: "absolute",
            left: "29%",
            top: "51.5%",
            width: "63%",
            textAlign: "center",
            fontFamily: "Cinzel, serif",
            fontWeight: 700,
            fontSize: "2.2cqw",
            color: "#0b1437",
            lineHeight: 1.1,
          }}
        >
          {name}
        </div>

        {/* Description paragraph */}
        <div
          style={{
            position: "absolute",
            left: "29%",
            top: "60%",
            width: "63%",
            fontSize: "1.25cqw",
            lineHeight: 1.55,
            color: "#1a1a1a",
            textAlign: "justify",
          }}
        >
          This is to proudly certify that the above named participant has achieved{" "}
          <strong style={{ color: "#e85a1a" }}>{place}</strong> in the{" "}
          <strong style={{ color: "#e85a1a" }}>{event}</strong>, held on {date} at {venue}
          {organizer ? `, organized by ${organizer}` : ""}. This certificate is awarded in
          recognition of outstanding skill, dedication, and sportsmanship demonstrated throughout
          the competition.
        </div>
      </div>
    );
  };
  Inner.displayName = "CertificatePreview";
  // forwardRef wrapper
  return Object.assign(
    require("react").forwardRef(Inner) as React.ForwardRefExoticComponent<
      PreviewProps & React.RefAttributes<HTMLDivElement>
    >,
  );
})();
