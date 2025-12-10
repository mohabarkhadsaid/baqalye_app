import { createContext, useContext, useState, useEffect } from 'react';

const UtilityContext = createContext();

export function UtilityProvider({ children }) {
    // Mock Data or Local Storage
    const [bills, setBills] = useState(() => {
        const saved = localStorage.getItem("baqalye_bills");
        return saved ? JSON.parse(saved) : [];
    });

    const [payments, setPayments] = useState(() => {
        const saved = localStorage.getItem("baqalye_payments");
        const saved = localStorage.getItem("baqalye_payments");
        return saved ? JSON.parse(saved) : [];
    });

    const [waterRate, setWaterRate] = useState(() => {
        const saved = localStorage.getItem("baqalye_water_rate");
        return saved ? Number(saved) : 0.5;
    });

    useEffect(() => {
        localStorage.setItem("baqalye_bills", JSON.stringify(bills));
    }, [bills]);

    useEffect(() => {
        localStorage.setItem("baqalye_payments", JSON.stringify(payments));
    }, [payments]);

    useEffect(() => {
        localStorage.setItem("baqalye_water_rate", waterRate.toString());
    }, [waterRate]);

    const addReading = (data) => {
        // data: { customerId, customerName, currentReading, prevReading, date }
        const usage = data.currentReading - data.prevReading;
        const amount = usage * waterRate;

        // Create new bill
        const newBill = {
            id: Date.now(),
            customerId: data.customerId,
            customerName: data.customerName,
            period: new Date(data.date).toLocaleString('default', { month: 'short', year: 'numeric' }),
            prevReading: Number(data.prevReading),
            currentReading: Number(data.currentReading),
            usage,
            rate: waterRate,
            amount,
            status: "Unpaid",
            date: data.date
        };

        setBills(prev => [newBill, ...prev]);
        return newBill;
    };

    const recordPayment = (billId, paymentDetails) => {
        const bill = bills.find(b => b.id === billId);
        if (!bill) return;

        const newPayment = {
            id: Date.now(),
            billId,
            customerName: bill.customerName,
            amount: bill.amount, // Assuming full payment for simplicity
            method: paymentDetails.method,
            date: new Date().toISOString().split('T')[0]
        };

        setPayments(prev => [newPayment, ...prev]);

        // Update bill status
        setBills(prev => prev.map(b => b.id === billId ? { ...b, status: "Paid" } : b));
    };

    const getStats = () => {
        const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
        const outstanding = bills.filter(b => b.status === "Unpaid").reduce((sum, b) => sum + b.amount, 0);
        const totalUsage = bills.reduce((sum, b) => sum + b.usage, 0);

        return { totalRevenue, outstanding, totalUsage };
    };

    const updateRate = (newRate) => {
        setWaterRate(Number(newRate));
    };

    return (
        <UtilityContext.Provider value={{ bills, payments, waterRate, addReading, recordPayment, updateRate, getStats }}>
            {children}
        </UtilityContext.Provider>
    );
}

export function useUtility() {
    return useContext(UtilityContext);
}
