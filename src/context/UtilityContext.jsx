import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const UtilityContext = createContext();

export function UtilityProvider({ children }) {
    const [bills, setBills] = useState([]);
    const [payments, setPayments] = useState([]);
    const [waterRate, setWaterRate] = useState(() => {
        const saved = localStorage.getItem("baqalye_water_rate");
        return saved ? Number(saved) : 0.5;
    }); // Default, maybe fetch from DB later
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUtilityData();
    }, []);

    useEffect(() => {
        localStorage.setItem("baqalye_water_rate", waterRate.toString());
    }, [waterRate]);

    const fetchUtilityData = async () => {
        try {
            const { data: billsData, error: billsError } = await supabase
                .from('bills')
                .select('*, customers (name)')
                .order('created_at', { ascending: false });

            if (billsError) throw billsError;

            // Flatten customer name for UI components
            const formattedBills = (billsData || []).map(bill => ({
                ...bill,
                customerName: bill.customers?.name || 'Unknown'
            }));

            setBills(formattedBills);

            const { data: paymentsData, error: paymentsError } = await supabase
                .from('payments')
                .select('*')
                .order('created_at', { ascending: false });

            if (paymentsError) throw paymentsError;
            setPayments(paymentsData || []);
        } catch (error) {
            console.error('Error fetching utility data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addReading = async (data) => {
        // data: { customerId, customerName, currentReading, prevReading, date }
        const usage = Number(data.currentReading) - Number(data.prevReading);
        const amount = usage * waterRate;

        // Create new bill object for DB
        const newBill = {
            customer_id: data.customerId,
            period: new Date(data.date).toLocaleString('default', { month: 'short', year: 'numeric' }),
            prev_reading: Number(data.prevReading),
            current_reading: Number(data.currentReading),
            usage,
            rate: waterRate,
            amount,
            status: "Unpaid",
            date: data.date
        };

        try {
            const { data: savedBill, error } = await supabase
                .from('bills')
                .insert([newBill])
                .select()
                .single();

            if (error) throw error;

            // Add customerName manually for UI since we didn't join yet, or rely on separate customer lookup
            // For now, let's just append it to local state to avoid full refetch
            const billWithMeta = { ...savedBill, customerName: data.customerName };
            setBills(prev => [billWithMeta, ...prev]);
            return billWithMeta;
        } catch (error) {
            console.error('Error creating bill:', error);
            throw error;
        }
    };

    const recordPayment = async (billId, paymentDetails) => {
        const bill = bills.find(b => b.id === billId);
        if (!bill) return;

        try {
            // 1. Create Payment
            const newPayment = {
                bill_id: billId,
                amount: bill.amount,
                method: paymentDetails.method,
                date: new Date().toISOString().split('T')[0]
            };

            const { data: savedPayment, error: paymentError } = await supabase
                .from('payments')
                .insert([newPayment])
                .select()
                .single();

            if (paymentError) throw paymentError;

            // 2. Update Bill Status
            const { error: billError } = await supabase
                .from('bills')
                .update({ status: 'Paid' })
                .eq('id', billId);

            if (billError) throw billError;

            setPayments(prev => [{ ...savedPayment, customerName: bill.customerName }, ...prev]);
            setBills(prev => prev.map(b => b.id === billId ? { ...b, status: "Paid" } : b));

        } catch (error) {
            console.error('Error recording payment:', error);
            throw error;
        }
    };

    const getStats = () => {
        const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const outstanding = bills.filter(b => b.status === "Unpaid").reduce((sum, b) => sum + Number(b.amount), 0);
        const totalUsage = bills.reduce((sum, b) => sum + Number(b.usage), 0);

        return { totalRevenue, outstanding, totalUsage };
    };

    const updateRate = (newRate) => {
        setWaterRate(Number(newRate));
        // TODO: Persist rate in DB settings table if desired
        localStorage.setItem("baqalye_water_rate", newRate.toString());
    };

    return (
        <UtilityContext.Provider value={{ bills, payments, waterRate, loading, addReading, recordPayment, updateRate, getStats }}>
            {children}
        </UtilityContext.Provider>
    );
}

export function useUtility() {
    return useContext(UtilityContext);
}
