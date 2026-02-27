import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StartPlanEventModalProps {
     open: boolean;
     onClose: () => void;
     onSubmit: (eventType: string) => void;
}

export default function StartPlanEventModal({ open, onClose, onSubmit }: StartPlanEventModalProps) {
     const [selected, setSelected] = useState<string | null>(null);
     const [error, setError] = useState(false);

     useEffect(() => {
          if (!open) {
               return;
          }
          const prevOverflow = document.body.style.overflow;
          document.body.style.overflow = "hidden";
          return () => {
               document.body.style.overflow = prevOverflow;
          };
     }, [open]);

     const handleSubmit = () => {
          if (!selected) {
               setError(true);
               return;
          }
          setError(false);
          onSubmit(selected);
     };

     return (
          <AnimatePresence initial={false}>
               {open && (
                    <>
                         {/* Overlay */}
                     <motion.div
                               className="fixed inset-0 z-[2147483646] bg-black/45"
                               initial={{ opacity: 0 }}
                               animate={{ opacity: 1 }}
                               exit={{ opacity: 0 }}
                               transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
                               onClick={onClose}
                             />
                   
                             <motion.div
                               className="fixed bottom-0 left-0 right-0 z-[2147483647] rounded-t-[24px] bg-[#F5F5F5] shadow-2xl will-change-transform [transform:translate3d(0,0,0)] lg:left-1/2 lg:right-auto lg:w-1/2 lg:-translate-x-1/2"
                               initial={{ y: "105%" }}
                               animate={{ y: 0 }}
                               exit={{ y: "105%" }}
                               transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                             >
                              <div className="max-h-[90vh] overflow-y-auto !px-6 !pt-6 !pb-8">
                                   {/* Close */}
                                   <div className="flex justify-end !mb-4">
                                        <button
                                             onClick={onClose}
                                             className="!text-[var(--color-primary)] w-9 h-9 flex items-center justify-center rounded-md"
                                        >
                                             ✕
                                        </button>
                                   </div>

                                   {/* Heading */}
                                   <h2 className="font-lust-medium text-3xl font-semibold text-center !text-[var(--color-primary)] !mb-2">
                                        Your Dream Event Awaits
                                   </h2>

                                   <p className="font-area text-center !text-[var(--color-primary)] !mb-6">
                                   Grand venues, flawless execution, memories that last forever.
                                   </p>

                                   {/* Selectable Images */}
                                   <div className="grid grid-cols-2 gap-5 !mb-8">
                                        <div
                                             onClick={() => setSelected("wedding")}
                                             className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selected === "wedding"
                                                       ? "border-[#6B3F2E] shadow-[0_16px_36px_-14px_rgba(107,63,46,0.65)] scale-[1.04]"
                                                       : "border-transparent"
                                                  }`}
                                        >
                                             <img
                                                  src="/assets/herobackgrounds/wedding/wedding1.jpg"
                                                  alt="Wedding Event"
                                                  loading="eager"
                                                  decoding="async"
                                                  className="h-30 w-full object-cover"
                                             />
                                             <div className="font-area !py-3 text-center text-[.8em] !text-[var(--color-primary)] bg-white">
                                                  Wedding Event
                                             </div>
                                        </div>

                                        <div
                                             onClick={() => setSelected("corporate")}
                                             className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selected === "corporate"
                                                       ? "border-[#6B3F2E] shadow-[0_16px_36px_-14px_rgba(107,63,46,0.65)] scale-[1.04]"
                                                       : "border-transparent"
                                                  }`}
                                        >
                                             <img
                                                  src="/assets/herobackgrounds/corporate/corporate1.jpg"
                                                  alt="Corporate Event"
                                                  loading="eager"
                                                  decoding="async"
                                                  className="h-30 w-full object-cover"
                                             />
                                             <div className="font-area !py-3 text-center text-[.8em] !text-[var(--color-primary)] bg-white">
                                                  Corporate Event
                                             </div>
                                        </div>
                                   </div>

                                   {/* What's Included */}
                                   <h3 className="font-lust-medium text-xl font-semibold !text-[var(--color-primary)] !mb-2">
                                        What's Included
                                   </h3>

                                   <ul className="font-area space-y-3 !mb-8 !text-[var(--color-primary)] text-sm">
                                        <li className="flex items-start gap-2">
                                             <span className="text-[#6B3F2E] mt-1">▪</span>
                                             Grand Lawn for outdoor ceremonies
                                        </li>
                                        <li className="flex items-start gap-2">
                                             <span className="text-[#6B3F2E] mt-1">▪</span>
                                             Crystal Ballroom for elegant receptions
                                        </li>
                                        <li className="flex items-start gap-2">
                                             <span className="text-[#6B3F2E] mt-1">▪</span>
                                             Full-service planning & coordination
                                        </li>
                                   </ul>

                                   {/* Error */}
                                   {error && (
                                        <p className="text-red-500 text-sm text-center !mb-4">
                                             Please select an event type to continue.
                                        </p>
                                   )}

                                   {/* Button */}
                                   <button
                                        onClick={handleSubmit}
                                        className="w-full bg-[#6B3F2E] text-white !py-4 rounded-full text-lg font-medium transition hover:opacity-90"
                                   >
                                        Start Planning →
                                   </button>
                              </div>
                         </motion.div>
                    </>
               )}
          </AnimatePresence>
     );
}
