import { createFileRoute } from "@tanstack/react-router";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
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
  const [college, setCollege] = useState("");
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
    const node = certRef.current;
    if (!node) return;
    setDownloading(true);
    try {
      // Render at fixed native-resolution width for crisp output.
      const canvas = await html2canvas(node, {
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: false,
        width: node.offsetWidth,
        height: node.offsetHeight,
        scale: 2000 / node.offsetWidth,
      });
      const link = document.createElement("a");
      link.download = `${(name || "certificate").replace(/\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Certificate download failed", err);
      alert("Failed to generate certificate. Please try again.");
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
              <Label htmlFor="college">College Name</Label>
              <Input
                id="college"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. St. Aloysius College"
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
            <div className="mx-auto" style={{ maxWidth: 1100 }}>
              <CertificatePreview
                ref={certRef}
                name={name}
                place={place}
                event={event}
                college={college}
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
  college: string;
  photo: string | null;
};

const CertificatePreview = forwardRef<HTMLDivElement, PreviewProps>(
  function CertificatePreview({ name, place, event, college, photo }, ref) {
    const innerRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    // Drive sizing in px from the rendered width so html2canvas (no container-query
    // support) renders fonts and positions at the right scale.
    const [unit, setUnit] = useState(0);
    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;
      const update = () => setUnit(el.offsetWidth / 100); // 1 "u" = 1% of width
      update();
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    const u = (v: number) => `${v * unit}px`;

    return (
      <div
        ref={innerRef}
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
        {/* Participant photo — fills the black polaroid box */}
        {photo && (
          <img
            src={photo}
            alt=""
            crossOrigin="anonymous"
            style={{
              position: "absolute",
              left: "8.15%",
              top: "46.68%",
              width: "16.80%",
              height: "22.84%",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}

        {/* Name — sits on the long underline */}
        <div
          style={{
            position: "absolute",
            left: "35.0%",
            top: `calc(55.94% - ${u(2.2)})`,
            width: "32.25%",
            height: u(2.2),
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            fontFamily: "Cinzel, serif",
            fontWeight: 700,
            fontSize: u(1.7),
            lineHeight: 1,
            color: "#0b1437",
            background: "#ffffff",
            paddingBottom: u(0.15),
          }}
        >
          {name}
        </div>

        {/* Place — blank on line 1 (right) */}
        <BlankFill left="72.35%" width="15.30%" bottom="40.88%" u={u}>
          {place}
        </BlankFill>

        {/* Event — blank on line 2 (left, indented) */}
        <BlankFill left="25.00%" width="13.10%" bottom="38.19%" u={u}>
          {event}
        </BlankFill>
      </div>
    );
  },
);

function BlankFill({
  left,
  width,
  bottom,
  u,
  children,
}: {
  left: string;
  width: string;
  bottom: string;
  u: (v: number) => string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        bottom,
        width,
        height: u(1.6),
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        fontSize: u(1.15),
        fontWeight: 700,
        color: "#e85a1a",
        background: "#ffffff",
        lineHeight: 1,
        paddingBottom: u(0.1),
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}
