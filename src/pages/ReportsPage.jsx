import { useUtility } from "../context/UtilityContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { BarChart3, TrendingUp, AlertCircle, Download, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Button, Input } from "../components/ui/Form";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useState } from "react";

export default function ReportsPage() {
    const { bills, payments } = useUtility();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Filter Data
    const filteredPayments = payments.filter(p => {
        if (!startDate && !endDate) return true;
        const pDate = new Date(p.date);
        const start = startDate ? new Date(startDate) : new Date('1970-01-01');
        const end = endDate ? new Date(endDate) : new Date();
        return pDate >= start && pDate <= end;
    });

    const filteredBills = bills.filter(b => {
        if (!startDate && !endDate) return true;
        const bDate = new Date(b.date);
        const start = startDate ? new Date(startDate) : new Date('1970-01-01');
        const end = endDate ? new Date(endDate) : new Date();
        return bDate >= start && bDate <= end;
    });

    // Calculate Stats based on filter
    const totalRevenue = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const outstanding = filteredBills.filter(b => b.status === "Unpaid").reduce((sum, b) => sum + b.amount, 0);
    const totalUsage = filteredBills.reduce((sum, b) => sum + b.usage, 0);

    const neighborhoodData = [
        { name: "Waberi", users: 15, revenue: 450 },
        { name: "Hodan", users: 12, revenue: 380 },
        { name: "Holwadag", users: 8, revenue: 210 },
        { name: "Bondhere", users: 5, revenue: 120 },
    ];

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Baqalye Water Management - Report", 14, 20);

        let dateRangeText = "All Time";
        if (startDate || endDate) {
            dateRangeText = `${startDate || 'Start'} to ${endDate || 'Now'}`;
        }
        doc.setFontSize(10);
        doc.text(`Period: ${dateRangeText}`, 14, 26);

        // Summary
        doc.setFontSize(12);
        doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 14, 35);
        doc.text(`Outstanding: $${outstanding.toFixed(2)}`, 14, 41);
        doc.text(`Total Usage: ${totalUsage} units`, 14, 47);

        // Table
        autoTable(doc, {
            startY: 55,
            head: [['Neighborhood', 'Active Users', 'Revenue Est.']],
            body: neighborhoodData.map(n => [n.name, n.users, `$${n.revenue}`]),
        });

        doc.save('baqalye_report.pdf');
    };

    const exportExcel = () => {
        const wb = XLSX.utils.book_new();

        let dateRangeText = "All Time";
        if (startDate || endDate) {
            dateRangeText = `${startDate || 'Start'} to ${endDate || 'Now'}`;
        }

        // Summary Sheet
        const summaryData = [
            ["Report Period", dateRangeText],
            ["Metric", "Value"],
            ["Total Revenue", totalRevenue],
            ["Outstanding", outstanding],
            ["Total Usage", totalUsage],
        ];
        const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

        // Neighborhood Sheet
        const wsNeighborhood = XLSX.utils.json_to_sheet(neighborhoodData);
        XLSX.utils.book_append_sheet(wb, wsNeighborhood, "Neighborhoods");

        XLSX.writeFile(wb, "baqalye_report.xlsx");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Financial Reports</h2>
                    <p className="text-slate-500">Overview of performance and usage</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex items-center gap-2">
                        <div className="grid gap-1">
                            <label className="text-xs font-medium text-slate-500">From</label>
                            <Input
                                type="date"
                                className="h-8 w-36"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-1">
                            <label className="text-xs font-medium text-slate-500">To</label>
                            <Input
                                type="date"
                                className="h-8 w-36"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={exportExcel} className="flex items-center gap-2 h-8">
                            <Download className="w-4 h-4" /> Excel
                        </Button>
                        <Button size="sm" onClick={exportPDF} className="flex items-center gap-2 h-8">
                            <Download className="w-4 h-4" /> PDF
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-slate-500">All time collected</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Outstanding</CardTitle>
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${outstanding.toFixed(2)}</div>
                        <p className="text-xs text-slate-500">Pending payments</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Usage</CardTitle>
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsage} units</div>
                        <p className="text-xs text-slate-500">Water consumption</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue by Neighborhood</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={neighborhoodData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} prefix="$" />
                                <Tooltip
                                    formatter={(value) => [`$${value}`, "Revenue"]}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Neighborhood Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Neighborhood</th>
                                    <th className="px-6 py-3 font-medium">Active Users</th>
                                    <th className="px-6 py-3 font-medium text-right">Revenue Est.</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {neighborhoodData.map((n) => (
                                    <tr key={n.name}>
                                        <td className="px-6 py-4 font-medium">{n.name}</td>
                                        <td className="px-6 py-4">{n.users}</td>
                                        <td className="px-6 py-4 text-right">${n.revenue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
