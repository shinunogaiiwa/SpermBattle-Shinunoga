import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <section className="border rounded-lg p-4 shadow-sm">
      {title ? <h2 className="text-lg font-semibold mb-2">{title}</h2> : null}
      <div>{children}</div>
    </section>
  );
}

