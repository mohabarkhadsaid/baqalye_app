import { useState } from "react";
import { Plus, Search, FileText, Printer } from "lucide-react";
import { useUtility } from "../context/UtilityContext";
import ReadingForm from "../components/billing/ReadingForm";
import ReceiptModal from "../components/billing/ReceiptModal";
import { Button, Input } from "../components/ui/Form";
import { cn } from "../lib/utils";

export default function BillingPage() {
    const { bills, recordPayment } = useUtility();
    const [selectedBill, setSelectedBill] = useState(null);
    const [isReadingFormOpen, setIsReadingFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredBills = bills.filter(b =>
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePay = (billId) => {
        if (confirm("Mark this bill as PAID via Cash?")) {
            recordPayment(billId, { method: "Cash" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Billing & Readings</h2>
                    <p className="text-slate-500">Generate bills and track status</p>
                </div>
                <Button onClick={() => setIsReadingFormOpen(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Reading
                </Button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Search bills..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-medium">Customer</th>
                            <th className="px-6 py-3 font-medium">Period</th>
                            <th className="px-6 py-3 font-medium">Usage</th>
                            <th className="px-6 py-3 font-medium">Amount</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredBills.map((bill) => (
                            <tr key={bill.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-medium text-slate-900">{bill.customerName}</td>
                                <td className="px-6 py-4 text-slate-600">{bill.period}</td>
                                <td className="px-6 py-4 text-slate-600">
                                    {bill.usage} units
                                    <div className="text-xs text-slate-400">{bill.prevReading} → {bill.currentReading}</div>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-900">${bill.amount.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2 py-1 rounded-full text-xs font-medium",
                                        bill.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                    )}>
                                        {bill.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {bill.status === "Unpaid" && (
                                        <Button size="sm" onClick={() => handlePay(bill.id)}>
                                            Mark Paid
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isReadingFormOpen && (
                <ReadingForm onClose={() => setIsReadingFormOpen(false)} />
            )}

            <ReceiptModal
                bill={selectedBill}
                onClose={() => setSelectedBill(null)}
            />
        </div>
    );
}
