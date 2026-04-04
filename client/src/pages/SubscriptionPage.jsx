import { useState } from "react";

import SectionTitle from "../components/SectionTitle.jsx";

const plans = [
  {
    name: "Starter",
    price: "Rs 29",
    resolution: "420p",
    description: "Basic access for light viewers and casual browsing.",
    features: ["420p streaming", "Standard playback", "Community access"],
  },
  {
    name: "Creator",
    price: "Rs 49",
    resolution: "720p",
    description: "Balanced quality for regular binge sessions.",
    features: ["720p streaming", "Faster loading", "Playlist support"],
    highlight: true,
  },
  {
    name: "Studio",
    price: "Rs 99",
    resolution: "1802p",
    description: "Premium clarity for dedicated viewers.",
    features: ["1802p streaming", "Priority playback", "Creator insights"],
  },
];

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(plans[1]?.name || "");

  return (
    <div className="space-y-12">
      <SectionTitle
        eyebrow="Subscription"
        title="Choose your playback quality"
        description="Pick the plan that matches how you watch. Upgrade any time and keep your history in sync."
      />

      <section className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.name;

          return (
            <button
              key={plan.name}
              type="button"
              onClick={() => setSelectedPlan(plan.name)}
              className={`relative overflow-hidden rounded-3xl border px-6 py-8 text-left transition ${
                isSelected
                  ? "border-primary/70 bg-primary/10 shadow-halo ring-2 ring-primary/40"
                  : "border-white/10 bg-surface-container-high/50 hover:scale-[1.02] hover:border-primary/40"
              }`}
            >
              {plan.highlight ? (
                <span className="pill absolute right-6 top-6">Most popular</span>
              ) : null}
              <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">
                {plan.name}
              </p>
              <h2 className="mt-3 text-3xl font-headline font-extrabold text-on-surface">
                {plan.price}
                <span className="text-sm font-semibold text-on-surface-variant">
                  {" "}
                  / month
                </span>
              </h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                {plan.description}
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-on-surface">
                Max quality: {plan.resolution}
              </div>

              <ul className="mt-6 space-y-3 text-sm text-on-surface-variant">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      check_circle
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8 w-full rounded-full bg-gradient-to-r from-primary to-primary-dim px-5 py-3 text-center text-sm font-bold text-on-primary-fixed transition hover:opacity-90">
                {isSelected ? "Selected plan" : `Choose ${plan.name}`}
              </div>
            </button>
          );
        })}
      </section>

      <section className="glass-panel p-6 text-sm text-on-surface-variant">
        All plans include secure Google login, watch history sync, and access to your
        playlists.
      </section>
    </div>
  );
};

export default SubscriptionPage;
