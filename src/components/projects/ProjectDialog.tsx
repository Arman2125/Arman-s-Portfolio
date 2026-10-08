import { ArrowRight } from "lucide-react";
import ExternalLinkButtons from "@/components/common/ExternalLinkButtons";
import TechTag from "@/components/common/TechTag";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Project } from "@/data/resume";
import ArchitectureDiagram from "./ArchitectureDiagram";

/** Each tab's content fades up as it opens (tw-animate-css). */
const TAB_IN = "animate-in fade-in-0 slide-in-from-bottom-1 duration-300";

/** "View details": overview, features and architecture for projects that have long-form content. */
export default function ProjectDialog({ project }: { project: Project }) {
  const { details } = project;
  if (!details) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          View details <ArrowRight />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] gap-0 overflow-y-auto p-0 sm:max-w-3xl">
        <DialogHeader className="border-b p-5 pr-12 text-left sm:p-8 sm:pr-14">
          <p className="eyebrow text-muted-foreground">{project.context}</p>
          <DialogTitle className="text-xl leading-tight tracking-tight sm:text-2xl">{project.title}</DialogTitle>
          <DialogDescription className="text-base leading-relaxed">{project.summary}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="gap-6 p-5 sm:p-8">
          <TabsList className="w-full sm:w-fit">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className={`space-y-6 ${TAB_IN}`}>
            <div>
              <h3 className="eyebrow text-muted-foreground">Problem</h3>
              <p className="mt-2 leading-relaxed">{details.problem}</p>
            </div>
            <div>
              <h3 className="eyebrow text-muted-foreground">My role</h3>
              <p className="mt-2 leading-relaxed">{details.role}</p>
            </div>
            <div>
              <h3 className="eyebrow text-muted-foreground">Technologies</h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li key={tech}>
                    <TechTag>{tech}</TechTag>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="features" className={TAB_IN}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {details.features.map((feature, i) => (
                <li
                  key={feature.title}
                  className="animate-in rounded-lg border bg-card p-4 duration-500 fade-in-0 slide-in-from-bottom-2"
                  style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
                >
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{feature.text}</p>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="architecture" className={TAB_IN}>
            <ArchitectureDiagram layers={details.architecture} crossCutting={details.crossCutting} note={details.architectureNote} />
          </TabsContent>
        </Tabs>

        {project.links.github || project.links.demo ? (
          <div className="flex flex-wrap gap-3 border-t p-5 sm:px-8">
            <ExternalLinkButtons github={project.links.github} demo={project.links.demo} size="default" />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
