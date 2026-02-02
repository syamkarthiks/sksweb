export default async function handler(req, res) {
  const SUPABASE_URL = "https://vjjtljbsyoeszyayunzc.supabase.co";
  const SUPABASE_KEY = "sb_publishable_f9MIKH_F9LHTUePZ6D5lYg_0zQob5vX";

  try {
    // 🔎 Get Real IP
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

    // 🖥 Detect Operating System
    let os = "Other";
    if (userAgent.includes("Android")) os = "Android";
    else if (userAgent.includes("Windows")) os = "Windows";
    else if (userAgent.includes("iPhone") || userAgent.includes("iOS")) os = "iOS";
    else if (userAgent.includes("Mac")) os = "Mac";

    // 🌍 GEO LOOKUP (HTTPS – works on Vercel)
    let country = null;
    let region = null;
    let city = null;
    let isp = null;

    try {
      const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
      const geo = await geoRes.json();

      country = geo.country_name || null;
      region = geo.region || null;
      city = geo.city || null;
      isp = geo.org || null;
    } catch (geoError) {
      console.log("Geo lookup failed");
    }

    // 📦 Data Object (Matches Supabase Columns)
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

    // 💾 Insert Into Supabase
    await fetch(`${SUPABASE_URL}/rest/v1/visitors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=minimal"
      },
      body: JSON.stringify(data)
    });

    res.status(200).json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
