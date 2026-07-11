"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Star,
  MapPin,
  Globe,
  Clock,
  TrendingUp,
  TrendingDown,
  X,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";

import { Competitor } from "../../types/competitor";

const COMPETITORS: Competitor[] = [
  {
    id: "1",
    name: "Bluebird Coffee Co.",
    category: "Coffee Shop",
    distance: 0.4,
    rating: 4.7,
    reviews: 1284,
    website: "bluebirdcoffee.com",
    hours: "7:00 AM – 8:00 PM",
    open: true,
    categories: ["Coffee", "Bakery", "Breakfast"],
    strengths: ["Fast service", "Loyalty program", "Strong Instagram presence"],
    weaknesses: ["Limited seating", "No parking"],
  },
  {
    id: "2",
    name: "Northside Roasters",
    category: "Coffee Shop",
    distance: 0.8,
    rating: 4.5,
    reviews: 892,
    website: "northsideroasters.co",
    hours: "6:30 AM – 6:00 PM",
    open: true,
    categories: ["Coffee", "Roastery"],
    strengths: ["House-roasted beans", "Barista training"],
    weaknesses: ["Slow at peak hours", "Weak website SEO"],
  },
  {
    id: "3",
    name: "The Daily Grind",
    category: "Cafe",
    distance: 1.2,
    rating: 4.2,
    reviews: 456,
    website: "dailygrindcafe.com",
    hours: "8:00 AM – 5:00 PM",
    open: false,
    categories: ["Cafe", "Sandwiches"],
    strengths: ["Lunch menu", "Outdoor seating"],
    weaknesses: ["Inconsistent reviews", "Limited hours"],
  },
  {
    id: "4",
    name: "Ember & Oak",
    category: "Cafe",
    distance: 1.6,
    rating: 4.8,
    reviews: 2103,
    website: "emberandoak.com",
    hours: "7:00 AM – 9:00 PM",
    open: true,
    categories: ["Coffee", "Bakery", "Wine Bar"],
    strengths: ["Premium ambiance", "Evening menu", "Top-rated pastries"],
    weaknesses: ["Higher prices"],
  },
  {
    id: "5",
    name: "Morning Ritual",
    category: "Coffee Shop",
    distance: 2.1,
    rating: 4.3,
    reviews: 312,
    website: "morningritual.cafe",
    hours: "6:00 AM – 2:00 PM",
    open: true,
    categories: ["Coffee", "Breakfast"],
    strengths: ["Early hours", "Mobile ordering"],
    weaknesses: ["Small menu", "No dinner service"],
  },
  {
    id: "6",
    name: "Perch Coffee Bar",
    category: "Coffee Shop",
    distance: 2.6,
    rating: 4.6,
    reviews: 745,
    website: "perchcoffee.bar",
    hours: "7:00 AM – 7:00 PM",
    open: true,
    categories: ["Coffee", "Cocktails"],
    strengths: ["Unique concept", "Strong branding"],
    weaknesses: ["New to market", "Low review count"],
  },
];

