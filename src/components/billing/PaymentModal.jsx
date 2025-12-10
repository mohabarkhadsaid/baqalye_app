import { useState } from 'react';
import { X, CreditCard, Banknote, Building2, Smartphone } from 'lucide-react';
import { Button } from '../ui/Form';
import { useUtility } from '../../context/UtilityContext';

export default function PaymentModal({ bill, onClose }) {
    const { recordPayment } = useUtility();
    const [loading, setLoading] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('Sahal');

    if (!bill) return null;

    const methods = [
        { id: 'Sahal', label: 'Sahal', icon: Smartphone, color: 'text-orange-600 bg-orange-50 ring-orange-200' },
        { id: 'E-Dahab', label: 'E-Dahab', icon: Smartphone, color: 'text-yellow-600 bg-yellow-50 ring-yellow-200' },
        { id: 'Bank', label: 'Bank Transfer', icon: Building2, color: 'text-blue-600 bg-blue-50 ring-blue-200' },
        { id: 'Cash', label: 'Cash', icon: Banknote, color: 'text-emerald-600 bg-emerald-50 ring-emerald-200' },
    ];

    const handlePayment = async () => {
        try {
            setLoading(true);
            await recordPayment(bill.id, { method: selectedMethod });
            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to record payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Record Payment</h2>
                        <p className="text-sm text-slate-500">Invoice #{bill.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="text-sm text-slate-500 mb-1">Total Amount Due</div>
                        <div className="text-3xl font-bold text-slate-900">${Number(bill.amount).toFixed(2)}</div>
                        <div className="text-sm text-slate-500 mt-1">Customer: {bill.customerName}</div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-900 block">Select Payment Method</label>
                        <div className="grid grid-cols-2 gap-3">
                            {methods.map((method) => {
                                const Icon = method.icon;
                                const isSelected = selectedMethod === method.id;
                                return (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${isSelected
                                                ? `border-blue-600 bg-blue-50/50 ${method.color.split(' ')[0]}`
                                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-full mb-2 ${method.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className={`text-sm font-medium ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                                            {method.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            onClick={handlePayment}
                            disabled={loading}
                            className="w-full h-12 text-base"
                        >
                            {loading ? 'Processing...' : `Confirm Payment ($${Number(bill.amount).toFixed(2)})`}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
