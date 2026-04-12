import { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12 xl:px-16">
      {children}
    </div>
  );
}