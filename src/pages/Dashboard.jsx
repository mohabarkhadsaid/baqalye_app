import { useUtility } from "../context/UtilityContext";
import { Users, Droplets, CreditCard, TrendingUp } from "lucide-react";
import { useCustomers } from "../context/CustomerContext";

export default function Dashboard() {
    const { customers } = useCustomers();
    const { getStats, loading } = useUtility();
    const { totalRevenue, outstanding, totalUsage } = getStats();

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading dashboard data...</div>;
    }

    const stats = [
        { name: "Total Customers", value: customers.length, icon: Users, color: "bg-blue-500" },
        { name: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: CreditCard, color: "bg-emerald-500" },
        { name: "Outstanding", value: `$${outstanding.toFixed(2)}`, icon: TrendingUp, color: "bg-amber-500" },
        { name: "Water Usage", value: `${totalUsage} m³`, icon: Droplets, color: "bg-cyan-500" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
                <p className="text-slate-500">Welcome to Baqalye Water Management System</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className={`${stat.color} p-3 rounded-lg text-white`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">{stat.name}</p>
                                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
