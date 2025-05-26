import MainContent from "@/components/templates/content/main-content";
import HeadContent from "@/components/molecules/head-content/head-content";
import BacklogContent from "@/components/organisms/backlog/backlog-content";
import BacklogDialog from "@/components/organisms/backlog/backlog-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function BacklogsPage() {
  return (
    <div className="flex flex-col gap-4">
      <MainContent>
        <section className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <HeadContent
            title={"User Stories"}
            description={"Create and manage user stories for your project."}
          />

          <BacklogDialog
            mode="create"
            trigger={
              <Button className="sm:w-auto w-full">
                <Plus />
                Create User Story
              </Button>
            }
          />
        </section>
        <BacklogContent />
      </MainContent>
    </div>
  );
}
