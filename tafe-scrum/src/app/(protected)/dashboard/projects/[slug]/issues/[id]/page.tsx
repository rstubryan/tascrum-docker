import MainContent from "@/components/templates/content/main-content";
import HeadContent from "@/components/molecules/head-content/head-content";
import SlugIssueContent from "@/components/organisms/slug-content/issue/slug-issue-content";

export default function IssuesDetailPage() {
  return (
    <div className="flex flex-col gap-4">
      <MainContent>
        <div className="lg:flex justify-between items-center">
          <HeadContent
            title={"Issues Detail"}
            description={"View and manage the details of an issue."}
          />
          <div className="flex gap-2 items-center"></div>
        </div>
        <SlugIssueContent />
      </MainContent>
    </div>
  );
}
