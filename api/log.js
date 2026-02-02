export default async function handler(req, res) {
  const SUPABASE_URL = "https://vjjtljbsyoeszyayunzc.supabase.co";
  const SUPABASE_KEY = "sb_publishable_f9MIKH_F9LHTUePZ6D5lYg_0zQob5vX";

  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket?.remoteAddress ||
      "unknown";

    const userAgent = req.headers["user-agent"] || "unknown";
    const referrer = req.query.ref || "Direct";
    const timezone = req.query.tz || null;
    const darkMode = req.query.dark === "true";
    const networkType = req.query.net || "unknown";

    const created_at = new Date().toISOString();

    // Detect OS
    let os = "Other";
    if (userAgent.includes("Android")) os = "Android";
    else if (userAgent.includes("Windows")) os = "Windows";
    else if (userAgent.includes("iPhone") || userAgent.includes("iOS")) os = "iOS";
    else if (userAgent.includes("Mac")) os = "Mac";

    let country = null;
    let region = null;
    let city = null;
    let isp = null;

    try {
      const geoRes = await fetch(`https://ipwho.is/${ip}`);
      const geo = await geoRes.json();

      if (geo.success) {
        country = geo.country;
        region = geo.region;
        city = geo.city;
        isp = geo.connection?.isp;
      }
    } catch {}

    const data = {
      ip,
      country,
      region,
      city,
      isp,
      timezone,
      user_agent: userAgent,
      os,
      referrer,
      dark_mode: darkMode,
      network_type: networkType,
      created_at
    };

    await fetch(`${SUPABASE_URL}/rest/v1/visitors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify(data)
    });

    res.status(200).json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
