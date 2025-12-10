import { Link, Outlet, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Droplets,
    CreditCard,
    FileText,
    Settings,
    Menu,
    LogOut,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const NAVIGATION = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "Readings & Bills", path: "/billing", icon: Droplets },
    { name: "Payments", path: "/payments", icon: CreditCard },
    { name: "Reports", path: "/reports", icon: FileText },
    { name: "Settings", path: "/settings", icon: Settings },
];

export default function MainLayout() {
    const { pathname } = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { logout } = useAuth();

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-30 bg-slate-900 text-white transition-all duration-300 flex flex-col lg:relative",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                <div className={cn("flex h-16 items-center border-b border-slate-800", isCollapsed ? "justify-center" : "justify-between px-4")}>
                    {!isCollapsed && (
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent truncate">
                            Baqalye
                        </h1>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                    {/* Mobile Close Button (Optional, clicking overlay works too) */}
                </div>

                <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                    {NAVIGATION.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                title={isCollapsed ? item.name : undefined}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800",
                                    isCollapsed && "justify-center px-2"
                                )}
                            >
                                <Icon className="w-5 h-5 min-w-[20px]" />
                                {!isCollapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-2 border-t border-slate-800">
                    <button
                        onClick={logout}
                        title={isCollapsed ? "Sign Out" : undefined}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors",
                            isCollapsed && "justify-center px-2"
                        )}
                    >
                        <LogOut className="w-5 h-5 min-w-[20px]" />
                        {!isCollapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden w-0">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
                    <button
                        className="p-2 -ml-2 text-slate-600 lg:hidden"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
