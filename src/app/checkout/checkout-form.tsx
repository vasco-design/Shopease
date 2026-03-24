'use client';

import { useState } from 'react';
import { orderAPI, paymentAPI, type Order, type PaymentInitiation, type ApiResponse } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface OrderData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
}

interface PaymentFormData {
  cardNumber: string;
  cvv: string;
  expiry: string;
  paymentMethod: string;
}

export default function CheckoutPage() {
  const [step, setStep] = useState<'order' | 'payment' | 'confirmation'>('order');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const [orderData, setOrderData] = useState<OrderData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    address: '',
    items: [{ product_id: 'p1', quantity: 1 }],
  });

  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    cardNumber: '',
    cvv: '',
    expiry: '',
    paymentMethod: 'credit_card',
  });

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response: ApiResponse<Order> = await orderAPI.create(orderData);
      if (response.success && response.data) {
        setOrderId(response.data.id);
        // Initiate payment
        const paymentResponse: ApiResponse<PaymentInitiation> = await paymentAPI.initiate(
          response.data.id,
          response.data.total_amount,
          paymentData.paymentMethod
        );
        if (paymentResponse.success && paymentResponse.data) {
          setTransactionId(paymentResponse.data.transaction_id);
          setStep('payment');
        }
      }
    } catch (err) {
      setError('Failed to create order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response: ApiResponse<PaymentInitiation> = await paymentAPI.process(
        transactionId,
        paymentData.cardNumber,
        paymentData.cvv,
        paymentData.expiry,
        paymentData.paymentMethod
      );

      if (response.success && response.data) {
        // Update order with payment status
        await orderAPI.updateStatus(orderId, {
          payment_status: 'Completed',
          status: 'Processing',
        });
        setStep('confirmation');
      } else {
        setError(response.error || 'Payment failed. Please try again.');
      }
    } catch (err) {
      setError('Payment processing error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Order Form Step
  if (step === 'order') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <Card className="p-6">
          <form onSubmit={handleCreateOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input
                required
                value={orderData.customer_name}
                onChange={(e) =>
                  setOrderData({ ...orderData, customer_name: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                required
                type="email"
                value={orderData.customer_email}
                onChange={(e) =>
                  setOrderData({ ...orderData, customer_email: e.target.value })
                }
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input
                required
                value={orderData.customer_phone}
                onChange={(e) =>
                  setOrderData({ ...orderData, customer_phone: e.target.value })
                }
                placeholder="1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input
                required
                value={orderData.address}
                onChange={(e) =>
                  setOrderData({ ...orderData, address: e.target.value })
                }
                placeholder="123 Main St, City"
              />
            </div>

            {error && (
              <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                <AlertCircle size={20} />
                <p>{error}</p>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Processing...' : 'Continue to Payment'}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // Payment Form Step
  if (step === 'payment') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Payment</h1>

        <Card className="p-6">
          <form onSubmit={handleProcessPayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Card Number</label>
              <Input
                required
                value={paymentData.cardNumber}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    cardNumber: e.target.value,
                  })
                }
                placeholder="4111 1111 1111 1111"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Expiry</label>
                <Input
                  required
                  value={paymentData.expiry}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      expiry: e.target.value,
                    })
                  }
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CVV</label>
                <Input
                  required
                  type="password"
                  value={paymentData.cvv}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      cvv: e.target.value,
                    })
                  }
                  placeholder="123"
                />
              </div>
            </div>

            {error && (
              <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                <AlertCircle size={20} />
                <p>{error}</p>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Processing Payment...' : 'Complete Payment'}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // Confirmation Step
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-6 text-center space-y-6">
        <CheckCircle2 size={64} className="mx-auto text-green-500" />
        <h1 className="text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Your order has been successfully placed and payment processed.
        </p>
        <div className="bg-muted p-4 rounded">
          <p className="text-sm text-muted-foreground">Order ID</p>
          <p className="text-lg font-mono">{orderId}</p>
        </div>
        <Button className="w-full" onClick={() => (window.location.href = '/')}>
          Continue Shopping
        </Button>
      </Card>
    </div>
  );
}
