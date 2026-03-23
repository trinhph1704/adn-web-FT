import AppRouter from './Router/AppRouter';
import { BrowserRouter } from 'react-router-dom';
import { BookingModalProvider } from './features/customer/components/BookingModalContext';
import { BookingModal } from './features/customer/components/BookingModal';
import { useBookingModal } from './features/customer/components/BookingModalContext';
import ChatbotAI from './features/chatbotAI/components/ChatbotAI';

function App() {
  return (
    <BrowserRouter>
      <BookingModalProvider>
        <MainContent />
      </BookingModalProvider>
    </BrowserRouter>
  );
}

function MainContent() {
  const { isBookingModalOpen, selectedService, closeBookingModal } = useBookingModal();

  return (
    <>
      <AppRouter />
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={closeBookingModal}
        selectedService={selectedService || undefined}
        onSubmit={() => {
          // Handle submission logic here
          // Don't close modal automatically - let user see success step and close manually
          console.log('Booking submitted successfully - showing success step');
        }}
      />
      <div className="fixed bottom-0 right-0 p-4 z-50">
        <ChatbotAI />
      </div>
    </>
  );
}

export default App;