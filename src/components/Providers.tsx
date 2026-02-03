"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/hooks/useCart";
import { ToastProvider } from "@/hooks/useToast";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      <CartProvider>{children}</CartProvider>
    </ToastProvider>
  );
}
