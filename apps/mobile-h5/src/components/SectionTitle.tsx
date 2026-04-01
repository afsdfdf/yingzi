import type { ReactNode } from "react";

type SectionTitleProps = {
  title: string;
  subtitle: string;
  right?: ReactNode;
};

export function SectionTitle({ title, subtitle, right }: SectionTitleProps) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {right ? <span>{right}</span> : null}
    </div>
  );
}
