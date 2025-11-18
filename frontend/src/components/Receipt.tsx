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

  const formatPrice = (price: number | undefined | null) => {
    const validPrice = Number(price) || 0;
    if (isNaN(validPrice) || validPrice <= 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(validPrice);
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
        width: 400,
        height: receiptElement.scrollHeight,
        onclone: (clonedDoc) => {
          const element = clonedDoc.getElementById('receipt-content');
          if (element) {
            element.style.visibility = 'visible';
            element.style.opacity = '1';
            element.style.color = '#000000';
            element.style.backgroundColor = '#ffffff';
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
    <div className="space-y-6 animate-slide-up">
      {/* Receipt Preview */}
      <div className="bg-gradient-to-br from-white to-sandBeige/20 rounded-luxury-lg shadow-luxury p-6 border-2 border-gold/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="h-1 w-12 bg-gradient-to-r from-gold to-royalBrown rounded-full"></div>
            <h3 className="text-2xl font-heading font-bold text-royalBrown">Order Receipt</h3>
          </div>
          <button
            onClick={handleDownloadReceipt}
            className="btn-primary py-2 px-5 text-sm flex items-center space-x-2 group relative overflow-hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 relative z-10"
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
            <span className="relative z-10">Download PDF</span>
            <div className="absolute inset-0 bg-gradient-to-r from-chocolate to-royalBrown opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
        
        {/* Receipt Preview Content */}
        <div className="space-y-4 bg-white/50 rounded-luxury p-5">
          <div className="flex justify-between items-center pb-3 border-b border-gold/20">
            <span className="text-chocolate font-medium">Order ID:</span>
            <span className="font-heading font-bold text-royalBrown text-lg">{orderId}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gold/20">
            <span className="text-chocolate font-medium">Customer:</span>
            <span className="font-heading font-semibold text-royalBrown">{customerName || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gold/20">
            <span className="text-chocolate font-medium">Phone:</span>
            <span className="text-royalBrown font-medium">{phoneNumber || 'N/A'}</span>
          </div>
          <div className="pb-3 border-b border-gold/20">
            <span className="text-chocolate font-medium block mb-2">Address:</span>
            <span className="text-royalBrown">{deliveryAddress || 'N/A'}</span>
          </div>
          <div className="pt-3">
            <h4 className="font-heading font-bold text-royalBrown mb-3 text-lg">Order Items:</h4>
            <div className="space-y-3">
              {items && items.length > 0 ? (
                items.map((item, index) => {
                  const itemId = item.id || item.productId || index;
                  const itemQuantity = item.quantity || 1;
                  const itemPrice = item.price || 0;
                  const itemName = item.name || 'Product';
                  
                  const itemTotal = (Number(itemPrice) || 0) * (Number(itemQuantity) || 1);
                  
                  return (
                    <div key={itemId} className="p-3 bg-sandBeige/30 rounded-luxury hover:bg-sandBeige/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <span className="font-medium text-royalBrown block mb-1">{itemName}</span>
                          <div className="flex items-center space-x-3 text-sm text-chocolate">
                            <span>Qty: <span className="font-semibold text-royalBrown">{itemQuantity}</span></span>
                            <span>×</span>
                            <span>Price: <span className="font-semibold text-royalBrown">{formatPrice(Number(itemPrice) || 0)}</span></span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gold/20">
                        <span className="text-sm text-chocolate font-medium">Item Amount:</span>
                        <span className="font-bold text-gold text-lg">{formatPrice(itemTotal)}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-chocolate text-sm">No items</p>
              )}
            </div>
          </div>
          <div className="pt-4 border-t-2 border-gold/30 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-heading font-bold text-royalBrown">Total Amount:</span>
              <span className="text-3xl font-bold text-gold">{formatPrice(totalPrice || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt for PDF generation - hidden visually but accessible to html2canvas */}
      <div style={{ position: 'absolute', left: '-9999px', width: '400px' }}>
        <div 
          id="receipt-content"
          ref={receiptRef} 
          className="bg-white p-8 max-w-md mx-auto relative"
          style={{ 
            visibility: 'visible',
            opacity: 1,
            color: '#000000',
            backgroundColor: '#ffffff'
          }}
        >
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <img 
              src="/VastraVerse.png" 
              alt="VastraVerse Watermark" 
              className="h-64 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>

          {/* Header */}
          <div className="relative z-10">
            <div className="flex flex-col items-center mb-6">
              <img 
                src="/VastraVerse.png" 
                alt="VastraVerse Logo" 
                className="h-16 mb-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <h1 className="text-2xl font-bold text-gray-900">VastraVerse</h1>
              <p className="text-gray-600">Your Fashion Destination</p>
              <p className="text-sm text-gray-500 mt-1">Order Receipt</p>
            </div>

            {/* Order Info */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Order ID:</span>
                <span className="font-semibold">{orderId}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Customer:</span>
                <span className="font-medium">{customerName}</span>
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
              <h2 className="font-semibold text-gray-900 mb-2">Delivery Address</h2>
              <p className="text-gray-800">{customerName}</p>
              <p className="text-gray-600">{deliveryAddress}</p>
              <p className="text-gray-600">Phone: {phoneNumber}</p>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h2 className="font-semibold text-gray-900 mb-3">Order Summary</h2>
              <div className="space-y-4">
                {items && items.length > 0 ? (
                  items.map((item, index) => {
                    const itemId = item.id || item.productId || index;
                    const itemQuantity = item.quantity || 1;
                    const itemPrice = item.price || 0;
                    const itemName = item.name || 'Product';
                    
                    const itemTotal = (Number(itemPrice) || 0) * (Number(itemQuantity) || 1);
                    
                    return (
                      <div key={itemId} className="border-b pb-3 mb-3">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-medium text-gray-900 flex-1">{itemName}</p>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                          <div className="flex items-center space-x-3">
                            <span>Quantity: <span className="font-semibold text-gray-900">{itemQuantity}</span></span>
                            <span>×</span>
                            <span>Unit Price: <span className="font-semibold text-gray-900">{formatPrice(Number(itemPrice) || 0)}</span></span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                          <span className="text-sm font-medium text-gray-700">Item Amount:</span>
                          <p className="font-bold text-gray-900">
                            {formatPrice(itemTotal)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-600">No items in order</p>
                )}
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2 text-gray-900">
                <span>Subtotal ({items ? items.reduce((acc, item) => acc + (item.quantity || 1), 0) : 0} items):</span>
                <span className="font-medium">{formatPrice(totalPrice || 0)}</span>
              </div>
              <div className="flex justify-between mb-2 text-gray-900">
                <span>Shipping:</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2 text-gray-900">
                <span>Total Amount:</span>
                <span>{formatPrice(totalPrice || 0)}</span>
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
    </div>
  );
};

export default Receipt;
