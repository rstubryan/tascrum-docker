import MainContent from "@/components/templates/content/main-content";
import HeadContent from "@/components/molecules/head-content/head-content";
import EpicContent from "@/components/organisms/epic/epic-content";
import EpicDialog from "@/components/organisms/epic/epic-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function EpicsPage() {
  return (
    <MainContent>
      <div className="flex flex-col gap-4">
        <div className="lg:flex justify-between items-center">
          <HeadContent title={"Epics"} description={"Epics of the project."} />
          <div className="flex mt-4 lg:mt-0 gap-2">
            <EpicDialog
              mode="create"
              trigger={
                <Button className={"w-full lg:w-auto"}>
                  <Plus />
                  Create Epic
                </Button>
              }
            />
          </div>
        </div>
        <EpicContent />
      </div>
    </MainContent>
  );
}
