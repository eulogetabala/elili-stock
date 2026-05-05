"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type SubscriptionPlan = "free" | "premium" | "elite";
export type BillingCycle = "monthly" | "yearly";

export interface Subscription {
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  stripeSubscriptionId?: string;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  setSubscription: (subscription: Subscription | null) => void;
  upgradePlan: (plan: SubscriptionPlan, billingCycle: BillingCycle) => void;
  cancelSubscription: () => void;
  isLoading: boolean;
  hasFeature: (feature: string) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const FEATURES: Record<SubscriptionPlan, string[]> = {
  free: [
    "downloads_limited",
    "free_assets_only",
    "standard_license",
    "standard_resolution",
  ],
  premium: [
    "downloads_unlimited",
    "all_assets",
    "commercial_license",
    "hd_4k_resolution",
    "priority_support",
    "personal_collections",
    "no_watermark",
  ],
  elite: [
    "downloads_unlimited",
    "all_assets",
    "commercial_license",
    "hd_4k_resolution",
    "8k_resolution",
    "priority_support",
    "personal_collections",
    "no_watermark",
    "api_access",
    "team_management",
    "advanced_stats",
  ],
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscriptionState] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bantushot_subscription");
      if (stored) {
        setSubscriptionState(JSON.parse(stored));
      } else {
        // Default to free plan
        setSubscriptionState({
          plan: "free",
          billingCycle: "monthly",
          startDate: new Date().toISOString(),
          isActive: true,
        });
      }
    } catch (error) {
      console.error("Error loading subscription:", error);
      setSubscriptionState({
        plan: "free",
        billingCycle: "monthly",
        startDate: new Date().toISOString(),
        isActive: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoading && subscription) {
      try {
        localStorage.setItem("bantushot_subscription", JSON.stringify(subscription));
      } catch (error) {
        console.error("Error saving subscription:", error);
      }
    }
  }, [subscription, isLoading]);

  const setSubscription = useCallback((newSubscription: Subscription | null) => {
    setSubscriptionState(newSubscription);
  }, []);

  const upgradePlan = useCallback((plan: SubscriptionPlan, billingCycle: BillingCycle) => {
    const newSubscription: Subscription = {
      plan,
      billingCycle,
      startDate: new Date().toISOString(),
      isActive: true,
    };
    setSubscriptionState(newSubscription);
  }, []);

  const cancelSubscription = useCallback(() => {
    setSubscriptionState({
      plan: "free",
      billingCycle: "monthly",
      startDate: new Date().toISOString(),
      isActive: false,
    });
  }, []);

  const hasFeature = useCallback((feature: string): boolean => {
    if (!subscription) return false;
    const planFeatures = FEATURES[subscription.plan] || [];
    return planFeatures.includes(feature);
  }, [subscription]);

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        setSubscription,
        upgradePlan,
        cancelSubscription,
        isLoading,
        hasFeature,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
