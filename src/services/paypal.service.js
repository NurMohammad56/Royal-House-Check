import axios from "axios";
import { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } from "../config/config.js";

const PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com"; // Use live URL in production

// Get OAuth token from PayPal
const getAccessToken = async () => {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");

    const response = await axios.post(
        `${PAYPAL_API_BASE}/v1/oauth2/token`,
        new URLSearchParams({ grant_type: "client_credentials" }),
        {
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    return response.data.access_token;
};

// Create PayPal Order (CAPTURE intent)
export const createPaypalOrder = async (amount, currency = "USD") => {
    try {
        const accessToken = await getAccessToken();

        const response = await axios.post(
            `${PAYPAL_API_BASE}/v2/checkout/orders`,
            {
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: currency,
                            value: amount.toFixed(2),
                        },
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data.id; // PayPal Order ID
    } catch (error) {
        console.error("PayPal Order Creation Error:", error.response?.data || error.message);
        throw error;
    }
};
