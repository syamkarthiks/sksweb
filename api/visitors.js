export default async function handler(req, res) {

  const SUPABASE_URL = "https://vjjtljbsyoeszyayunzc.supabase.co";
  const SUPABASE_KEY = "sb_publishable_f9MIKH_F9LHTUePZ6D5lYg_0zQob5vX";

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/visitors?select=*&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
