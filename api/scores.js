let scores = {};

export default function handler(req, res) {
  if (req.method === 'GET') {
    const chatId = req.query.chatId;
    if (!chatId || !scores[chatId]) {
      return res.status(200).json({ leaderboard: [] });
    }
    const leaderboard = Object.entries(scores[chatId]).map(([userId, data]) => ({
      userId,
      name: data.name,
      score: data.score,
    })).sort((a,b) => b.score - a.score);
    return res.status(200).json({ leaderboard });
  }

  if (req.method === 'POST') {
    const { chatId, userId, name } = req.body;
    if (!chatId || !userId || !name) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
    if (!scores[chatId]) scores[chatId] = {};
    if (!scores[chatId][userId]) scores[chatId][userId] = { name, score: 0 };
    scores[chatId][userId].score++;
    return res.status(200).json({ score: scores[chatId][userId].score });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
