const EmptyState = ({ title, description, action }) => (
  <div className="glass-panel flex min-h-56 flex-col items-start justify-center gap-3 p-6">
    <span className="pill">Nothing here yet</span>
    <h3 className="font-headline text-2xl font-bold text-on-surface">
      {title}
    </h3>
    <p className="max-w-xl text-sm leading-6 text-on-surface-variant">
      {description}
    </p>
    {action}
  </div>
);

export default EmptyState;