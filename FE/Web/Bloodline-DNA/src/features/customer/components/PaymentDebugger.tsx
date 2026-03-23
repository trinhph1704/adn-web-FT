import React, { useState, useEffect } from 'react';
import { paymentLogger } from '../utils/paymentLogger';

interface PaymentDebuggerProps {
  bookingId?: string;
  isVisible?: boolean;
}

export const PaymentDebugger: React.FC<PaymentDebuggerProps> = ({ 
  bookingId, 
  isVisible = false 
}) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(isVisible);

  useEffect(() => {
    const updateLogs = () => {
      const allLogs = paymentLogger.getAllLogs();
      const filteredLogs = bookingId 
        ? paymentLogger.getLogsByBookingId(bookingId)
        : allLogs;
      setLogs(filteredLogs);
    };

    updateLogs();
    
    // Update logs every 2 seconds
    const interval = setInterval(updateLogs, 2000);
    
    return () => clearInterval(interval);
  }, [bookingId]);

  const exportLogs = () => {
    const logsJson = paymentLogger.exportLogs();
    const blob = new Blob([logsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-logs-${bookingId || 'all'}-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    paymentLogger.clearLogs();
    setLogs([]);
  };

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'PAYMENT_START': return 'bg-blue-100 text-blue-800';
      case 'PAYMENT_API_CALL': return 'bg-yellow-100 text-yellow-800';
      case 'PAYMENT_API_RESPONSE': return 'bg-green-100 text-green-800';
      case 'PAYMENT_REDIRECT': return 'bg-purple-100 text-purple-800';
      case 'PAYMENT_RETURN': return 'bg-indigo-100 text-indigo-800';
      case 'PAYMENT_CALLBACK': return 'bg-cyan-100 text-cyan-800';
      case 'PAYMENT_SUCCESS': return 'bg-green-200 text-green-900';
      case 'PAYMENT_ERROR': return 'bg-red-100 text-red-800';
      case 'PAYMENT_CANCEL': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 text-sm"
        >
          🔍 Payment Debug
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 w-96 max-h-96 bg-white border border-gray-300 rounded-lg shadow-xl z-50 overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
        <h3 className="font-semibold text-sm">Payment Debug Logs</h3>
        <div className="flex gap-2">
          <button
            onClick={exportLogs}
            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
          >
            Export
          </button>
          <button
            onClick={clearLogs}
            className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
          >
            Clear
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="p-2 text-xs">
        <div className="mb-2 text-gray-600">
          Total logs: {logs.length} {bookingId && `(Booking: ${bookingId})`}
        </div>
        
        <div className="max-h-80 overflow-y-auto space-y-2">
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center py-4">No payment logs yet</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="border border-gray-200 rounded p-2">
                <div className="flex justify-between items-center mb-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getLogTypeColor(log.type)}`}>
                    {log.type}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="text-xs text-gray-700">
                  {log.data.bookingId && (
                    <div><strong>Booking:</strong> {log.data.bookingId}</div>
                  )}
                  {log.data.orderCode && (
                    <div><strong>Order:</strong> {log.data.orderCode}</div>
                  )}
                  {log.data.paymentUrl && (
                    <div><strong>URL:</strong> 
                      <a 
                        href={log.data.paymentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline ml-1"
                      >
                        {log.data.paymentUrl.substring(0, 50)}...
                      </a>
                    </div>
                  )}
                  {log.data.status && (
                    <div><strong>Status:</strong> {log.data.status}</div>
                  )}
                  {log.data.error && (
                    <div className="text-red-600"><strong>Error:</strong> {log.data.error}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};