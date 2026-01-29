import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderConfirmation() {
  const { orderId } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-20">
      <div className="bg-white max-w-lg w-full p-8 rounded-2xl shadow-lg text-center">
        
        <CheckCircle className="mx-auto text-green-600" size={80} />
        
        <h1 className="text-3xl font-bold text-gray-900 mt-4">
          Order Confirmed!
        </h1>

        <p className="text-gray-700 mt-2">
          Your order has been successfully placed.
        </p>

        <p className="mt-4 text-lg font-semibold text-gray-800">
          Order ID: <span className="text-indigo-600">#{orderId}</span>
        </p>

        <div className="flex flex-col gap-4 mt-8">
          <Link
            to={`/orders`}
            className="bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            View My Orders
          </Link>

          <Link
            to="/"
            className="bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
