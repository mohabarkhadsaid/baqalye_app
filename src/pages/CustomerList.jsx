import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash } from "lucide-react";
import { useCustomers } from "../context/CustomerContext";
import CustomerForm from "../components/customers/CustomerForm";
import { Button, Input } from "../components/ui/Form";
import { cn } from "../lib/utils";

export default function CustomerList() {
    const { customers, deleteCustomer } = useCustomers();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterNeighborhood, setFilterNeighborhood] = useState("All");

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.phone.includes(searchQuery) ||
            customer.houseNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterNeighborhood === "All" || customer.neighborhood === filterNeighborhood;
        return matchesSearch && matchesFilter;
    });

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setIsFormOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this customer?")) {
            deleteCustomer(id);
        }
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingCustomer(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Customers</h2>
                    <p className="text-slate-500">Manage your water utility customers</p>
                </div>
                <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Customer
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by name, phone, or house no..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filterNeighborhood}
                    onChange={(e) => setFilterNeighborhood(e.target.value)}
                >
                    <option value="All">All Neighborhoods</option>
                    <option value="Waberi">Waberi</option>
                    <option value="Hodan">Hodan</option>
                    <option value="Holwadag">Holwadag</option>
                    <option value="Bondhere">Bondhere</option>
                </select>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Name</th>
                                <th className="px-6 py-3 font-medium">Contact</th>
                                <th className="px-6 py-3 font-medium">Location</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{customer.name}</div>
                                            <div className="text-slate-500 text-xs">ID: #{customer.id}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{customer.phone}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-900">{customer.houseNumber}</div>
                                            <div className="text-slate-500 text-xs">{customer.neighborhood}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                                customer.status === "Active"
                                                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                                                    : "bg-slate-100 text-slate-700 ring-1 ring-slate-600/20"
                                            )}>
                                                {customer.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(customer)}>
                                                    <Edit className="w-4 h-4 text-blue-600" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(customer.id)}>
                                                    <Trash className="w-4 h-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No customers found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isFormOpen && (
                <CustomerForm
                    onClose={closeForm}
                    initialData={editingCustomer}
                />
            )}
        </div>
    );
}
