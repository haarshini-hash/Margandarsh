import React from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Plus, Boxes, BadgeIndianRupee, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function ArtisanDashboard() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["my-products"],
    queryFn: () => base44.entities.Product.filter({}, "-created_date", 50),
  });

  const active = products.filter((p) => p.status === "active");
  const whiteLabel = active.filter((p) => p.mode === "white_label");
  const proprietary = active.filter((p) => p.mode === "proprietary");

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight">Artisan Studio</h1>
          <p className="mt-2 text-muted-foreground">Your production units, listings, and live contracts.</p>
        </div>
        <Link to="/create" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition self-start">
          <Plus className="w-4 h-4" /> New Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-10">
        <Stat label="Active Listings" value={active.length} />
        <Stat label="White-Label Units" value={whiteLabel.length} icon={Boxes} tone="amber" />
        <Stat label="Branded Products" value={proprietary.length} icon={BadgeIndianRupee} tone="rose" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : active.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center">
          <p className="text-muted-foreground">No listings yet. Create your first product with voice and a camera snap.</p>
          <Link to="/create" className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium">
            <Plus className="w-4 h-4" /> Start Listing
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {active.map((p) => (
            <Link key={p.id} to={`/product/${p.id}`} className="group rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                {p.image_url && <Image src={p.image_url} className="w-full h-full" fittingType="fill" />}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] uppercase tracking-wider font-medium ${p.mode === "white_label" ? "text-amber-700" : "text-rose-700"}`}>
                    {p.mode === "white_label" ? "White-Label" : "Proprietary"}
                  </span>
                  {p.gi_tag && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">GI Tag</span>}
                </div>
                <h3 className="font-heading font-semibold text-sm group-hover:underline">{p.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{p.category} · {p.region}</p>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-semibold">₹{p.price_per_unit}<span className="text-xs text-muted-foreground font-normal">/unit</span></span>
                  <span className="text-xs text-muted-foreground">MOQ {p.moq}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, icon: Icon, tone }) {
  const tones = { amber: "text-amber-700 bg-amber-50", rose: "text-rose-700 bg-rose-50" };
  return (
    <div className="rounded-2xl border border-border p-4 sm:p-5">
      <div className="flex items-center gap-2">
        {Icon && <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${tones[tone]}`}><Icon className="w-4 h-4" /></div>}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="mt-2 text-2xl font-heading font-semibold">{value}</div>
    </div>
  );
}
