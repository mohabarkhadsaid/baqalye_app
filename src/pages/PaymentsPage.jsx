import { useUtility } from "../context/UtilityContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

export default function PaymentsPage() {
    const { payments } = useUtility();

    const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Payment History</h2>
                    <p className="text-slate-500">Track all received payments</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-blue-50 border-blue-100">
                    <CardHeader className="pb-2 border-blue-100">
                        <CardTitle className="text-blue-700 text-base">Total Collected</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-900">${totalCollected.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-medium">Date</th>
                            <th className="px-6 py-3 font-medium">Customer</th>
                            <th className="px-6 py-3 font-medium">Method</th>
                            <th className="px-6 py-3 font-medium text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {payments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 text-slate-600">{payment.date}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{payment.customerName}</td>
                                <td className="px-6 py-4 text-slate-600">{payment.method}</td>
                                <td className="px-6 py-4 text-right font-bold text-emerald-600">+${payment.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
