import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useUtility } from "../../context/UtilityContext";
import { useCustomers } from "../../context/CustomerContext";
import { Button, Input } from "../ui/Form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { useState } from "react";

export default function ReadingForm({ onClose }) {
    const { customers } = useCustomers();
    const { addReading } = useUtility();
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

    // Watch current reading to calc usage live
    const currentReading = watch("currentReading");
    const prevReading = watch("prevReading"); // For now manual, ideally fetched from last bill

    const onCustomerChange = (e) => {
        const customer = customers.find(c => c.id == e.target.value);
        setSelectedCustomer(customer);
        // In a real app, we'd fetch the last reading here. Mocking 0 or random for now.
        setValue("prevReading", 0);
    };

    const onSubmit = (data) => {
        addReading({
            customerId: selectedCustomer.id,
            customerName: selectedCustomer.name,
            currentReading: data.currentReading,
            prevReading: data.prevReading,
            date: new Date().toISOString().split('T')[0]
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-md bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Record Meter Reading</CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Customer</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                {...register("customerId", { required: true })}
                                onChange={onCustomerChange}
                            >
                                <option value="">Select Customer...</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.houseNumber})</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Previous Reading</label>
                                <Input
                                    type="number"
                                    {...register("prevReading", { required: true })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Current Reading</label>
                                <Input
                                    type="number"
                                    {...register("currentReading", { required: true })}
                                />
                            </div>
                        </div>

                        {currentReading && prevReading && (
                            <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                                <div className="flex justify-between">
                                    <span>Usage:</span>
                                    <span className="font-bold">{currentReading - prevReading} units</span>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span>Estimated Bill:</span>
                                    <span className="font-bold">${((currentReading - prevReading) * 0.5).toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit">Generate Bill</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
