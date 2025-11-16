import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

interface ReceiptProps {
  orderId: string;
  customerName: string;
  deliveryAddress: string;
  phoneNumber: string;
  items: Array<{
    id: number;
    productId: number;
    quantity: number;
    price: number;
    name: string;
    image: string;
  }>;
  totalPrice: number;
  orderDate: string;
  deliveryDate: string;
}

const Receipt: React.FC<ReceiptProps> = ({
  orderId,
  customerName,
  deliveryAddress,
  phoneNumber,
  items,
  totalPrice,
  orderDate,
  deliveryDate,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;

    try {
      // Show loading state
      const loadingToast = toast.loading('Generating receipt...');
      
      // Force a small delay to ensure the DOM is ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set a fixed width for the receipt
      const receiptElement = receiptRef.current;
      const originalWidth = receiptElement.style.width;
      receiptElement.style.width = '400px';
      
      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
        scrollY: -window.scrollY,
        onclone: (clonedDoc) => {
          const element = clonedDoc.getElementById('receipt-content');
          if (element) {
            element.style.visibility = 'visible';
          }
        }
      });
      
      // Restore original width
      receiptElement.style.width = originalWidth;
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [canvas.width * 0.264583, canvas.height * 0.264583], // Convert pixels to mm
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), 0, undefined, 'FAST');
      
      // Save the PDF
      pdf.save(`VastraVerse_Receipt_${orderId}.pdf`);
      
      // Update toast to success
      toast.success('Receipt downloaded successfully!', { id: loadingToast });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate receipt. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={handleDownloadReceipt}
        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span>Download Receipt</span>
      </button>

      {/* Receipt for PDF generation - initially hidden but in the DOM */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div 
          id="receipt-content"
          ref={receiptRef} 
          className="bg-white p-8 max-w-md mx-auto"
          style={{ visibility: 'hidden' }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">VastraVerse</h1>
            <p className="text-gray-600">Your Fashion Destination</p>
            <p className="text-sm text-gray-500 mt-1">Order Receipt</p>
          </div>

          {/* Order Info */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Order ID:</span>
              <span>{orderId}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Order Date:</span>
              <span>{orderDate}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Expected Delivery:</span>
              <span>{deliveryDate}</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold text-gray-900 mb-2">Customer Details</h2>
            <p className="text-gray-800">{customerName}</p>
            <p className="text-gray-600">{deliveryAddress}</p>
            <p className="text-gray-600">Phone: {phoneNumber}</p>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start border-b pb-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
              <span>Total:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
            <p>Thank you for shopping with VastraVerse!</p>
            <p className="mt-1">For any queries, contact us at support@vastraverse.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
