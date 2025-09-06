import React from "react";
import Card from "./shared/Card";
import { SubscriptionPlan, User } from "../types";
import Spinner from "./shared/Spinner";
import { getPaymentConfig, verifyPaystackPayment } from "../services/apiService";

interface PaymentFormProps {
  user: User;
  plan: SubscriptionPlan;
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentStatus =
  | "initializing"
  | "fetching_config"
  | "ready"
  | "verifying"
  | "error";

interface PaystackTransaction {
  reference: string;
  status: string;
  transaction: string;
  amount: number;
  // Add other expected properties as needed
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  user,
  plan,
  onClose,
  onSuccess,
}) => {
  const [status, setStatus] = React.useState<PaymentStatus>("initializing");
  const [error, setError] = React.useState<string | null>(null);
  const [publicKey, setPublicKey] = React.useState<string | null>(null);
  const [userDetails, setUserDetails] = React.useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
  });

  React.useEffect(() => {
    const fetchConfig = async () => {
      setStatus("fetching_config");
      console.log("PaymentForm: Fetching payment config...");
      try {
        const config = await getPaymentConfig();
        if (!config.publicKey) {
          throw new Error("Public key was not returned from the server.");
        }
        setPublicKey(config.publicKey);
        console.log("PaymentForm: Payment config fetched successfully.");
        setStatus("ready");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unknown error occurred";
        console.error("PaymentForm: Failed to fetch payment config:", message);
        setError(`Could not initialize payment gateway: ${message}`);
        setStatus("error");
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [id]: value }));
  };

  const handlePaystackPayment = async () => {
    if (!publicKey || !plan.priceValue) return;

    if (!userDetails.email || !userDetails.name || !userDetails.phone) {
      alert("Please fill in all your details.");
      return;
    }

    try {
      // Lazy-load Paystack only when needed
      const { default: PaystackPop } = await import("@paystack/inline-js");
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: publicKey,
        email: userDetails.email,
        amount: plan.priceValue * 100, // kobo
        reference: "" + Math.floor(Math.random() * 1000000000 + 1),
        metadata: {
          user_id: user._id || user.id,
          plan_name: plan.name,
          full_name: userDetails.name,
          phone_number: userDetails.phone,
        },
        onSuccess: async (transaction: PaystackTransaction) => {
          setStatus("verifying");
          try {
            const verification = await verifyPaystackPayment(
              transaction.reference
            );
            if (verification.success) {
              onSuccess();
            } else {
              setError(verification.message || "Payment verification failed.");
              setStatus("error");
            }
          } catch (err) {
            const message =
              err instanceof Error ? err.message : "An unknown error occurred.";
            setError(`Payment could not be confirmed: ${message}`);
            setStatus("error");
          }
        },
        onCancel: () => {
          console.log("Payment window closed by user.");
        },
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Payment could not be started: ${message}`);
      setStatus("error");
    }
  };

  const getButtonText = () => {
    switch (status) {
      case "initializing":
      case "fetching_config":
        return "Initializing...";
      case "ready":
        return `Pay ${plan.price} Securely`;
      case "verifying":
        return "Verifying Payment...";
      case "error":
        return "Retry Payment";
      default:
        return "Please Wait";
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 animate-fade-in p-4">
      <Card className="w-full max-w-md">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Complete Your Purchase
              </h2>
              <p className="text-gray-500">
                You are subscribing to the{" "}
                <strong className="text-cyan-600">{plan.name}</strong> plan.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
            >
              &times;
            </button>
          </div>

          {status === "verifying" ? (
            <div className="min-h-[250px] flex items-center justify-center">
              <Spinner message="Verifying your payment, please do not close this window..." />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={userDetails.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Email for Receipt
                </label>
                <input
                  type="email"
                  id="email"
                  value={userDetails.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={userDetails.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
              <button
                onClick={handlePaystackPayment}
                // FIX: Corrected the disabled logic. The check for "verifying" was causing a TS error because this button is not rendered when status is "verifying". Also added "initializing".
                disabled={status === "initializing" || status === "fetching_config"}
                className={`w-full py-3 mt-4 font-bold rounded-lg transition-colors
                  ${
                    status === "ready"
                      ? "bg-cyan-600 text-white hover:bg-cyan-700"
                      : status === "error"
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
              >
                {getButtonText()}
              </button>
              {error && (
                <div className="bg-red-50 text-red-700 p-3 mt-4 rounded-lg text-sm text-center">
                  <strong>Error:</strong> {error}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PaymentForm;

interface PaystackTransaction {
  reference: string;
  status: string;
  transaction: string;
  amount: number;
  // Add other expected properties as needed
}