import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const CustomerContext = createContext();

export function CustomerProvider({ children }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCustomers(data || []);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const addCustomer = async (customer) => {
        try {
            // Remove id if present to let DB handle it, ensures proper auto-increment
            const { id, ...newCustomer } = customer;
            const { data, error } = await supabase
                .from('customers')
                .insert([{ ...newCustomer, status: 'Active' }])
                .select()
                .single();

            if (error) throw error;
            setCustomers(prev => [data, ...prev]);
            return data;
        } catch (error) {
            console.error('Error adding customer:', error);
            throw error;
        }
    };

    const updateCustomer = async (id, updatedData) => {
        try {
            const { data, error } = await supabase
                .from('customers')
                .update(updatedData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            setCustomers(prev => prev.map(c => c.id === id ? data : c));
        } catch (error) {
            console.error('Error updating customer:', error);
            throw error;
        }
    };

    const deleteCustomer = async (id) => {
        try {
            const { error } = await supabase
                .from('customers')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setCustomers(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error('Error deleting customer:', error);
            throw error;
        }
    };

    return (
        <CustomerContext.Provider value={{ customers, loading, addCustomer, updateCustomer, deleteCustomer }}>
            {children}
        </CustomerContext.Provider>
    );
}

export function useCustomers() {
    return useContext(CustomerContext);
}
