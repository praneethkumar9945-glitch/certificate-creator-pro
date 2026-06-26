import { createFileRoute } from "@tanstack/react-router";
import { forwardRef, useRef, useState, type ChangeEvent, type ReactNode, type Ref } from "react";
import html2canvas from "html2canvas";
import templateAsset from "@/assets/certificate-template.png.asset.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const PLACES = ["1st Place", "2nd Place", "3rd Place"] as const;
const EVENTS = [
  "100 Meter",
  "200 Meter",
  "400 Meter",
  "800 Meter",
  "Relay 400 Meter",
  "Tug of War",
  "Badminton Tournament",
  "Volleyball Tournament",
  "Kabaddi Tournament",
  "Shot Put",
  "Long Jump",
  "Discus Throw",
  "Chess",
] as const;

function CertificateGenerator() {
  const [name, setName] = useState("Participant Name");
  const [place, setPlace] = useState<string>(PLACES[0]);
  const [event, setEvent] = useState<string>(EVENTS[0]);
  const [organizer, setOrganizer] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  function onPhoto(e: ChangeEvent<HTMLInputElement>) {
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
      link.download = `${name.replace(/\s+/g, "_") || "certificate"}.png`;
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
          <aside className="space-y-4 rounded-xl border bg-card p-5 shadow-sm h-fit lg:sticky lg:top-6">
            <div className="space-y-2">
              <Label htmlFor="name">Participant Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Place / Position</Label>
              <Select value={place} onValueChange={setPlace}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLACES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Event</Label>
              <Select value={event} onValueChange={setEvent}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENTS.map((ev) => (
                    <SelectItem key={ev} value={ev}>
                      {ev}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizer">Organized by</Label>
              <Input
                id="organizer"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="(given later)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo">Participant Photo</Label>
              <Input id="photo" type="file" accept="image/*" onChange={onPhoto} />
            </div>
            <Button onClick={download} disabled={downloading} className="w-full">
              {downloading ? "Generating…" : "Download Certificate"}
            </Button>
          </aside>

          <div className="overflow-auto rounded-xl border bg-card p-4 shadow-sm">
            <div
              className="mx-auto"
              style={{ maxWidth: 1100, containerType: "inline-size" }}
            >
              <CertificatePreview
                ref={certRef}
                name={name}
                place={place}
                event={event}
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
  organizer: string;
  photo: string | null;
};

const CertificatePreview = forwardRef(function CertificatePreview(
  { name, place, event, organizer, photo }: PreviewProps,
  ref: Ref<HTMLDivElement>,
) {
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
      {/* Participant photo — fits exactly inside the black polaroid box */}
      {photo && (
        <img
          src={photo}
          alt=""
          style={{
            position: "absolute",
            left: "8.15%",
            top: "46.67%",
            width: "12.15%",
            height: "22.77%",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}

      {/* Name on the underline */}
      <div
        style={{
          position: "absolute",
          left: "34.7%",
          bottom: "44.06%",
          width: "32.55%",
          textAlign: "center",
          fontFamily: "Cinzel, serif",
          fontWeight: 700,
          fontSize: "1.7cqw",
          color: "#0b1437",
          lineHeight: 1,
          background: "#ffffff",
          paddingBottom: "0.15cqw",
        }}
      >
        {name}
      </div>

      {/* Place — blank 1 (line 1, right) */}
      <BlankFill left="72.4%" width="15.25%" bottom="38.68%">{place}</BlankFill>

      {/* Event — blank 2 (line 2, left) */}
      <BlankFill left="22.85%" width="15.25%" bottom="36.07%">{event}</BlankFill>

      {/* Organizer — blank 3 (line 3, left) */}
      <BlankFill left="22.85%" width="15.25%" bottom="33.38%">{organizer}</BlankFill>
    </div>
  );
});

function BlankFill({
  left,
  width,
  bottom,
  children,
}: {
  left: string;
  width: string;
  bottom: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        bottom,
        width,
        textAlign: "center",
        fontSize: "1.15cqw",
        fontWeight: 700,
        color: "#e85a1a",
        background: "#ffffff",
        lineHeight: 1.1,
        paddingBottom: "0.1cqw",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {children}
    </div>
  );
}

