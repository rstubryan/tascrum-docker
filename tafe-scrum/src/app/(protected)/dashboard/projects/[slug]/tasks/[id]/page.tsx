import MainContent from "@/components/templates/content/main-content";
import HeadContent from "@/components/molecules/head-content/head-content";
import SlugTaskContent from "@/components/organisms/slug-content/task/slug-task-content";

export default function TaskDetailPage() {
  return (
    <MainContent>
      <div className="flex flex-col gap-4">
        <div className="lg:flex justify-between items-center">
          <HeadContent
            title={"Task Detail"}
            description={"Task detail page of the project."}
          />
        </div>
        <SlugTaskContent />
      </div>
    </MainContent>
  );
}
