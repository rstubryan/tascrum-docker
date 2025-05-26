import MainContent from "@/components/templates/content/main-content";
import HeadContent from "@/components/molecules/head-content/head-content";
import SlugEpicContent from "@/components/organisms/slug-content/epic/slug-epic-content";

export default function EpicDetailPage() {
  return (
    <MainContent>
      <div className="flex flex-col gap-4">
        <div className="lg:flex justify-between items-center">
          <HeadContent
            title="Epic Detail"
            description="Epic detail page of the project."
          />
        </div>
        <SlugEpicContent />
      </div>
    </MainContent>
  );
}
