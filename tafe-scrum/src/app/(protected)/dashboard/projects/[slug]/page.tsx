import MainContent from "@/components/templates/content/main-content";
import TimelineProject from "@/components/organisms/slug-content/project/timeline-project";
import HeadContent from "@/components/molecules/head-content/head-content";
import MembershipDialog from "@/components/organisms/membership/membership-dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function TimelinePage() {
  return (
    <MainContent>
      <div className="flex justify-between items-center mb-4">
        <HeadContent
          title={"Timeline"}
          description={"Timeline of the project."}
        />
        <MembershipDialog
          mode="create"
          trigger={
            <Button>
              <PlusIcon />
              Add Member
            </Button>
          }
        />
      </div>
      <TimelineProject />
    </MainContent>
  );
}
