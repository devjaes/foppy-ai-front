import { Navbar } from "../dashboard/navbar/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  hideHeader?: boolean;
}

export function ContentLayout({ title, children, hideHeader }: ContentLayoutProps) {
  return (
    <div className="flex flex-col w-full min-h-dvh ">
      {!hideHeader && <Navbar title={title} />}
      <div className="max-w-[1440px] w-full mx-auto flex-1 items-center px-4 pb-8 pt-8 sm:px-8">
        {children}
      </div>
    </div>
  );
}