export default function CompetitorExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [distance, setDistance] = useState("10");
  const [rating, setRating] = useState("0");
  const [reviewCount, setReviewCount] = useState("0");
  const [sort, setSort] = useState("distance");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<Competitor | null>(null);

  const filtered = useMemo(() => {
    let list = COMPETITORS.filter((c) => {
      if (query && !c.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (category !== "all" && c.category !== category) return false;
      if (c.distance > Number(distance)) return false;
      if (c.rating < Number(rating)) return false;
      if (c.reviews < Number(reviewCount)) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "distance") return a.distance - b.distance;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "reviews") return b.reviews - a.reviews;
      return 0;
    });
    return list;
  }, [query, category, distance, rating, reviewCount, sort]);

  const categories = Array.from(new Set(COMPETITORS.map((c) => c.category)));

  // Listen to escape key for sheet close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelected(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
            Market Analysis
          </span>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mt-0.5">
            Competitor Explorer
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            {filtered.length} competitors discovered near your business
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-slate-100 bg-white p-0.5 shadow-sm">
            <button
              onClick={() => setView("grid")}
              className={`h-8 px-2.5 rounded-lg flex items-center justify-center transition-all ${
                view === "grid"
                  ? "bg-slate-100 text-slate-900 font-semibold animate-none"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`h-8 px-2.5 rounded-lg flex items-center justify-center transition-all ${
                view === "list"
                  ? "bg-slate-100 text-slate-900 font-semibold animate-none"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white border border-slate-100/80 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search competitors by name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-10 px-3 pl-10 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
            />
          </div>

          {/* Select Dropdowns grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <SelectDropdown value={category} onChange={setCategory}>
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </SelectDropdown>

            <SelectDropdown value={distance} onChange={setDistance}>
              <option value="1">Within 1 mi</option>
              <option value="3">Within 3 mi</option>
              <option value="5">Within 5 mi</option>
              <option value="10">Within 10 mi</option>
            </SelectDropdown>

            <SelectDropdown value={rating} onChange={setRating}>
              <option value="0">Any rating</option>
              <option value="3">3.0+</option>
              <option value="4">4.0+</option>
              <option value="4.5">4.5+</option>
            </SelectDropdown>

            <SelectDropdown value={reviewCount} onChange={setReviewCount}>
              <option value="0">Any reviews</option>
              <option value="100">100+</option>
              <option value="500">500+</option>
              <option value="1000">1,000+</option>
            </SelectDropdown>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none h-10 w-full pl-8 pr-8 bg-white border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="distance">Nearest</option>
                <option value="rating">Top rated</option>
                <option value="reviews">Most reviewed</option>
              </select>
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Results grid/list */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-100/80 rounded-2xl py-16 text-center shadow-sm">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 text-slate-400">
            <Search className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No competitors match your filters</p>
          <p className="text-xs text-slate-400 mt-1">Try widening distance or lowering rating.</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <CompetitorCard key={c.id} c={c} onOpen={() => setSelected(c)} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <CompetitorRow key={c.id} c={c} onOpen={() => setSelected(c)} />
          ))}
        </div>
      )}

      {/* Slide-over Side Panel Overlay & Sheet */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 z-50 ${
          selected ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSelected(null)}
      />
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:max-w-xl bg-white border-l border-slate-100 shadow-2xl transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          selected ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selected && <CompetitorPanel c={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  );
}

