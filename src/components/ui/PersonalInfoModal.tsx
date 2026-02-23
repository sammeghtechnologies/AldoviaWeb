import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface PersonalInfoModalProps {
  open: boolean;
  onClose: () => void;
  onBack?: () => void;
  onSubmit?: (payload: {
    fullName: string;
    mobileNumber: string;
    emailAddress: string;
  }) => void;
  summaryData: {
    eventType: string;
    venue: string;
    eventDateFrom: string;
    eventDateTo: string;
    expectedGuestCount: number | null;
  };
  onDone?: () => void;
}

export default function PersonalInfoModal({
  open,
  onClose,
  onBack,
  onSubmit,
  summaryData,
  onDone,
}: PersonalInfoModalProps) {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [showWhyText, setShowWhyText] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setShowWhyText(false);
    }
  }, [open]);

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
                  onClick={onBack ?? onClose}
                  className="font-area text-black text-2xl leading-none"
                  aria-label="Go back"
                >
                  ←
                </button>
                <h2 className="font-lust-medium text-2xl text-black">Event Inquiry</h2>
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
                <span className="h-[4px] flex-1 rounded-full bg-[#C79A45]" />
                <span className="h-[4px] flex-1 rounded-full bg-[#C79A45]" />
                <span className={`h-[4px] flex-1 rounded-full ${submitted ? "bg-[#C79A45]" : "bg-[#D8DADF]"}`} />
              </div>

              {!submitted ? (
                <>
                  <h3 className="font-lust-medium text-4xl text-black">Enter Your Details</h3>
                  <p className="font-area !mt-1 text-black/80 text-[20px]">Fill your details for Proposal</p>

                  <div className="!mt-8 !space-y-5">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Full Name*"
                      className="font-area h-14 w-full rounded-xl border border-black/15 bg-white !px-4 !py-3 text-black outline-none"
                    />
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={mobileNumber}
                      onChange={(event) => setMobileNumber(event.target.value)}
                      placeholder="Mobile Number*"
                      className="font-area h-14 w-full rounded-xl border border-black/15 bg-white !px-4 !py-3 text-black outline-none"
                    />
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(event) => setEmailAddress(event.target.value)}
                      placeholder="Email Address"
                      className="font-area h-14 w-full rounded-xl border border-black/15 bg-white !px-4 !py-3 text-black outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowWhyText((prev) => !prev)}
                    className="font-area !mt-6 text-[16px] text-[#6B3F2E] underline"
                  >
                    Why do we need this?
                  </button>

                  {showWhyText && (
                    <p className="font-area !mt-2 text-[14px] text-black/70">
                      We collect information
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onSubmit?.({
                        fullName,
                        mobileNumber,
                        emailAddress,
                      });
                      setSubmitted(true);
                    }}
                    className="font-lust-medium !mt-8 h-14 w-full rounded-full bg-[#6B3F2E] text-xl text-white"
                  >
                    Submit
                  </button>
                </>
              ) : (
                <>
                  <div className="!mx-auto !mb-6 grid h-20 w-20 place-items-center bg-[#D7F2DF] text-5xl text-[#16984A]">
                    ✓
                  </div>
                  <h3 className="font-lust-medium text-center text-5xl text-black">Proposal Submitted!</h3>
                  <p className="font-area !mt-2 text-center text-black/70 text-[20px]">
                    Our Representative will get back to you shortly!
                  </p>

                  <div className="!mt-8 rounded-2xl bg-[#ECEDEF] !p-5">
                    <div className="font-area flex items-center justify-between !py-1 text-[22px]">
                      <span className="text-black/70">Event Type</span>
                      <span className="text-black">{summaryData.eventType || "-"}</span>
                    </div>
                    <div className="font-area flex items-center justify-between !py-1 text-[22px]">
                      <span className="text-black/70">Event Date from</span>
                      <span className="text-black">{summaryData.eventDateFrom || "-"}</span>
                    </div>
                    <div className="font-area flex items-center justify-between !py-1 text-[22px]">
                      <span className="text-black/70">Event Date to</span>
                      <span className="text-black">{summaryData.eventDateTo || "-"}</span>
                    </div>
                    <div className="font-area flex items-center justify-between !py-1 text-[22px]">
                      <span className="text-black/70">Guests</span>
                      <span className="text-black">{summaryData.expectedGuestCount ?? "-"}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDone?.()}
                    className="font-lust-medium !mt-8 h-14 w-full rounded-full bg-[#6B3F2E] text-2xl text-white"
                  >
                    Done
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
