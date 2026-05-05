"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CompareProvider } from "@/contexts/CompareContext";
import { CollectionsProvider } from "@/contexts/CollectionsContext";
import { DownloadsProvider } from "@/contexts/DownloadsContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <CompareProvider>
              <CollectionsProvider>
                <DownloadsProvider>
                  <SubscriptionProvider>
                    {children}
                  </SubscriptionProvider>
                </DownloadsProvider>
              </CollectionsProvider>
            </CompareProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
