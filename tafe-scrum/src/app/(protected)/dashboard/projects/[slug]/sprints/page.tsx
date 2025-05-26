import MainContent from "@/components/templates/content/main-content";
import HeadContent from "@/components/molecules/head-content/head-content";
import SprintContent from "@/components/organisms/sprint/sprint-content";
import SprintDialog from "@/components/organisms/sprint/sprint-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function SprintsPage() {
  return (
    <div className="flex flex-col gap-4">
      <MainContent>
        <section className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <HeadContent
            title={"Sprints"}
            description={"Create and manage sprints for your project."}
          />

          <SprintDialog
            mode="create"
            trigger={
              <Button className="sm:w-auto w-full">
                <Plus />
                Create Sprint
              </Button>
            }
          />
        </section>
        <SprintContent />
      </MainContent>
    </div>
  );
}
