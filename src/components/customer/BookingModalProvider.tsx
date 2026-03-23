"use client";

import type { ReactNode } from "react";
import { BookingModalProvider as Provider, useBookingModal } from "./BookingModalContext";
import { BookingModal } from "./BookingModal";

export { useBookingModal };
export type { SelectedService } from "./BookingModalContext";

export function BookingModalProvider({ children }: { children: ReactNode }) {
  return (
    <Provider>
      {children}
      <BookingModalInner />
    </Provider>
  );
}

function BookingModalInner() {
  const { isBookingModalOpen, closeBookingModal, selectedService } = useBookingModal();
  return (
    <BookingModal
      isOpen={isBookingModalOpen}
      onClose={closeBookingModal}
      selectedService={selectedService}
    />
  );
}
