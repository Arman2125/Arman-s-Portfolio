import { Check, Copy, FileText, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GithubIcon, LinkedinIcon } from "@/components/common/BrandIcons";
import { Section, SectionHeader } from "@/components/common/Section";
import ContactForm from "@/components/contact/ContactForm";
import Reveal from "@/components/effects/Reveal";
import { Button } from "@/components/ui/button";
import { contactLinks, profile, socials } from "@/data/resume";

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the address is still shown and selectable */
    }
  };

  return (
    <Button variant="outline" size="xs" onClick={copy} aria-label={copied ? "Email copied" : "Copy email address"}>
      {copied ? <Check className="text-success" /> : <Copy />}
      <span aria-hidden="true">{copied ? "Copied" : "Copy"}</span>
    </Button>
  );
}

export default function Contact() {
  const links = [
    ...(socials.github ? [{ icon: GithubIcon, label: "GitHub", href: socials.github }] : []),
    ...(socials.linkedin ? [{ icon: LinkedinIcon, label: "LinkedIn", href: socials.linkedin }] : []),
  ];

  return (
    <Section id="contact" band>
      <Reveal className="relative overflow-hidden rounded-2xl border bg-card shadow-card">
        <div aria-hidden="true" className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_80%_at_0%_0%,#000,transparent)]" />
        <div aria-hidden="true" className="absolute -top-24 -left-24 size-72 rounded-full bg-brand/10 blur-3xl" />

        <div className="relative grid gap-10 p-5 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14 lg:p-12">
          <div className="flex flex-col">
            <SectionHeader
              id="contact"
              index="08"
              label="Contact"
              title="Let's talk"
              lead="I'm open to software engineering and full-stack roles. Send a message with the form, or reach me directly."
            />

            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
                  <a href={contactLinks.email} className="font-medium break-all underline-offset-4 hover:underline">
                    {profile.email}
                  </a>
                  <CopyEmailButton />
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                <a href={contactLinks.phone} className="font-medium underline-offset-4 hover:underline">
                  {profile.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                <span className="font-medium">{profile.location}</span>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3 lg:mt-auto lg:pt-10">
              {links.map(({ icon: Icon, label, href }) => (
                <Button key={label} asChild variant="outline">
                  <a href={href} target="_blank" rel="noreferrer">
                    <Icon size={16} /> {label}
                  </a>
                </Button>
              ))}
              <Button asChild variant="ghost">
                <a href={profile.resumeFile} target="_blank" rel="noreferrer">
                  <FileText /> Resume (PDF)
                </a>
              </Button>
            </div>
          </div>

          <ContactForm />
        </div>
      </Reveal>
    </Section>
  );
}
