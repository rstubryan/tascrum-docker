import MainContent from "@/components/templates/content/main-content";
import HeadContent from "@/components/molecules/head-content/head-content";
import TaskContent from "@/components/organisms/task/task-content";

export default function TasksPage() {
  return (
    <MainContent>
      <div className="flex flex-col gap-4">
        <div className="lg:flex justify-between items-center">
          <HeadContent title={"Tasks"} description={"Tasks of the project."} />
          <div
            id="task-filter-container"
            className="lg:mt-0 mt-3 lg:w-[150px] w-full"
          ></div>
        </div>
        <TaskContent filterContainerId="task-filter-container" />
      </div>
    </MainContent>
  );
}
