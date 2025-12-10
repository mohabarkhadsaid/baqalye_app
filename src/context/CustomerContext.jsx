import { createContext, useContext, useState } from 'react';

const CustomerContext = createContext();

export function CustomerProvider({ children }) {
    const [customers, setCustomers] = useState([
        { id: 1, name: "Ahmed Mohamed", phone: "+252 61 5000000", houseNumber: "N-101", neighborhood: "Waberi", status: "Active" },
        { id: 2, name: "Fatima Ali", phone: "+252 61 5000001", houseNumber: "N-102", neighborhood: "Hodan", status: "Active" },
        { id: 3, name: "Abdi Hassan", phone: "+252 61 5000002", houseNumber: "N-103", neighborhood: "Waberi", status: "Inactive" },
    ]);

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
