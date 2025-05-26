import MainContent from "@/components/templates/content/main-content";
import ProjectDialog from "@/components/organisms/project/project-dialog";
import ProjectTabs from "@/components/organisms/project/project-tabs";
import HeadContent from "@/components/molecules/head-content/head-content";

export default function ProjectsPage() {
  return (
    <MainContent>
      <section className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <HeadContent
          title={"Projects"}
          description={"Create and manage your projects."}
        />
        <ProjectDialog mode={"create"} />
      </section>
      <ProjectTabs />
    </MainContent>
  );
}
