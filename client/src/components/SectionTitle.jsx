const SectionTitle = ({ eyebrow, title, description }) => (
  <div className="flex flex-col gap-3">
    {eyebrow ? <span className="pill">{eyebrow}</span> : null}
    <div className="space-y-2">
      <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-6 text-on-surface-variant">
          {description}
        </p>
      ) : null}
    </div>
  </div>
);

export default SectionTitle;