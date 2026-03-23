"use client";

import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
} from "react";

export interface SelectedService {
  id: string;
  serviceId?: string;
  name: string;
  category?: string;
  price: number;
  collectionMethod?: number;
  testServiceInfo?: { id: string; name?: string };
  testServiceInfor?: { id: string; name?: string };
}

interface BookingModalContextType {
  isBookingModalOpen: boolean;
  selectedService: SelectedService | null;
  openBookingModal: (service?: SelectedService) => void;
  closeBookingModal: () => void;
}

const BookingModalContext = createContext<BookingModalContextType | undefined>(
  undefined
);

export const useBookingModal = () => {
  const context = useContext(BookingModalContext);
  if (!context) {
    throw new Error(
      "useBookingModal must be used within a BookingModalProvider"
    );
  }
  return context;
};

interface BookingModalProviderProps {
  children: ReactNode;
}

export const BookingModalProvider: React.FC<BookingModalProviderProps> = ({
  children,
}) => {
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<SelectedService | null>(
    null
  );

  const openBookingModal = (service?: SelectedService) => {
    if (service) {
      setSelectedService(service);
    }
    setBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setBookingModalOpen(false);
    setSelectedService(null);
  };

  return (
    <BookingModalContext.Provider
      value={{
        isBookingModalOpen,
        selectedService,
        openBookingModal,
        closeBookingModal,
      }}
    >
      {children}
    </BookingModalContext.Provider>
  );
};