// Custom Select Dropdown
function SelectDropdown({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (val: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none h-10 w-full pl-3 pr-8 bg-white border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm focus:outline-none focus:border-blue-500 cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
    </div>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg text-amber-700">
      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
      <span className="text-xs font-bold">{rating.toFixed(1)}</span>
    </div>
  );
}

function CompetitorCard({ c, onOpen }: { c: Competitor; onOpen: () => void }) {
  return (
    <div className="bg-white border border-slate-100/80 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all duration-200 flex flex-col h-full group">
      <div className="p-5 border-b border-slate-50">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors truncate">
              {c.name}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400 font-medium">
              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
              <span>{c.distance} mi away</span>
              <span>•</span>
              <span className="truncate">{c.category}</span>
            </div>
          </div>
          <RatingStars rating={c.rating} />
        </div>
      </div>

      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span>{c.reviews.toLocaleString()} Google reviews</span>
            <a
              href={`https://${c.website}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-0.5 text-blue-500 hover:text-blue-600 hover:underline"
            >
              <Globe className="h-3 w-3" />
              <span className="truncate max-w-[120px]">{c.website}</span>
            </a>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-medium">
            <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span
              className={c.open ? "text-emerald-600" : "text-slate-400"}
            >
              {c.open ? "Open" : "Closed"}
            </span>
            <span className="text-slate-400">· {c.hours}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {c.categories.map((cat) => (
              <span
                key={cat}
                className="px-2 py-0.5 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-semibold"
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="border-t border-slate-50 pt-3.5 space-y-2.5 text-[11px]">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <div className="font-bold text-slate-600">Strengths</div>
                <div className="text-slate-400 font-medium leading-normal">
                  {c.strengths.slice(0, 2).join(" · ")}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <TrendingDown className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <div className="font-bold text-slate-600">Weaknesses</div>
                <div className="text-slate-400 font-medium leading-normal">
                  {c.weaknesses.slice(0, 2).join(" · ")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 mt-auto">
          <button
            onClick={onOpen}
            className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-all shadow-sm shadow-blue-500/10 active:scale-95 cursor-pointer"
          >
            <span>View Analysis</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CompetitorRow({ c, onOpen }: { c: Competitor; onOpen: () => void }) {
  return (
    <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors truncate">
            {c.name}
          </h3>
          <RatingStars rating={c.rating} />
          <span className="text-[11px] font-semibold text-slate-400">
            ({c.reviews.toLocaleString()} reviews)
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-semibold">
            {c.category}
          </span>
        </div>
        
        <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400 font-medium flex-wrap">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {c.distance} mi away
          </span>
          <a
            href={`https://${c.website}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-blue-500 hover:underline"
          >
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            {c.website}
          </a>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span className={c.open ? "text-emerald-600" : "text-slate-400"}>
              {c.open ? "Open" : "Closed"}
            </span>
            · {c.hours}
          </span>
        </div>
      </div>

      <div className="flex-shrink-0">
        <button
          onClick={onOpen}
          className="h-9 px-4 bg-white border border-slate-100 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <span>View Analysis</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function CompetitorPanel({ c, onClose }: { c: Competitor; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "seo" | "compare">("overview");

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Panel Header */}
      <div className="p-5 bg-white border-b border-slate-100 flex items-start justify-between gap-3 flex-shrink-0">
        <div className="min-w-0">
          <h2 className="text-base font-extrabold text-slate-800 tracking-tight truncate">
            {c.name}
          </h2>
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400 font-medium">
            <RatingStars rating={c.rating} />
            <span>({c.reviews.toLocaleString()} reviews)</span>
            <span>·</span>
            <span>{c.distance} mi away</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto min-h-0 p-5 space-y-5">
        
        {/* AI Summary Section */}
        <div className="bg-gradient-to-br from-blue-50/70 to-blue-100/40 border border-blue-100/80 rounded-2xl p-5 shadow-sm shadow-blue-500/5 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-400/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
              <Sparkles className="h-3.5 w-3.5 fill-blue-500" />
            </div>
            <span className="text-xs font-extrabold text-blue-700 tracking-wide uppercase">
              AI Summary
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            {c.name} is a strong regional competitor with consistent customer satisfaction.
            Their brand voice is premium and their online presence outperforms most peers
            within a 2-mile radius.
          </p>
        </div>

        {/* Custom Tab Triggers */}
        <div className="bg-white border border-slate-100/80 rounded-xl p-1 flex shadow-sm">
          {([
            { id: "overview", label: "Overview" },
            { id: "reviews", label: "Reviews" },
            { id: "seo", label: "SEO" },
            { id: "compare", label: "Compare" },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-slate-100 text-slate-800 shadow-xs"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        <div className="space-y-4">
          {activeTab === "overview" && (
            <>
              <PanelSection title="Overview">
                <InfoRow label="Category" value={c.category} />
                <InfoRow label="Distance" value={`${c.distance} mi`} />
                <InfoRow label="Hours" value={c.hours} />
                <InfoRow
                  label="Website"
                  value={
                    <a
                      href={`https://${c.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 hover:underline inline-flex items-center gap-1 font-bold"
                    >
                      {c.website} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  }
                />
              </PanelSection>

              <PanelSection title="Services">
                <div className="flex flex-wrap gap-1.5">
                  {["Dine-in", "Takeout", "Delivery", "Catering", "Mobile order"].map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wide border border-slate-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </PanelSection>
            </>
          )}

          {activeTab === "reviews" && (
            <>
              <PanelSection title="Review Summary">
                <div className="grid grid-cols-3 gap-3">
                  <Stat label="Avg Rating" value={c.rating.toFixed(1)} />
                  <Stat label="Reviews" value={c.reviews.toLocaleString()} />
                  <Stat label="This month" value="+42" />
                </div>
              </PanelSection>

              <PanelSection title="Customer Sentiment">
                <div className="space-y-3">
                  <SentimentBar label="Positive" value={72} tone="emerald" />
                  <SentimentBar label="Neutral" value={18} tone="slate" />
                  <SentimentBar label="Negative" value={10} tone="amber" />
                </div>
              </PanelSection>

              <PanelSection title="Top Strengths">
                <div className="flex flex-wrap gap-1.5">
                  {c.strengths.map((str) => (
                    <span
                      key={str}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50/70 border border-emerald-100/80 text-emerald-700 text-[10px] font-bold"
                    >
                      {str}
                    </span>
                  ))}
                </div>
              </PanelSection>
              
              <PanelSection title="Top Weaknesses">
                <div className="flex flex-wrap gap-1.5">
                  {c.weaknesses.map((wk) => (
                    <span
                      key={wk}
                      className="px-2.5 py-1 rounded-lg bg-amber-50/70 border border-amber-100/80 text-amber-700 text-[10px] font-bold"
                    >
                      {wk}
                    </span>
                  ))}
                </div>
              </PanelSection>
            </>
          )}

          {activeTab === "seo" && (
            <>
              <PanelSection title="SEO Snapshot">
                <div className="grid grid-cols-3 gap-3">
                  <Stat label="Domain Auth." value="42" />
                  <Stat label="Est. Traffic" value="8.4K" />
                  <Stat label="Keywords" value="312" />
                </div>
              </PanelSection>
              
              <PanelSection title="Popular Keywords">
                <div className="flex flex-wrap gap-1.5">
                  {["best coffee near me", "espresso downtown", "cold brew", "coffee shop wifi", "pastries local"].map((k) => (
                    <span
                      key={k}
                      className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-bold"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </PanelSection>
            </>
          )}

          {activeTab === "compare" && (
            <PanelSection title="Comparison vs. your business">
              <div className="space-y-4">
                <CompareRow label="Rating" me={4.4} them={c.rating} suffix="" />
                <CompareRow label="Reviews" me={480} them={c.reviews} suffix="" />
                <CompareRow label="Est. Traffic" me={3200} them={8400} suffix="" />
                <CompareRow label="Keywords" me={124} them={312} suffix="" />
              </div>
            </PanelSection>
          )}
        </div>
      </div>
    </div>
  );
}

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
        {title}
      </h4>
      <div className="bg-white border border-slate-100/80 rounded-2xl p-4 shadow-sm">
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50 last:border-0">
      <span className="text-slate-400 font-medium">{label}</span>
      <span className="font-bold text-slate-700">{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50/50 border border-slate-100/60 rounded-xl p-3 text-center">
      <div className="text-sm font-extrabold text-slate-800 tracking-tight">{value}</div>
      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
        {label}
      </div>
    </div>
  );
}

function SentimentBar({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "slate" | "amber";
}) {
  const toneClasses = {
    emerald: { bg: "bg-emerald-500", text: "text-emerald-700", lightBg: "bg-emerald-50" },
    slate: { bg: "bg-slate-400", text: "text-slate-600", lightBg: "bg-slate-50" },
    amber: { bg: "bg-amber-500", text: "text-amber-700", lightBg: "bg-amber-50" },
  }[tone];

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-[10px] font-bold">
        <span className="text-slate-400 uppercase tracking-wide">{label}</span>
        <span className={`${toneClasses.text}`}>{value}%</span>
      </div>
      <div className="h-2 w-full bg-slate-50 border border-slate-100/60 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${toneClasses.bg}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function CompareRow({
  label,
  me,
  them,
  suffix,
}: {
  label: string;
  me: number;
  them: number;
  suffix: string;
}) {
  const max = Math.max(me, them);
  const mePct = (me / max) * 100;
  const themPct = (them / max) * 100;
  const winning = me >= them;

  return (
    <div className="space-y-2 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
      <div className="flex justify-between items-center text-[11px]">
        <span className="font-bold text-slate-700">{label}</span>
        <span
          className={`text-[10px] font-extrabold uppercase tracking-wide ${
            winning ? "text-emerald-600" : "text-amber-600"
          }`}
        >
          {winning ? "You lead" : "They lead"}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-[10px] w-8 font-bold text-slate-400 uppercase">You</span>
          <div className="flex-1 h-2 bg-slate-50 border border-slate-100/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${mePct}%` }}
            />
          </div>
          <span className="text-xs w-14 text-right font-extrabold text-slate-800">
            {me.toLocaleString()}
            {suffix}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[10px] w-8 font-bold text-slate-400 uppercase">Them</span>
          <div className="flex-1 h-2 bg-slate-50 border border-slate-100/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-400 rounded-full transition-all duration-300"
              style={{ width: `${themPct}%` }}
            />
          </div>
          <span className="text-xs w-14 text-right font-extrabold text-slate-500">
            {them.toLocaleString()}
            {suffix}
          </span>
        </div>
      </div>
    </div>
  );
}
