import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Customer } from "@/types/customer.types";
import { sendCustomerOtp, verifyCustomerOtp, logoutCustomerApi } from "@/api/customerAuthApi";
import { getCustomerProfile } from "@/api/customerPortalApi";

interface CustomerAuthContextType {
  customer: Customer | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otpCode: string, name?: string) => Promise<void>;
  logout: () => void;
  setCustomer: (customer: Customer) => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const [customer, setCustomerState] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("customer_token");
    const savedUser = localStorage.getItem("customer_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setCustomerState(JSON.parse(savedUser));
      } catch (e) {
        // Ignore parse error
      }

      getCustomerProfile()
        .then((latestCustomer) => {
          setCustomerState(latestCustomer);
          localStorage.setItem("customer_user", JSON.stringify(latestCustomer));
        })
        .catch(() => {
          localStorage.removeItem("customer_token");
          localStorage.removeItem("customer_user");
          setToken(null);
          setCustomerState(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const notifyCustomerStatusChange = (type: "CUSTOMER_LOGIN" | "CUSTOMER_LOGOUT") => {
    try {
      if (typeof BroadcastChannel !== "undefined") {
        const channel = new BroadcastChannel("customer_status_channel");
        channel.postMessage({ type, timestamp: Date.now() });
        channel.close();
      }
    } catch {
      // Ignore broadcast errors
    }
    window.dispatchEvent(new CustomEvent("customer_status_change", { detail: type }));
  };

  const sendOtp = async (email: string) => {
    await sendCustomerOtp(email);
  };

  const verifyOtp = async (email: string, otpCode: string, name?: string) => {
    const res = await verifyCustomerOtp(email, otpCode, name);
    if (res.data) {
      const newToken = res.data.token;
      const newCustomer = res.data.customer;
      localStorage.setItem("customer_token", newToken);
      localStorage.setItem("customer_user", JSON.stringify(newCustomer));
      setToken(newToken);
      setCustomerState(newCustomer);

      notifyCustomerStatusChange("CUSTOMER_LOGIN");

      const displayName = newCustomer.name || newCustomer.email.split("@")[0];
      toast.success(t("customer.welcomeBack", { name: displayName, defaultValue: `Welcome back, ${displayName}!` }));
    }
  };

  const logout = async () => {
    if (customer?.email) {
      await logoutCustomerApi(customer.email);
    }
    notifyCustomerStatusChange("CUSTOMER_LOGOUT");
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_user");
    setToken(null);
    setCustomerState(null);
    toast.success(t("customer.loggedOut", "Logged out successfully"));
  };

  const setCustomer = (updatedCustomer: Customer) => {
    setCustomerState(updatedCustomer);
    localStorage.setItem("customer_user", JSON.stringify(updatedCustomer));
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        token,
        isAuthenticated: !!token && !!customer,
        isLoading,
        sendOtp,
        verifyOtp,
        logout,
        setCustomer,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = (): CustomerAuthContextType => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
};
