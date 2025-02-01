import React, { createContext, useContext } from "react";
import { toast } from "react-toastify";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const showToast = (message, type = "success") => {
        if (type === "success") toast.success(message);
        else if (type === "error") toast.error(message);
        else toast.warning(message);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
