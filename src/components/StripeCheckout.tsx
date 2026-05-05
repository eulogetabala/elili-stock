"use client";

import { useState } from "react";
import AnimatedButton from "./ui/AnimatedButton";

// Import conditionnel de Stripe (sera disponible après installation)
let loadStripe: any = null;
let Elements: any = null;
let PaymentElement: any = null;
let useStripe: any = null;
let useElements: any = null;

try {
  const stripeJs = require("@stripe/stripe-js");
  const reactStripeJs = require("@stripe/react-stripe-js");
  loadStripe = stripeJs.loadStripe;
  Elements = reactStripeJs.Elements;
  PaymentElement = reactStripeJs.PaymentElement;
  useStripe = reactStripeJs.useStripe;
  useElements = reactStripeJs.useElements;
} catch (error) {
  // Stripe n'est pas encore installé - c'est normal
  console.warn("Stripe packages not installed. Run: npm install @stripe/stripe-js @stripe/react-stripe-js");
}

let stripePromise: Promise<any> | null = null;

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && loadStripe) {
  try {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  } catch (error) {
    console.warn("Failed to initialize Stripe");
  }
}

interface StripeCheckoutProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function StripeCheckout({ clientSecret, onSuccess, onError }: StripeCheckoutProps) {
  // Vérifier si Stripe est installé
  if (!loadStripe || !Elements || !PaymentElement || !useStripe || !useElements) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
        <p className="text-yellow-800 font-medium text-sm mb-2">
          ⚠️ Stripe n'est pas encore installé
        </p>
        <p className="text-yellow-700 text-xs">
          Pour activer les paiements, exécutez :<br />
          <code className="bg-yellow-100 px-2 py-1 rounded mt-1 inline-block">
            npm install @stripe/stripe-js @stripe/react-stripe-js
          </code>
        </p>
      </div>
    );
  }

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
        <p className="text-yellow-800 font-medium text-sm">
          ⚠️ Stripe n'est pas configuré. Ajoutez NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY dans .env.local
        </p>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-800 font-medium text-sm">
          Erreur d'initialisation de Stripe
        </p>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#ff6b00",
        colorBackground: "#ffffff",
        colorText: "#0f172a",
        colorDanger: "#ef4444",
        fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "12px",
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}

function CheckoutForm({ onSuccess, onError }: { onSuccess: () => void; onError: (error: string) => void }) {
  if (!useStripe || !useElements) {
    return (
      <div className="p-6 bg-slate-50 rounded-xl text-center">
        <p className="text-slate-600 font-medium">Stripe n'est pas disponible</p>
      </div>
    );
  }

  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/payment-success",
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Une erreur est survenue");
        onError(error.message || "Erreur de paiement");
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess();
      }
    } catch (err: any) {
      const message = err.message || "Une erreur inattendue est survenue";
      setErrorMessage(message);
      onError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <div className="p-6 bg-slate-50 rounded-xl text-center">
        <p className="text-slate-600 font-medium">Chargement du formulaire de paiement...</p>
      </div>
    );
  }

  if (!PaymentElement) {
    return (
      <div className="p-6 bg-slate-50 rounded-xl text-center">
        <p className="text-slate-600 font-medium">Stripe n'est pas disponible</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-6 bg-slate-50 rounded-xl">
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
        </div>
      )}

      <AnimatedButton
        type="submit"
        variant="primary"
        size="lg"
        glow
        className="w-full"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? "Traitement du paiement..." : "Payer maintenant"}
      </AnimatedButton>

      <p className="text-xs text-slate-500 text-center">
        Paiement sécurisé par Stripe. Vos informations de paiement sont cryptées.
      </p>
    </form>
  );
}
