import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { X } from "lucide-react";
import { useCustomers } from "../../context/CustomerContext";
import { Button, Input } from "../ui/Form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

export default function CustomerForm({ onClose, initialData }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: initialData || {
            name: "",
            phone: "",
            houseNumber: "",
            neighborhood: "",
            status: "Active"
        }
    });

    const { addCustomer, updateCustomer } = useCustomers();

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const onSubmit = (data) => {
        if (initialData) {
            updateCustomer(initialData.id, data);
        } else {
            addCustomer(data);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-md bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{initialData ? "Edit Customer" : "Add New Customer"}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <Input
                                {...register("name", { required: "Name is required" })}
                                placeholder="e.g. Ahmed Mohamed"
                            />
                            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone Number</label>
                            <Input
                                {...register("phone", { required: "Phone is required" })}
                                placeholder="e.g. +252 61..."
                            />
                            {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">House No.</label>
                                <Input
                                    {...register("houseNumber", { required: "Required" })}
                                    placeholder="N-101"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Neighborhood</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("neighborhood", { required: "Required" })}
                                >
                                    <option value="">Select...</option>
                                    <option value="Waberi">Waberi</option>
                                    <option value="Hodan">Hodan</option>
                                    <option value="Holwadag">Holwadag</option>
                                    <option value="Bondhere">Bondhere</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input type="radio" value="Active" {...register("status")} />
                                    <span className="text-sm">Active</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" value="Inactive" {...register("status")} />
                                    <span className="text-sm">Inactive</span>
                                </label>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit">save Customer</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
