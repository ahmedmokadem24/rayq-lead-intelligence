export function PageHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.24em] text-champagne">{eyebrow}</p> : null}
        <h2 className="mt-2 max-w-5xl text-3xl font-black tracking-tight text-pearl md:text-5xl">{title}</h2>
        {description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-muted md:text-base">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
