import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import {
    MapPin,
    Package,
    CreditCard,
    Check,
    ChevronRight,
    ChevronLeft,
    Plus,
    Truck,
    Shield,
    Lock,
    Banknote,
    AlertCircle,
    CheckCircle2,
    Home,
    Building2,
    Briefcase,
} from 'lucide-react';
import API from '../api/api';
import { ordersAPI } from '../api/orders';
import { paymentsAPI } from '../api/payments';
import { clearCart } from '../redux/slices/cartSlice';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Step indicator component
const StepIndicator = ({ currentStep, steps }) => {
    return (
        <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center">
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${index < currentStep
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                                : index === currentStep
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                        >
                            {index < currentStep ? (
                                <Check size={20} />
                            ) : (
                                <step.icon size={20} />
                            )}
                        </div>
                        <span
                            className={`mt-2 text-sm font-medium ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                                }`}
                        >
                            {step.label}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className={`w-24 h-1 mx-2 rounded-full transition-all duration-300 ${index < currentStep
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : 'bg-gray-200'
                                }`}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

// Address card component
const AddressCard = ({ address, selected, onSelect }) => {
    const getIcon = () => {
        switch (address.address_type) {
            case 'home':
                return <Home size={20} />;
            case 'office':
                return <Building2 size={20} />;
            case 'work':
                return <Briefcase size={20} />;
            default:
                return <MapPin size={20} />;
        }
    };

    return (
        <div
            onClick={() => onSelect(address)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${selected
                ? 'border-indigo-500 bg-indigo-50/50 shadow-lg shadow-indigo-500/10'
                : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                }`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`p-2 rounded-lg ${selected ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                >
                    {getIcon()}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{address.name}</h4>
                        {address.is_default && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                Default
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        {address.address_line1}
                        {address.address_line2 && `, ${address.address_line2}`}
                    </p>
                    <p className="text-sm text-gray-600">
                        {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{address.phone}</p>
                </div>
                <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'
                        }`}
                >
                    {selected && <Check size={14} className="text-white" />}
                </div>
            </div>
        </div>
    );
};

// Add Address Form
const AddAddressForm = ({ onAdd, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        pincode: '',
        address_type: 'home',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await API.post('/auth/addresses/', formData);
            toast.success('Address added successfully!');
            onAdd(response.data);
        } catch (error) {
            toast.error('Failed to add address');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 space-y-4">
            <h4 className="font-semibold text-gray-900 mb-4">Add New Address</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter full name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter phone number"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                <input
                    type="text"
                    required
                    value={formData.address_line1}
                    onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="House/Flat No., Building Name"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                <input
                    type="text"
                    value={formData.address_line2}
                    onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Street, Landmark"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="City"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="State"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input
                        type="text"
                        required
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Pincode"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                <div className="flex gap-3">
                    {['home', 'office', 'work'].map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, address_type: type })}
                            className={`px-4 py-2 rounded-lg capitalize transition-all ${formData.address_type === type
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Address'}
                </button>
            </div>
        </form>
    );
};

// Order Summary Component
const OrderSummary = ({ items, subtotal, shipping, tax, discount, total }) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Package size={20} />
                    Order Summary
                </h3>
            </div>

            <div className="p-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-3 py-3 border-b last:border-b-0">
                        <img
                            src={item.product?.primary_image || '/placeholder.png'}
                            alt={item.product?.name}
                            className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate text-sm">
                                {item.product?.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Qty: {item.quantity}
                            </p>
                            <p className="text-sm font-semibold text-indigo-600 mt-1">
                                ₹{Math.round(parseFloat(item.total_price) || 0)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-gray-50 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{Math.round(subtotal)}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span className="font-medium">-₹{Math.round(discount)}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">₹{Math.round(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="font-medium">₹{Math.round(tax)}</span>
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-indigo-600">₹{Math.round(total)}</span>
                </div>
            </div>

            {/* Trust badges */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                        <Shield size={14} className="text-green-600" />
                        <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Lock size={14} className="text-green-600" />
                        <span>Encrypted</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Truck size={14} className="text-green-600" />
                        <span>Fast Delivery</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Payment Form Component
const PaymentForm = ({ orderId, amount, onSuccess, paymentMethod }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [paymentIntentId, setPaymentIntentId] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (orderId && paymentMethod === 'card') {
            initializePayment();
        }
    }, [orderId, paymentMethod]);

    const initializePayment = async () => {
        try {
            setLoading(true);
            const response = await paymentsAPI.createPayment({
                order_id: orderId,
            });
            setClientSecret(response.data.client_secret);
            setPaymentIntentId(response.data.payment_intent_id);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to initialize payment');
            toast.error('Failed to initialize payment');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setError('');

        try {
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement),
                    },
                }
            );

            if (stripeError) {
                setError(stripeError.message);
                toast.error(stripeError.message);
                setLoading(false);
                return;
            }

            if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing') {
                await paymentsAPI.verifyStripe({ payment_intent_id: paymentIntentId });
                toast.success('Payment successful!');
                onSuccess();
            }
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#1f2937',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                '::placeholder': {
                    color: '#9ca3af',
                },
                iconColor: '#6366f1',
            },
            invalid: {
                color: '#ef4444',
                iconColor: '#ef4444',
            },
        },
        hidePostalCode: true,
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Card Details
                </label>
                <div className="bg-white p-4 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                    <CardElement options={cardElementOptions} />
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                    <AlertCircle size={18} />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {/* Test card info - only in development */}
            {import.meta.env.DEV && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800">
                        <strong>Test Mode:</strong> Use card <code className="bg-amber-100 px-1 rounded">4242 4242 4242 4242</code>, any future date, any CVC
                    </p>
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || !elements || loading || !clientSecret}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"
            >
                {loading ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        Processing...
                    </>
                ) : (
                    <>
                        <Lock size={20} />
                        Pay ₹{Math.round(amount)}
                    </>
                )}
            </button>
        </form>
    );
};

// Main Checkout Component
export default function Checkout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, total } = useSelector((state) => state.cart);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [currentStep, setCurrentStep] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [orderId, setOrderId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [orderCreated, setOrderCreated] = useState(false);

    // Calculate totals
    const subtotal = parseFloat(total) || 0;
    const DISCOUNT_THRESHOLD = 1000;
    const DISCOUNT_AMOUNT = 100;
    const discount = subtotal >= DISCOUNT_THRESHOLD ? DISCOUNT_AMOUNT : 0;
    const shipping = 100;
    const tax = subtotal * 0.05;
    const grandTotal = subtotal - discount + shipping + tax;

    const steps = [
        { id: 'address', label: 'Address', icon: MapPin },
        { id: 'review', label: 'Review', icon: Package },
        { id: 'payment', label: 'Payment', icon: CreditCard },
    ];

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            toast.error('Please login to checkout');
            return;
        }
        if (items.length === 0 && !orderCreated) {
            navigate('/cart');
            toast.error('Your cart is empty');
            return;
        }
        fetchAddresses();
    }, [isAuthenticated, navigate, items.length, orderCreated]);

    const fetchAddresses = async () => {
        try {
            const response = await API.get('/auth/addresses/');
            // Ensure we always get an array - handle both array and paginated response formats
            const addressList = Array.isArray(response.data)
                ? response.data
                : (response.data?.results || []);
            setAddresses(addressList);
            const defaultAddr = addressList.find((a) => a.is_default);
            if (defaultAddr) setSelectedAddress(defaultAddr);
        } catch (error) {
            console.error('Failed to load addresses:', error);
            setAddresses([]); // Ensure addresses is always an array on error
            toast.error('Failed to load addresses');
        }
    };

    const handleAddAddress = (newAddress) => {
        setAddresses([...addresses, newAddress]);
        setSelectedAddress(newAddress);
        setShowAddAddress(false);
    };

    const handleNextStep = async () => {
        if (currentStep === 0) {
            if (!selectedAddress) {
                toast.error('Please select a delivery address');
                return;
            }
            setCurrentStep(1);
        } else if (currentStep === 1) {
            // Create order before payment (only if not already created)
            if (!orderCreated) {
                await createOrder();
            } else {
                setCurrentStep(2);
            }
        }
    };

    const createOrder = async () => {
        setLoading(true);
        try {
            const response = await ordersAPI.createOrder({
                address_id: selectedAddress.id,
                payment_method: paymentMethod === 'card' ? 'credit_card' : paymentMethod,
            });
            setOrderId(response.data.order.id);
            setOrderCreated(true);
            setCurrentStep(2);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = () => {
        dispatch(clearCart());
        navigate(`/order-confirmation/${orderId}`);
    };

    const handleCODOrder = async () => {
        setLoading(true);
        try {
            // For COD, order is already created, but we should clear cart in store
            await dispatch(clearCart());
            toast.success('Order placed successfully!');
            navigate(`/order-confirmation/${orderId}`);
        } catch (error) {
            toast.error('Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 pt-24 pb-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Checkout</h1>
                    <p className="text-gray-600 mt-2">Complete your order securely</p>
                </div>

                {/* Step Indicator */}
                <StepIndicator currentStep={currentStep} steps={steps} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            {/* Step 1: Address Selection */}
                            {currentStep === 0 && (
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <MapPin className="text-indigo-600" />
                                        Select Delivery Address
                                    </h2>

                                    {!showAddAddress ? (
                                        <>
                                            <div className="space-y-4 mb-6">
                                                {addresses.length === 0 ? (
                                                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                                                        <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                                                        <p className="text-gray-500">No saved addresses</p>
                                                    </div>
                                                ) : (
                                                    addresses.map((address) => (
                                                        <AddressCard
                                                            key={address.id}
                                                            address={address}
                                                            selected={selectedAddress?.id === address.id}
                                                            onSelect={setSelectedAddress}
                                                        />
                                                    ))
                                                )}
                                            </div>

                                            <button
                                                onClick={() => setShowAddAddress(true)}
                                                className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition flex items-center justify-center gap-2"
                                            >
                                                <Plus size={20} />
                                                Add New Address
                                            </button>
                                        </>
                                    ) : (
                                        <AddAddressForm
                                            onAdd={handleAddAddress}
                                            onCancel={() => setShowAddAddress(false)}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Step 2: Review & Payment Method */}
                            {currentStep === 1 && (
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <Package className="text-indigo-600" />
                                        Review Your Order
                                    </h2>

                                    {/* Delivery Address Summary */}
                                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Delivery Address</h4>
                                                <p className="text-sm text-gray-600 mt-1">{selectedAddress?.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    {selectedAddress?.address_line1}, {selectedAddress?.city}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {selectedAddress?.state} - {selectedAddress?.pincode}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setCurrentStep(0)}
                                                className="text-indigo-600 text-sm font-semibold hover:underline"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </div>

                                    {/* Payment Method Selection */}
                                    <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
                                    <div className="space-y-3">
                                        <div
                                            onClick={() => setPaymentMethod('card')}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'card'
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-gray-200 hover:border-indigo-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`p-2 rounded-lg ${paymentMethod === 'card'
                                                        ? 'bg-indigo-500 text-white'
                                                        : 'bg-gray-100 text-gray-500'
                                                        }`}
                                                >
                                                    <CreditCard size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">Card Payment</h4>
                                                    <p className="text-sm text-gray-500">
                                                        Pay securely with Credit/Debit Card
                                                    </p>
                                                </div>
                                                <div
                                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card'
                                                        ? 'border-indigo-500 bg-indigo-500'
                                                        : 'border-gray-300'
                                                        }`}
                                                >
                                                    {paymentMethod === 'card' && <Check size={12} className="text-white" />}
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod'
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-gray-200 hover:border-indigo-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`p-2 rounded-lg ${paymentMethod === 'cod'
                                                        ? 'bg-indigo-500 text-white'
                                                        : 'bg-gray-100 text-gray-500'
                                                        }`}
                                                >
                                                    <Banknote size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">Cash on Delivery</h4>
                                                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                                                </div>
                                                <div
                                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod'
                                                        ? 'border-indigo-500 bg-indigo-500'
                                                        : 'border-gray-300'
                                                        }`}
                                                >
                                                    {paymentMethod === 'cod' && <Check size={12} className="text-white" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Payment */}
                            {currentStep === 2 && (
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <CreditCard className="text-indigo-600" />
                                        {paymentMethod === 'card' ? 'Complete Payment' : 'Confirm Order'}
                                    </h2>

                                    {/* Order Success Badge */}
                                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
                                        <CheckCircle2 className="text-green-600" size={24} />
                                        <div>
                                            <h4 className="font-semibold text-green-800">Order Created Successfully!</h4>
                                            <p className="text-sm text-green-700">Order ID: #{orderId}</p>
                                        </div>
                                    </div>

                                    {paymentMethod === 'card' ? (
                                        <Elements stripe={stripePromise}>
                                            <PaymentForm
                                                orderId={orderId}
                                                amount={grandTotal}
                                                onSuccess={handlePaymentSuccess}
                                                paymentMethod={paymentMethod}
                                            />
                                        </Elements>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                                <p className="text-amber-800">
                                                    <strong>Cash on Delivery:</strong> Pay ₹{Math.round(grandTotal)} when your
                                                    order arrives.
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleCODOrder}
                                                disabled={loading}
                                                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
                                            >
                                                {loading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check size={20} />
                                                        Place Order (₹{Math.round(grandTotal)})
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            {currentStep < 2 && (
                                <div className="p-6 bg-gray-50 border-t flex gap-4">
                                    {currentStep > 0 && (
                                        <button
                                            onClick={() => setCurrentStep(currentStep - 1)}
                                            className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition flex items-center justify-center gap-2"
                                        >
                                            <ChevronLeft size={20} />
                                            Back
                                        </button>
                                    )}
                                    <button
                                        onClick={handleNextStep}
                                        disabled={loading}
                                        className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                {currentStep === 1 ? 'Proceed to Payment' : 'Continue'}
                                                <ChevronRight size={20} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <OrderSummary
                                items={items}
                                subtotal={subtotal}
                                shipping={shipping}
                                tax={tax}
                                discount={discount}
                                total={grandTotal}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
