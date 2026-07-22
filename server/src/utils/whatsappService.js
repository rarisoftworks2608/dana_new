require("dotenv").config();

/**
 * Sends a WhatsApp confirmation message (with the QR code image) to the
 * registrant's mobile number using Meta's WhatsApp Cloud API.
 *
 * In WHATSAPP_SANDBOX_MODE (default while you don't have API credentials
 * yet) this just logs what *would* be sent, so registration keeps working
 * during development.
 */
async function sendWhatsAppConfirmation(registration, qrPublicUrl) {
  const sandbox = process.env.WHATSAPP_SANDBOX_MODE !== "false";

  if (sandbox || !process.env.WHATSAPP_ACCESS_TOKEN) {
    console.log(
      `[WHATSAPP SANDBOX] Would send to ${registration.mobile} | name=${registration.full_name} | qr=${qrPublicUrl}`
    );
    return { ok: true, status: "sandboxed" };
  }

  const url = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const countryCode = process.env.WHATSAPP_DEFAULT_COUNTRY_CODE || "91";
  const toNumber = `${countryCode}${registration.mobile}`;

  const payload = {
    messaging_product: "whatsapp",
    to: toNumber,
    type: "template",
    template: {
      name: process.env.WHATSAPP_TEMPLATE_NAME,
      language: { code: "en" },
      components: [
        {
          type: "header",
          parameters: [{ type: "image", image: { link: qrPublicUrl } }],
        },
        {
          type: "body",
          parameters: [
            { type: "text", text: registration.full_name },
            { type: "text", text: registration.registration_type },
          ],
        },
      ],
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`WhatsApp API responded ${response.status}: ${body}`);
    }

    return { ok: true, status: "sent" };
  } catch (err) {
    console.error("WhatsApp send failed:", err.message);
    return { ok: false, status: "failed", error: err.message };
  }
}

module.exports = { sendWhatsAppConfirmation };
