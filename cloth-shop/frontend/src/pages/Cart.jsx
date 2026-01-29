import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateCartItem } from '../redux/slices/cartSlice';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Gift, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const shippingCost = 100;
  const taxRate = 0.05;
  const subtotal = parseFloat(total) || 0;

  // Auto discount: ₹100 off when subtotal >= ₹1000
  const DISCOUNT_THRESHOLD = 1000;
  const DISCOUNT_AMOUNT = 100;
  const autoDiscount = subtotal >= DISCOUNT_THRESHOLD ? DISCOUNT_AMOUNT : 0;
  const amountToDiscount = DISCOUNT_THRESHOLD - subtotal;

  const taxAmount = subtotal * taxRate;
  const grandTotal = subtotal - autoDiscount + shippingCost + taxAmount;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      toast.error('Please login to view cart');
    }
  }, [isAuthenticated, navigate]);

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.success('Item removed from cart');
  };

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 1) {
      handleRemove(itemId);
      return;
    }
    dispatch(updateCartItem({ item_id: itemId, quantity }));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-20">
            <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cart is Empty</h1>
            <p className="text-gray-600 mb-6">Add items to your cart to get started</p>
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-36 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">{items.length} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Discount Progress Banner */}
            {subtotal > 0 && subtotal < DISCOUNT_THRESHOLD && (
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <Gift className="text-amber-600" size={24} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-800">
                      Add ₹{Math.round(amountToDiscount)} more to get ₹100 OFF!
                    </p>
                    <div className="mt-2 bg-amber-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((subtotal / DISCOUNT_THRESHOLD) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Discount Applied Banner */}
            {autoDiscount > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-green-600" size={24} />
                  <p className="text-sm font-semibold text-green-800">
                    🎉 ₹100 discount applied! You saved ₹{DISCOUNT_AMOUNT}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-6 border-b last:border-b-0 hover:bg-gray-50 transition"
                >
                  <img
                    src={item.product?.primary_image || '/placeholder.png'}
                    alt={item.product?.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.product?.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.product?.brand}
                    </p>
                    <p className="text-indigo-600 font-bold mt-2">
                      ₹{Math.round(parseFloat(item.total_price) / item.quantity) || 0}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 h-fit">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <p className="font-bold text-gray-900">
                      ₹{Math.round(parseFloat(item.total_price) || 0)}
                    </p>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-600 hover:text-red-800 mt-2 flex items-center gap-1 text-sm"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-40">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{Math.round(subtotal)}</span>
                </div>

                {/* Auto Discount Line */}
                {autoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Gift size={16} />
                      Auto Discount
                    </span>
                    <span className="font-semibold">-₹{autoDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">₹100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span className="font-semibold">₹{Math.round(taxAmount)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-indigo-600">
                  ₹{Math.round(grandTotal)}
                </span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate('/shop')}
                className="w-full mt-3 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}