"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
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
function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
function fromMinutes(n: number) {
  return `${String(Math.floor(n/60)).padStart(2,"0")}:${String(n%60).padStart(2,"0")}`;
}

export default function BookingForm({ settings }: Props) {
  const [step, setStep] = useState<1|2|3|4>(1);
  const [tourType, setTourType]         = useState<"private"|"group"|null>(null);
  const [selectedDate, setSelectedDate] = useState<string|null>(null);
  const [startTime, setStartTime]       = useState<string|null>(null);
  const [participants, setParticipants] = useState(2);
  const [form, setForm] = useState({ name:"", email:"", phone:"", notes:"" });
  const [loading, setLoading]   = useState(false);
  const [formError, setFormError] = useState("");

  const today = useMemo(() => { const d=new Date(); d.setHours(0,0,0,0); return d; }, []);
  const [calBase, setCalBase] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const { groupDeparture, privateWindow, arriveEarlyMinutes } = settings.sessions;

  /* ── read ?tour= query & jump to step 2 ── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const parseTour = () => {
      const hash = window.location.hash || "";
      const match = hash.match(/tour=(private|group)/);
      if (match) {
        setTourType(match[1] as "private"|"group");
        setStartTime(match[1] === "group" ? groupDeparture.startTime : null);
        setStep(2);
        const el = document.getElementById("booking");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    parseTour();
    window.addEventListener("hashchange", parseTour);
    return () => window.removeEventListener("hashchange", parseTour);
  }, [groupDeparture.startTime]);

  /* ── private start options (30-min increments) ── */
  const privateStartOptions = useMemo(() => {
    const start = toMinutes(privateWindow.earliestStart);
    const end   = toMinutes(privateWindow.latestStart);
    const out: string[] = [];
    for (let m = start; m <= end; m += 30) out.push(fromMinutes(m));
    return out;
  }, [privateWindow.earliestStart, privateWindow.latestStart]);

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
        body: JSON.stringify({ tourType, date: selectedDate, session: startTime, participants, ...form }),
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

  const pickTour = (t: "private"|"group") => {
    setTourType(t);
    setParticipants(2);
    setStartTime(t === "group" ? groupDeparture.startTime : null);
    setStep(2);
  };

  return (
    <section id="booking" className="py-28" style={{ background: "var(--cream)" }}>
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="section-kanji text-3xl mb-3">予約</p>
          <p className="section-label">Reserve</p>
          <h2 className="font-serif text-5xl md:text-6xl">
            Book your<br/>
            <em className="italic" style={{ color: "var(--accent)" }}>sacred walk.</em>
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
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all font-ui"
                    style={{
                      background: done || current ? "var(--accent)" : "var(--cream-deep)",
                      color: done || current ? "#fff" : "var(--ink-soft)",
                      boxShadow: current ? "0 0 0 4px rgba(138,109,74,0.15)" : "none",
                    }}
                  >
                    {done ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                      </svg>
                    ) : s}
                  </div>
                  <span className="text-[10px] mt-1 font-medium whitespace-nowrap hidden sm:block font-ui" style={{ color: current ? "var(--accent)" : "var(--ink-soft)" }}>
                    {label}
                  </span>
                </div>
                {s < 4 && <div className="w-12 h-0.5 mx-2 mb-4" style={{ background: s < step ? "var(--accent)" : "var(--cream-deep)" }} />}
              </div>
            );
          })}
        </div>

        {/* ─── Step 1: Tour Type ─── */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-center mb-6" style={{ color: "var(--ink)" }}>Choose your experience</h3>
            <button
              onClick={() => pickTour("private")}
              className="w-full p-6 border text-left group transition-all hover:shadow-sm"
              style={{ borderColor: "var(--cream-deep)", background: "#fff" }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="font-jp text-sm mb-1" style={{ color: "var(--accent)" }}>貸切</p>
                  <div className="font-serif text-xl mb-1" style={{ color: "var(--ink)" }}>Private Tour</div>
                  <div className="text-sm mb-2" style={{ color: "var(--ink-soft)" }}>Your party only · flexible start {privateWindow.earliestStart}–{privateWindow.latestStart}</div>
                  <div className="text-sm font-medium" style={{ color: "var(--accent)" }}>
                    From ¥{settings.pricing.private.basePrice.toLocaleString()} for {settings.pricing.private.basePersons} people
                    &nbsp;·&nbsp; +¥{settings.pricing.private.additionalPersonPrice.toLocaleString()} per additional person
                  </div>
                </div>
                <svg className="w-5 h-5 self-center flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--accent)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </button>

            <button
              onClick={() => pickTour("group")}
              className="w-full p-6 border text-left group transition-all hover:shadow-sm"
              style={{ borderColor: "var(--cream-deep)", background: "#fff" }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="font-jp text-sm mb-1" style={{ color: "var(--accent)" }}>相席</p>
                  <div className="font-serif text-xl mb-1" style={{ color: "var(--ink)" }}>Group Tour</div>
                  <div className="text-sm mb-2" style={{ color: "var(--ink-soft)" }}>
                    Departs daily {groupDeparture.startTime}–{groupDeparture.endTime} · min. {settings.pricing.group.minParticipants} to run
                  </div>
                  <div className="text-sm font-medium" style={{ color: "var(--accent)" }}>
                    ¥{settings.pricing.group.pricePerPerson.toLocaleString()} per person
                  </div>
                </div>
                <svg className="w-5 h-5 self-center flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--accent)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </button>
          </div>
        )}

        {/* ─── Step 2: Date & Session ─── */}
        {step === 2 && tourType && (
          <div>
            <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm mb-6 transition-colors font-ui" style={{ color: "var(--ink-soft)" }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              Back
            </button>

            <div className="text-center mb-6">
              <p className="font-jp text-sm mb-1" style={{ color: "var(--accent)" }}>
                {tourType === "private" ? "貸切" : "相席"}
              </p>
              <h3 className="font-serif text-2xl" style={{ color: "var(--ink)" }}>
                {tourType === "private" ? "Private Tour" : "Group Tour"} · Date &amp; time
              </h3>
            </div>

            {/* Calendar */}
            <div className="border p-6 mb-6" style={{ borderColor: "var(--cream-deep)", background: "#fff" }}>
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={() => setCalBase(d => new Date(d.getFullYear(), d.getMonth()-1, 1))}
                  disabled={!canGoBackMonth}
                  className="p-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ color: "var(--ink-soft)" }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <span className="font-serif text-lg" style={{ color: "var(--ink)" }}>
                  {MONTH_NAMES[calBase.getMonth()]} {calBase.getFullYear()}
                </span>
                <button
                  onClick={() => setCalBase(d => new Date(d.getFullYear(), d.getMonth()+1, 1))}
                  className="p-2 transition-colors"
                  style={{ color: "var(--ink-soft)" }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-7 mb-2">
                {DAY_NAMES.map(d => (
                  <div key={d} className="text-center text-[10px] tracking-[0.2em] uppercase font-ui py-1" style={{ color: "var(--ink-soft)" }}>{d}</div>
                ))}
              </div>

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
                      onClick={() => {
                        setSelectedDate(isoDate(date));
                        if (tourType === "private") setStartTime(null);
                      }}
                      className="aspect-square text-sm transition-all font-ui"
                      style={{
                        background: sel ? "var(--accent)" : "transparent",
                        color: sel ? "#fff" : blocked ? "var(--cream-deep)" : "var(--ink)",
                        border: isToday && !sel ? "1px solid var(--accent)" : "1px solid transparent",
                        cursor: blocked ? "not-allowed" : "pointer",
                      }}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Session / time selection */}
            {selectedDate && tourType === "group" && (
              <div className="border p-5 mb-4" style={{ borderColor: "var(--cream-deep)", background: "#fff" }}>
                <p className="text-[11px] tracking-[0.3em] uppercase mb-2 font-ui" style={{ color: "var(--ink-soft)" }}>Departure</p>
                <p className="font-serif text-xl mb-1" style={{ color: "var(--ink)" }}>
                  {groupDeparture.startTime} – {groupDeparture.endTime}
                </p>
                <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                  Please arrive {arriveEarlyMinutes} minutes early at our shop on Geku Sando.
                </p>
              </div>
            )}

            {selectedDate && tourType === "private" && (
              <div className="border p-5 mb-4" style={{ borderColor: "var(--cream-deep)", background: "#fff" }}>
                <p className="text-[11px] tracking-[0.3em] uppercase mb-3 font-ui" style={{ color: "var(--ink-soft)" }}>Choose start time</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                  {privateStartOptions.map(t => {
                    const on = t === startTime;
                    return (
                      <button
                        key={t}
                        onClick={() => setStartTime(t)}
                        className="py-2 text-sm font-ui transition-all"
                        style={{
                          background: on ? "var(--accent)" : "transparent",
                          color: on ? "#fff" : "var(--ink)",
                          border: `1px solid ${on ? "var(--accent)" : "var(--cream-deep)"}`,
                        }}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
                <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                  Walk duration ~{privateWindow.durationHours} hours. Please arrive {arriveEarlyMinutes} minutes early.
                </p>
              </div>
            )}

            {selectedDate && startTime && (
              <button
                onClick={() => setStep(3)}
                className="btn-primary w-full"
              >
                Continue →
              </button>
            )}
          </div>
        )}

        {/* ─── Step 3: Participants ─── */}
        {step === 3 && (
          <div>
            <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm mb-6 font-ui" style={{ color: "var(--ink-soft)" }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
            <h3 className="font-serif text-2xl text-center mb-6" style={{ color: "var(--ink)" }}>Number of participants</h3>

            <div className="border p-10" style={{ borderColor: "var(--cream-deep)", background: "#fff" }}>
              <div className="flex items-center justify-center gap-8">
                <button
                  onClick={() => setParticipants(p => Math.max(2, p-1))}
                  disabled={participants <= 2}
                  className="w-14 h-14 border text-3xl font-light transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                  style={{ borderColor: "var(--cream-deep)", color: "var(--ink-soft)" }}
                >−</button>
                <div className="text-center w-24">
                  <div className="text-6xl font-serif" style={{ color: "var(--ink)" }}>{participants}</div>
                  <div className="text-xs tracking-[0.25em] uppercase mt-1 font-ui" style={{ color: "var(--ink-soft)" }}>people</div>
                </div>
                <button
                  onClick={() => setParticipants(p => Math.min(settings.maxParticipants, p+1))}
                  disabled={participants >= settings.maxParticipants}
                  className="w-14 h-14 border text-3xl font-light transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                  style={{ borderColor: "var(--cream-deep)", color: "var(--ink-soft)" }}
                >+</button>
              </div>

              <div className="mt-8 p-5 text-center" style={{ background: "var(--cream-mid)" }}>
                <div className="text-[10px] tracking-[0.3em] uppercase mb-2 font-ui" style={{ color: "var(--ink-soft)" }}>Total Price</div>
                <div className="text-4xl font-serif" style={{ color: "var(--accent)" }}>
                  ¥{totalPrice.toLocaleString()}
                </div>
                {tourType === "private" && participants > settings.pricing.private.basePersons && (
                  <div className="text-xs mt-2 font-ui" style={{ color: "var(--ink-soft)" }}>
                    ¥{settings.pricing.private.basePrice.toLocaleString()} base
                    + {participants - settings.pricing.private.basePersons} × ¥{settings.pricing.private.additionalPersonPrice.toLocaleString()}
                  </div>
                )}
                {tourType === "group" && participants < settings.pricing.group.minParticipants && (
                  <div className="mt-3 text-xs px-3 py-2" style={{ color: "var(--sumac)", background: "rgba(154,62,58,0.08)", border: "1px solid rgba(154,62,58,0.25)" }}>
                    Group tours need {settings.pricing.group.minParticipants}+ participants to run.
                    If the minimum isn&apos;t reached we&apos;ll contact you 48 hours before.
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setStep(4)}
              className="btn-primary w-full mt-4"
            >
              Continue →
            </button>
          </div>
        )}

        {/* ─── Step 4: Contact + Review ─── */}
        {step === 4 && (
          <div>
            <button onClick={() => setStep(3)} className="flex items-center gap-1 text-sm mb-6 font-ui" style={{ color: "var(--ink-soft)" }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
            <h3 className="font-serif text-2xl text-center mb-6" style={{ color: "var(--ink)" }}>Your details &amp; review</h3>

            <div className="p-6 mb-6 text-white" style={{ background: "var(--cedar-deep)" }}>
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-4 font-ui">Booking Summary</div>
              <div className="space-y-2.5 text-sm">
                {[
                  ["Tour Type",    tourType === "private" ? "Private Tour" : "Group Tour"],
                  ["Date",         selectedDate ? displayDate(selectedDate) : "—"],
                  ["Start Time",   startTime ? `${startTime} (arrive ${arriveEarlyMinutes} min early)` : "—"],
                  ["Participants", `${participants} person${participants>1?"s":""}`],
                ].map(([k,v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-white/50">{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
                <div className="border-t border-white/15 pt-3 mt-1 flex justify-between items-center">
                  <span className="text-white/50">Total</span>
                  <span className="text-2xl font-serif" style={{ color: "#d9c5a4" }}>
                    ¥{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase mb-1.5 font-ui" style={{ color: "var(--ink-soft)" }}>
                  Full Name <span style={{ color: "var(--sumac)" }}>*</span>
                </label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Your full name" className="field" />
              </div>
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase mb-1.5 font-ui" style={{ color: "var(--ink-soft)" }}>
                  Email Address <span style={{ color: "var(--sumac)" }}>*</span>
                </label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="you@example.com" className="field" />
              </div>
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase mb-1.5 font-ui" style={{ color: "var(--ink-soft)" }}>Phone Number</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+81 90 0000 0000" className="field" />
              </div>
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase mb-1.5 font-ui" style={{ color: "var(--ink-soft)" }}>Special Requests / Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Dietary requirements, accessibility needs, questions..." rows={3} className="field resize-none" />
              </div>

              {formError && (
                <div className="flex items-start gap-2 p-3 text-sm" style={{ background: "rgba(154,62,58,0.08)", border: "1px solid rgba(154,62,58,0.3)", color: "var(--sumac)" }}>
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {formError}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/>
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>Proceed to Secure Payment →</>
                )}
              </button>

              <p className="text-center text-[10px] tracking-[0.25em] uppercase font-ui" style={{ color: "var(--ink-soft)" }}>
                Secured by Stripe · You&apos;ll be redirected to complete payment
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
