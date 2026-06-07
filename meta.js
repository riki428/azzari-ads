module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = req.headers.authorization?.replace('Bearer ', '') || process.env.META_TOKEN;
  if (!token) return res.status(401).json({ error: 'No token' });

  const { path, ...params } = req.query;
  if (!path) return res.status(400).json({ error: 'No path' });

  const searchParams = new URLSearchParams({ ...params, access_token: token });
  const url = `https://graph.facebook.com/v21.0/${path}?${searchParams}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) return res.status(400).json(data);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
