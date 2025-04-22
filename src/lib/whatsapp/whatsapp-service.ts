"use server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_WHATSAPP_NUMBER; // Your Twilio WhatsApp number

const client = twilio(accountSid, authToken);
interface SendWhatsAppParams {
  to: string; // Recipient phone number (e.g., "+966501234567")
  message: string; // Message content
}
export async function sendWhatsAppMessage({ to, message }: SendWhatsAppParams) {
  try {
    // Validate phone number format
    const formattedTo = validateAndFormatPhoneNumber(to);

    // Determine sender number (sandbox vs production)
    const fromNumber =
      process.env.NODE_ENV === "production"
        ? `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`
        : "whatsapp:+14155238886"; // Twilio sandbox number

    // Send message
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: `whatsapp:${formattedTo}`,
    });

    return {
      success: true,
      messageSid: result.sid,
      timestamp: result.dateCreated,
    };
  } catch (error) {
    console.error("Twilio WhatsApp Error:", {
      code: error?.code,
      message: error?.message,
      moreInfo: error?.moreInfo,
    });

    return {
      success: false,
      error: getFriendlyErrorMessage(error?.code),
      details: error?.message,
    };
  }
}

// Helper function to validate Saudi numbers
function validateAndFormatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // Handle Saudi numbers specifically
  if (digits.startsWith("966")) {
    if (digits.length !== 12) {
      // 966 + 9 digits
      throw new Error("Saudi numbers must be 9 digits after country code");
    }
    return `+${digits}`;
  }

  // Handle international format
  if (digits.startsWith("00")) {
    return `+${digits.substring(2)}`;
  }

  // Assume number is already in E.164 format
  return phone.startsWith("+") ? phone : `+${phone}`;
}

// User-friendly error messages
function getFriendlyErrorMessage(errorCode: string): string {
  const errorMap: Record<string, string> = {
    "21211": "Invalid phone number format",
    "21608": "Recipient not in WhatsApp sandbox",
    "63007": "Sender number not configured for WhatsApp",
    "63016": "Message template not approved",
  };

  return errorMap[errorCode] || "Failed to send WhatsApp message";
}
