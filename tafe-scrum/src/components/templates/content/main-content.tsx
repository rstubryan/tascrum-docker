import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/molecules/themes/toggle-theme";
import ContainerLayout from "@/components/templates/content/container-layout";
import HeaderBreadcrumb from "@/components/templates/content/header-breadcrumb";

export default function MainContent({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <ContainerLayout>
      <section>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-2">
              <HeaderBreadcrumb />
            </div>
            <ModeToggle />
          </div>
        </header>
      </section>
      <Separator />
      <section className={`container mx-auto my-4 2xl:px-0 px-4 ${className}`}>
        {children}
      </section>
    </ContainerLayout>
  );
}
