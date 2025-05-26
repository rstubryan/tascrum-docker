import MainContent from "@/components/templates/content/main-content";
import HeadContent from "@/components/molecules/head-content/head-content";
import SlugSprintContent from "@/components/organisms/slug-content/sprint/slug-sprint-content";

export default function SprintsDetailPage() {
  return (
    <div className="flex flex-col gap-4">
      <MainContent>
        <section className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <HeadContent
            title={"Sprints Detail"}
            description={"View and manage details of a specific sprint."}
          />
        </section>
        <SlugSprintContent />
      </MainContent>
    </div>
  );
}
