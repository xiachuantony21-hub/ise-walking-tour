"use client";

import { useState, useMemo, useCallback } from "react";
import type { Settings } from "@/lib/data";

interface Props { settings: Settings }

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function displayDate(s: string) {
  const [y,m,d] = s.split("-");
  return `${MONTH_NAMES[+m-1]} ${+d}, ${y}`;
}

export default function BookingForm({ settings }: Props) {
  const [step, setStep] = useState<1|2|3|4>(1);
  const [tourType, setTourType]         = useState<"private"|"group"|null>(null);
  const [selectedDate, setSelectedDate] = useState<string|null>(null);
  const [session, setSession]           = useState<"morning"|"afternoon"|null>(null);
  const [participants, setParticipants] = useState(2);
  const [form, setForm] = useState({ name:"", email:"", phone:"", notes:"" });
  const [loading, setLoading]   = useState(false);
  const [formError, setFormError] = useState("");

  const today = useMemo(() => { const d=new Date(); d.setHours(0,0,0,0); return d; }, []);
  const [calBase, setCalBase] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  /* ── price calc ── */
  const totalPrice = useMemo(() => {
    if (!tourType) return 0;
    const { private: prv, group } = settings.pricing;
    if (tourType === "private") {
      return prv.basePrice + Math.max(0, participants - prv.basePersons) * prv.additionalPersonPrice;
    }
    return group.pricePerPerson * participants;
  }, [tourType, participants, settings.pricing]);

  /* ── calendar grid ── */
  const calDays = useMemo(() => {
    const y = calBase.getFullYear(), m = calBase.getMonth();
    const first = new Date(y,m,1).getDay();
    const last  = new Date(y,m+1,0).getDate();
    const days: (Date|null)[] = [];
    for (let i=0; i<first; i++) days.push(null);
    for (let d=1; d<=last; d++) days.push(new Date(y,m,d));
    return days;
  }, [calBase]);

  const isBlocked = useCallback((d: Date) =>
    d < today || settings.blockedDates.includes(isoDate(d)),
  [today, settings.blockedDates]);

  const canGoBackMonth = calBase > new Date(today.getFullYear(), today.getMonth(), 1);

  /* ── submit ── */
  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setFormError("Please fill in your name and email.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setFormError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tourType, date: selectedDate, session, participants, ...form }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Server error");
      }
      const { url } = await res.json();
      window.location.href = url;
    } catch (e) {
      setLoading(false);
      setFormError((e as Error).message || "Something went wrong. Please try again.");
    }
  };

  const stepLabels = ["Tour Type","Date & Time","Participants","Review & Pay"];

  return (
    <section id="booking" className="py-28 bg-white">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="section-kanji text-3xl mb-3">予約</p>
          <p className="section-label">Reserve</p>
          <h2 className="font-serif text-5xl md:text-6xl">
            Book your<br/>
            <em className="not-italic" style={{ color: "var(--torii)" }}>sacred walk.</em>
          </h2>
          <span className="torii-line" />
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-10 overflow-x-auto pb-2">
          {stepLabels.map((label, i) => {
            const s = (i + 1) as 1|2|3|4;
            const done    = s < step;
            const current = s === step;
            return (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    done    ? "bg-torii-700 text-white" :
                    current ? "bg-torii-700 text-white ring-4 ring-torii-100" :
                              "bg-stone-100 text-stone-400"
                  }`}>
                    {done ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                      </svg>
                    ) : s}
                  </div>
                  <span className={`text-[10px] mt-1 font-medium whitespace-nowrap hidden sm:block ${current ? "text-torii-700" : "text-stone-400"}`}>
                    {label}
                  </span>
                </div>
                {s < 4 && <div className={`w-12 h-0.5 mx-2 mb-4 ${s < step ? "bg-torii-700" : "bg-stone-200"}`} />}
              </div>
            );
          })}
        </div>

        {/* ─── Step 1: Tour Type ─── */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-center text-stone-800 mb-6">Choose your experience</h3>
            <button
              onClick={() => { setTourType("private"); setParticipants(2); setStep(2); }}
              className="w-full p-6 border-2 border-stone-200 rounded-2xl hover:border-torii-700 hover:bg-red-50/50 transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 group-hover:bg-red-200 transition-colors flex items-center justify-center text-2xl flex-shrink-0">👑</div>
                <div className="flex-1">
                  <div className="font-semibold text-stone-900 text-lg mb-1">Private Tour</div>
                  <div className="text-stone-500 text-sm mb-2">Exclusive to your group — your pace, your experience</div>
                  <div className="text-torii-700 font-semibold text-sm">
                    From ¥{settings.pricing.private.basePrice.toLocaleString()} for {settings.pricing.private.basePersons} people
                    &nbsp;·&nbsp; +¥{settings.pricing.private.additionalPersonPrice.toLocaleString()} per additional person
                  </div>
                </div>
                <svg className="w-5 h-5 text-stone-300 group-hover:text-torii-700 transition-colors self-center flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </button>

            <button
              onClick={() => { setTourType("group"); setParticipants(2); setStep(2); }}
              className="w-full p-6 border-2 border-stone-200 rounded-2xl hover:border-yama-teal hover:bg-teal-50/50 transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 group-hover:bg-teal-200 transition-colors flex items-center justify-center text-2xl flex-shrink-0">🤝</div>
                <div className="flex-1">
                  <div className="font-semibold text-stone-900 text-lg mb-1">Group Tour</div>
                  <div className="text-stone-500 text-sm mb-2">Join fellow travelers · Minimum {settings.pricing.group.minParticipants} participants to run</div>
                  <div className="text-yama-teal font-semibold text-sm">
                    ¥{settings.pricing.group.pricePerPerson.toLocaleString()} per person
                  </div>
                </div>
                <svg className="w-5 h-5 text-stone-300 group-hover:text-yama-teal transition-colors self-center flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </button>
          </div>
        )}

        {/* ─── Step 2: Date & Session ─── */}
        {step === 2 && (
          <div>
            <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-stone-400 hover:text-stone-600 mb-6 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
            <h3 className="font-serif text-2xl text-center text-stone-800 mb-6">Select date &amp; time</h3>

            {/* Calendar */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={() => setCalBase(d => new Date(d.getFullYear(), d.getMonth()-1, 1))}
                  disabled={!canGoBackMonth}
                  className="p-2 rounded-lg hover:bg-stone-100 transition-colors text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <span className="font-semibold text-stone-800">
                  {MONTH_NAMES[calBase.getMonth()]} {calBase.getFullYear()}
                </span>
                <button
                  onClick={() => setCalBase(d => new Date(d.getFullYear(), d.getMonth()+1, 1))}
                  className="p-2 rounded-lg hover:bg-stone-100 transition-colors text-stone-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {DAY_NAMES.map(d => (
                  <div key={d} className="text-center text-xs text-stone-400 font-medium py-1">{d}</div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {calDays.map((date, i) => {
                  if (!date) return <div key={i} />;
                  const blocked = isBlocked(date);
                  const sel     = isoDate(date) === selectedDate;
                  const isToday = isoDate(date) === isoDate(today);
                  return (
                    <button
                      key={i}
                      disabled={blocked}
                      onClick={() => { setSelectedDate(isoDate(date)); setSession(null); }}
                      className={[
                        "aspect-square rounded-xl text-sm font-medium transition-all",
                        blocked ? "text-stone-200 cursor-not-allowed" : "cursor-pointer",
                        sel     ? "bg-torii-700 text-white shadow-md shadow-torii-900/30" :
                        isToday ? "border-2 border-torii-200 text-stone-700 hover:bg-red-50" :
                        blocked ? "" : "text-stone-700 hover:bg-stone-100",
                      ].join(" ")}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Session selector */}
            {selectedDate && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-stone-700">
                  Session for <span className="text-torii-700">{displayDate(selectedDate)}</span>:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {settings.sessions.morning.active && (
                    <button
                      onClick={() => setSession("morning")}
                      className={`p-5 border-2 rounded-2xl text-center transition-all ${
                        session === "morning"
                          ? "border-torii-700 bg-red-50"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div className="text-3xl mb-2">🌅</div>
                      <div className="font-semibold text-stone-800">Morning</div>
                      <div className="text-sm text-stone-500 mt-0.5">
                        {settings.sessions.morning.startTime}–{settings.sessions.morning.endTime}
                      </div>
                    </button>
                  )}
                  {settings.sessions.afternoon.active && (
                    <button
                      onClick={() => setSession("afternoon")}
                      className={`p-5 border-2 rounded-2xl text-center transition-all ${
                        session === "afternoon"
                          ? "border-torii-700 bg-red-50"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div className="text-3xl mb-2">🌇</div>
                      <div className="font-semibold text-stone-800">Afternoon</div>
                      <div className="text-sm text-stone-500 mt-0.5">
                        {settings.sessions.afternoon.startTime}–{settings.sessions.afternoon.endTime}
                      </div>
                    </button>
                  )}
                </div>
                {session && (
                  <button
                    onClick={() => setStep(3)}
                    className="w-full mt-2 py-3.5 bg-torii-700 text-white rounded-xl hover:bg-torii-800 transition-colors font-semibold"
                  >
                    Continue →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ─── Step 3: Participants ─── */}
        {step === 3 && (
          <div>
            <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-stone-400 hover:text-stone-600 mb-6 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
            <h3 className="font-serif text-2xl text-center text-stone-800 mb-6">Number of participants</h3>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-10">
              <div className="flex items-center justify-center gap-8">
                <button
                  onClick={() => setParticipants(p => Math.max(2, p-1))}
                  disabled={participants <= 2}
                  className="w-14 h-14 rounded-full border-2 border-stone-200 text-3xl font-light text-stone-600 hover:border-torii-700 hover:text-torii-700 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                >−</button>
                <div className="text-center w-24">
                  <div className="text-6xl font-serif font-medium text-stone-900">{participants}</div>
                  <div className="text-stone-400 text-sm mt-1">people</div>
                </div>
                <button
                  onClick={() => setParticipants(p => Math.min(settings.maxParticipants, p+1))}
                  disabled={participants >= settings.maxParticipants}
                  className="w-14 h-14 rounded-full border-2 border-stone-200 text-3xl font-light text-stone-600 hover:border-torii-700 hover:text-torii-700 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                >+</button>
              </div>

              {/* Live price */}
              <div className="mt-8 p-5 bg-stone-50 rounded-xl text-center">
                <div className="text-sm text-stone-500 mb-1">Total Price</div>
                <div className="text-4xl font-serif font-semibold text-torii-700">
                  ¥{totalPrice.toLocaleString()}
                </div>
                {tourType === "private" && participants > settings.pricing.private.basePersons && (
                  <div className="text-xs text-stone-400 mt-2">
                    ¥{settings.pricing.private.basePrice.toLocaleString()} base
                    + {participants - settings.pricing.private.basePersons} × ¥{settings.pricing.private.additionalPersonPrice.toLocaleString()}
                  </div>
                )}
                {tourType === "group" && participants < settings.pricing.group.minParticipants && (
                  <div className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    ⚠ Group tours need {settings.pricing.group.minParticipants}+ participants to run.
                    If the minimum isn&apos;t reached we&apos;ll contact you 48 hours before.
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setStep(4)}
              className="w-full mt-4 py-3.5 bg-torii-700 text-white rounded-xl hover:bg-torii-800 transition-colors font-semibold"
            >
              Continue →
            </button>
          </div>
        )}

        {/* ─── Step 4: Contact + Review ─── */}
        {step === 4 && (
          <div>
            <button onClick={() => setStep(3)} className="flex items-center gap-1 text-sm text-stone-400 hover:text-stone-600 mb-6 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
            <h3 className="font-serif text-2xl text-center text-stone-800 mb-6">Your details &amp; review</h3>

            {/* Summary */}
            <div className="bg-stone-900 text-white rounded-2xl p-6 mb-6">
              <div className="text-xs uppercase tracking-widest text-stone-400 mb-4">Booking Summary</div>
              <div className="space-y-2.5 text-sm">
                {[
                  ["Tour Type", tourType === "private" ? "Private Tour 👑" : "Group Tour 🤝"],
                  ["Date",      selectedDate ? displayDate(selectedDate) : "—"],
                  ["Session",   session === "morning"
                    ? `Morning · ${settings.sessions.morning.startTime}–${settings.sessions.morning.endTime}`
                    : `Afternoon · ${settings.sessions.afternoon.startTime}–${settings.sessions.afternoon.endTime}`],
                  ["Participants", `${participants} person${participants>1?"s":""}`],
                ].map(([k,v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-stone-400">{k}</span>
                    <span className="font-medium capitalize">{v}</span>
                  </div>
                ))}
                <div className="border-t border-stone-700 pt-3 mt-1 flex justify-between items-center">
                  <span className="text-stone-400">Total</span>
                  <span className="text-2xl font-serif font-semibold text-red-400">
                    ¥{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Full Name <span className="text-torii-600">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  placeholder="Your full name"
                  className="field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Email Address <span className="text-torii-600">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({...f, email: e.target.value}))}
                  placeholder="you@example.com"
                  className="field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                  placeholder="+81 90 0000 0000"
                  className="field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Special Requests / Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({...f, notes: e.target.value}))}
                  placeholder="Dietary requirements, accessibility needs, questions..."
                  rows={3}
                  className="field resize-none"
                />
              </div>

              {formError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {formError}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-torii-700 text-white rounded-xl hover:bg-torii-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-torii-900/20"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/>
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>
                    Proceed to Secure Payment
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-stone-400">
                🔒 Secured by Stripe · You&apos;ll be redirected to complete payment
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
