export default async function handler(req, res) {

  const SUPABASE_URL = "YOUR_SUPABASE_URL";
  const SUPABASE_KEY = "YOUR_ANON_KEY";

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

    let os = "Other";
    if (userAgent.includes("Android")) os = "Android";
    else if (userAgent.includes("Windows")) os = "Windows";
    else if (userAgent.includes("iPhone")) os = "iOS";
    else if (userAgent.includes("Mac")) os = "Mac";

    let country = null;
    let region = null;
    let city = null;
    let isp = null;

    try {
      const geo = await fetch(`https://ipapi.co/${ip}/json/`)
        .then(r => r.json());

      country = geo.country_name || null;
      region = geo.region || null;
      city = geo.city || null;
      isp = geo.org || null;
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
