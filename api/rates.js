export default async function handler(req, res) {
  try {
    const apiKey = process.env.METALS_DEV_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "METALS_DEV_API_KEY is not configured"
      });
    }

    const url =
      `https://api.metals.dev/v1/latest?api_key=${encodeURIComponent(apiKey)}&currency=INR&unit=g`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.status !== "success") {
      return res.status(502).json({
        success: false,
        message: "Metals.Dev API request failed",
        details: data
      });
    }

    return res.status(200).json({
      success: true,
      currency: data.currency,
      unit: data.unit,
      timestamp: data.timestamp,
      gold: data.metals?.gold ?? null,
      silver: data.metals?.silver ?? null
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch metal rates"
    });
  }
}
