import MainContent from "@/components/templates/content/main-content";
import HeadContent from "@/components/molecules/head-content/head-content";
import IssueContent from "@/components/organisms/issue/issue-content";
import IssueDialog from "@/components/organisms/issue/issue-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function IssuesPage() {
  return (
    <div className="flex flex-col gap-4">
      <MainContent>
        <div className="lg:flex justify-between items-center">
          <HeadContent
            title={"Issues"}
            description={"Create and manage issues for your project."}
          />
          <div className="flex gap-2 items-center">
            <div
              id="issue-filter-container"
              className="lg:mt-0 mt-3 lg:w-[180px] w-full"
            ></div>
            <IssueDialog
              mode="create"
              trigger={
                <Button className="whitespace-nowrap">
                  <Plus />
                  Create Issue
                </Button>
              }
            />
          </div>
        </div>
        <IssueContent filterContainerId="issue-filter-container" />
      </MainContent>
    </div>
  );
}
