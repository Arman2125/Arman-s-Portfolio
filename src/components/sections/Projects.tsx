import { Section, SectionHeader } from "@/components/common/Section";
import Reveal from "@/components/effects/Reveal";
import CaseStudy from "@/components/projects/CaseStudy";
import { projects } from "@/data/resume";

export default function Projects() {
  const featured = projects.filter((project) => project.featured);

  return (
    <Section id="projects" band>
      <SectionHeader
        id="projects"
        index="04"
        label="Projects"
        title="Selected projects"
        lead="The AI platform I contribute to at SharpFlux Technologies."
      />

      <div className="mt-12 space-y-10">
        {featured.map((project, i) => (
          <Reveal key={project.id} from="scale">
            <CaseStudy project={project} flip={i % 2 === 1} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
