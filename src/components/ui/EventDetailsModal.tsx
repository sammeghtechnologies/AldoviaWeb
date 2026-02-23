import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface EventDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onBack?: () => void;
  eventType: string;
  venue: string;
  venueOptions: string[];
  eventTypeOptions?: string[];
  onDone?: (payload: {
    eventType: string;
    venue: string;
    eventDateFrom: string;
    eventDateTo: string;
    expectedGuestCount: number | null;
    fullName: string;
    mobileNumber: string;
    emailAddress: string;
  }) => void;
}

const defaultEventTypes = ["Wedding", "Corporate"];

const toTitleCase = (value: string) =>
  value
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

type Step = "details" | "personal" | "confirmation";

export default function EventDetailsModal({
  open,
  onClose,
  onBack,
  eventType,
  venue,
  venueOptions,
  eventTypeOptions = defaultEventTypes,
  onDone,
}: EventDetailsModalProps) {
  const normalizedEventType = useMemo(() => toTitleCase(eventType), [eventType]);
  const mergedEventTypeOptions = useMemo(() => {
    const merged = new Set(eventTypeOptions.map(toTitleCase));
    if (normalizedEventType) {
      merged.add(normalizedEventType);
    }
    return Array.from(merged);
  }, [eventTypeOptions, normalizedEventType]);

  const [step, setStep] = useState<Step>("details");
  const [selectedEventType, setSelectedEventType] = useState(normalizedEventType || "Wedding");
  const [selectedVenue, setSelectedVenue] = useState(venue || venueOptions[0] || "");
  const [eventDateFrom, setEventDateFrom] = useState("");
  const [eventDateTo, setEventDateTo] = useState("");
  const [expectedGuestCount, setExpectedGuestCount] = useState<string>("400");

  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [showWhyText, setShowWhyText] = useState(false);

  useEffect(() => {
    if (!open) {
      setStep("details");
      setShowWhyText(false);
      return;
    }
    setStep("details");
    setSelectedEventType(normalizedEventType || mergedEventTypeOptions[0] || "Wedding");
    setSelectedVenue(venue || venueOptions[0] || "");
  }, [open, normalizedEventType, venue, venueOptions, mergedEventTypeOptions]);

  const currentStep = step === "details" ? 1 : step === "personal" ? 2 : 3;

  const summaryPayload = {
    eventType: selectedEventType,
    venue: selectedVenue,
    eventDateFrom,
    eventDateTo,
    expectedGuestCount: expectedGuestCount ? Number(expectedGuestCount) : null,
    fullName,
    mobileNumber,
    emailAddress,
  };

  return (
    <AnimatePresence initial={false}>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[2147483646] bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClose}
          />

          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[2147483647] rounded-t-[24px] bg-[#F5F5F5] shadow-2xl"
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            exit={{ y: "105%" }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="max-h-[90vh] overflow-y-auto !px-6 !pt-6 !pb-8">
              <div className="!mb-5 flex items-center justify-between border-b border-black/10 !pb-4">
                <button
                  type="button"
                  onClick={() => {
                    if (step === "details") {
                      (onBack ?? onClose)();
                      return;
                    }
                    if (step === "personal") {
                      setStep("details");
                      return;
                    }
                    setStep("personal");
                  }}
                  className="font-area text-black text-2xl leading-none"
                  aria-label="Go back"
                >
                  ←
                </button>
                <h2 className="font-lust-medium text-[2em] leading-none text-black">Event Inquiry</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="font-area text-black text-2xl leading-none"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="!mb-6 flex !gap-2">
                <span className={`h-[4px] flex-1 rounded-full ${currentStep >= 1 ? "bg-[#C79A45]" : "bg-[#D8DADF]"}`} />
                <span className={`h-[4px] flex-1 rounded-full ${currentStep >= 2 ? "bg-[#C79A45]" : "bg-[#D8DADF]"}`} />
                <span className={`h-[4px] flex-1 rounded-full ${currentStep >= 3 ? "bg-[#C79A45]" : "bg-[#D8DADF]"}`} />
              </div>

              <AnimatePresence mode="wait">
                {step === "details" && (
                  <motion.div
                    key="details-step"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h3 className="font-lust-medium text-xl text-black">Event Details</h3>
                    <p className="font-area !mt-1 text-black/80 text-[.9em]">When are you planning your event?</p>

                    <div className="!mt-7 !space-y-5">
                      <div className="rounded-[1em] border border-[#D8C59F] bg-[#ECE8E2] !p-2">
                        <label className="font-area block text-black/70 text-[.9em]">Event Type</label>
                        <div className="relative !mt-2">
                          <select
                            className="font-area h-11 w-full appearance-none bg-transparent !pr-10 text-[1em] text-black outline-none"
                            value={selectedEventType}
                            onChange={(event) => setSelectedEventType(event.target.value)}
                          >
                            {mergedEventTypeOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/60">⌄</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 !gap-4">
                        <div>
                          <label className="font-area !mb-2 block text-black/85 text-[.9em]">Event Date from</label>
                          <input
                            type="date"
                            value={eventDateFrom}
                            onChange={(event) => setEventDateFrom(event.target.value)}
                            className="font-area text-[1em] h-14 w-full rounded-xl border border-black/15 bg-white !p-2 !pr-10 !pl-4 text-black outline-none [&::-webkit-calendar-picker-indicator]:!mr-1"
                          />
                        </div>
                        <div>
                          <label className="font-area !mb-2 block text-black/85 text-[.9em]">Event Date to</label>
                          <input
                            type="date"
                            value={eventDateTo}
                            onChange={(event) => setEventDateTo(event.target.value)}
                            className="font-area text-[1em] h-14 w-full rounded-xl border border-black/15 bg-white !p-2 !pr-10 !pl-4 text-black outline-none [&::-webkit-calendar-picker-indicator]:!mr-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-area !mb-2 block text-black/85 text-[.9em]">Expected Guest Count</label>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          value={expectedGuestCount}
                          onChange={(event) => setExpectedGuestCount(event.target.value)}
                          className="font-area text-[1em] h-14 w-full rounded-xl border border-black/15 bg-white !p-2 !pr-10 !pl-4 text-black outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-area !mb-2 block text-black/85 text-[.9em]">Venues</label>
                        <div className="relative">
                          <select
                            value={selectedVenue}
                            onChange={(event) => setSelectedVenue(event.target.value)}
                            className="font-area text-[1em] h-14 w-full appearance-none rounded-xl border border-black/15 bg-white !p-2 !pr-10 !pl-4 text-black outline-none"
                          >
                            {venueOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/60">⌄</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep("personal")}
                      className="font-lust-medium !mt-8 h-12 w-full rounded-full bg-[#6B3F2E] text-xl text-white"
                    >
                      Continue
                    </button>
                  </motion.div>
                )}

                {step === "personal" && (
                  <motion.div
                    key="personal-step"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h3 className="font-lust-medium text-xl text-black">Enter Your Details</h3>
                    <p className="font-area !mt-1 text-black/80 text-[.9em]">Fill your details for Proposal</p>

                    <div className="!mt-8 !space-y-5">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder="Full Name*"
                        className="text-[.9em] font-area h-14 w-full rounded-xl border border-black/15 bg-white !px-4 !py-3 text-black outline-none"
                      />
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={mobileNumber}
                        onChange={(event) => setMobileNumber(event.target.value)}
                        placeholder="Mobile Number*"
                        className="text-[.9em] font-area h-14 w-full rounded-xl border border-black/15 bg-white !px-4 !py-3 text-black outline-none"
                      />
                      <input
                        type="email"
                        value={emailAddress}
                        onChange={(event) => setEmailAddress(event.target.value)}
                        placeholder="Email Address"
                        className="text-[.9em] font-area h-14 w-full rounded-xl border border-black/15 bg-white !px-4 !py-3 text-black outline-none"
                      />
                    </div>

                    <div className="!mt-1 !space-y-3 text-center">
                      <button
                        type="button"
                        onClick={() => setShowWhyText((prev) => !prev)}
                        className="font-area !mt-6 text-[.8em] text-[#6B3F2E] underline"
                      >
                        Why do we need this?
                      </button>

                      {showWhyText && (
                        <p className="font-area !mt-2 text-[14px] text-black/70 max-w-md mx-auto">
                          Your information helps our team connect with you to craft a personalized event experience.
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep("confirmation")}
                      className="font-lust-medium !mt-8 h-12 w-full rounded-full bg-[#6B3F2E] text-xl text-white"
                    >
                      Submit
                    </button>
                  </motion.div>
                )}

                {step === "confirmation" && (
                  <motion.div
                    key="confirmation-step"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="rounded-full !mx-auto !mb-6 grid h-20 w-20 place-items-center bg-[#D7F2DF] text-5xl text-[#16984A]">
                      ✓
                    </div>
                    <h3 className="font-lust-medium text-center text-2xl text-black">Proposal Submitted!</h3>
                    <p className="font-area !mt-2 text-center text-black/70 text-[1em]">
                      Our Representative will get back to you shortly!
                    </p>

                    <div className="!mt-8 rounded-2xl bg-[#ECEDEF] !p-5">
                      <div className="font-area flex items-center justify-between !py-1 text-[1em]">
                        <span className="text-black/70">Event Type</span>
                        <span className="text-black">{summaryPayload.eventType || "-"}</span>
                      </div>
                      <div className="font-area flex items-center justify-between !py-1 text-[1em]">
                        <span className="text-black/70">Event Date from</span>
                        <span className="text-black">{summaryPayload.eventDateFrom || "-"}</span>
                      </div>
                      <div className="font-area flex items-center justify-between !py-1 text-[1em]">
                        <span className="text-black/70">Event Date to</span>
                        <span className="text-black">{summaryPayload.eventDateTo || "-"}</span>
                      </div>
                      <div className="font-area flex items-center justify-between !py-1 text-[1em]">
                        <span className="text-black/70">Guests</span>
                        <span className="text-black">{summaryPayload.expectedGuestCount ?? "-"}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDone?.(summaryPayload)}
                      className="font-lust-medium !mt-8 h-12 w-full rounded-full bg-[#6B3F2E] text-xl text-white"
                    >
                      Done
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
