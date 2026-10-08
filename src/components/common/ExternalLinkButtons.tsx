import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "./BrandIcons";

interface Props {
  github?: string;
  demo?: string;
  size?: "sm" | "default";
}

/** Source / live-demo buttons. Each one only renders when a real URL is provided. */
export default function ExternalLinkButtons({ github, demo, size = "sm" }: Props) {
  if (!github && !demo) return null;
  return (
    <>
      {github ? (
        <Button asChild variant="outline" size={size}>
          <a href={github} target="_blank" rel="noreferrer">
            <GithubIcon size={15} /> Source
          </a>
        </Button>
      ) : null}
      {demo ? (
        <Button asChild variant="outline" size={size}>
          <a href={demo} target="_blank" rel="noreferrer">
            Live demo <ArrowUpRight />
          </a>
        </Button>
      ) : null}
    </>
  );
}
