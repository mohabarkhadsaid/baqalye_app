import { createContext, useContext, useState } from 'react';

const CustomerContext = createContext();

export function CustomerProvider({ children }) {
    const [customers, setCustomers] = useState(() => {
        const saved = localStorage.getItem("baqalye_customers");
        return saved ? JSON.parse(saved) : [];
    });

    // Persist customers
    useEffect(() => {
        localStorage.setItem("baqalye_customers", JSON.stringify(customers));
    }, [customers]);

    const addCustomer = (customer) => {
        setCustomers(prev => [...prev, { ...customer, id: Date.now() }]);
    };

    const updateCustomer = (id, updatedData) => {
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
    };

    const deleteCustomer = (id) => {
        setCustomers(prev => prev.filter(c => c.id !== id));
    };

    return (
        <CustomerContext.Provider value={{ customers, addCustomer, updateCustomer, deleteCustomer }}>
            {children}
        </CustomerContext.Provider>
    );
}

export function useCustomers() {
    return useContext(CustomerContext);
}
