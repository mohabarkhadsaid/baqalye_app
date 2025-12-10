import { X, Printer } from "lucide-react";
import { Button } from "../ui/Form";
import { useRef } from "react";

export default function ReceiptModal({ bill, onClose }) {
    if (!bill) return null;
    const printRef = useRef();

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print:p-0 print:bg-white print:fixed print:inset-0">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden print:shadow-none print:w-full print:max-w-none">

                {/* Header (Hidden in Print) */}
                <div className="flex justify-between items-center p-4 border-b print:hidden">
                    <h3 className="font-semibold text-lg">Bill Receipt</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Receipt Content */}
                <div id="receipt-content" className="p-8 space-y-6 print:p-0" ref={printRef}>
                    <div className="text-center space-y-2 border-b-2 border-dashed border-slate-200 pb-6">
                        <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900">Baqalye Utilities</h1>
                        <p className="text-sm text-slate-500">Mogadishu, Somalia</p>
                        <p className="text-sm text-slate-500">+252 61 5000000</p>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Receipt No:</span>
                        <span className="font-mono font-medium">#{bill.id}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Date:</span>
                        <span className="font-medium">{new Date(bill.date).toLocaleDateString()}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Customer:</span>
                        <span className="font-medium">{bill.customerName}</span>
                    </div>

                    <div className="py-4 border-t border-b border-dashed border-slate-200 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Period</span>
                            <span className="font-medium">{bill.period}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Prev Reading</span>
                            <span className="font-mono">{bill.prevReading}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Cur Reading</span>
                            <span className="font-mono">{bill.currentReading}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Usage</span>
                            <span className="font-medium">{bill.usage} m³</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Rate</span>
                            <span className="font-medium">${bill.rate}/unit</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <span className="font-bold text-lg">TOTAL AMOUNT</span>
                        <span className="font-bold text-2xl">${bill.amount.toFixed(2)}</span>
                    </div>

                    <div className="text-center pt-8 text-xs text-slate-400">
                        <p>Thank you for your payment!</p>
                        <p>Power by Baqalye Systems</p>
                    </div>
                </div>

                {/* Footer Actions (Hidden in Print) */}
                <div className="p-4 bg-slate-50 flex justify-end gap-3 print:hidden">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button onClick={handlePrint} className="flex items-center gap-2">
                        <Printer className="w-4 h-4" /> Print Receipt
                    </Button>
                </div>
            </div>
        </div>
    );
}
