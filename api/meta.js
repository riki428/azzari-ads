module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const token = req.headers.authorization?.replace('Bearer ', '') || process.env.META_TOKEN;
  if (!token) return res.status(401).json({ error: 'No token' });
  const { path, ...params } = req.query;
  const searchParams = new URLSearchParams({ ...params, access_token: token });
  const url = `https://graph.facebook.com/v21.0/${path}?${searchParams}`;
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
