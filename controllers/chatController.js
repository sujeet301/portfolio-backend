const axios = require('axios');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Profile = require('../models/Profile');

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MAX_HISTORY_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 800;

// Pull the portfolio's own live data so the assistant can answer questions
// about the owner accurately instead of guessing.
async function buildPortfolioContext() {
  const [profile, skills, projects] = await Promise.all([
    Profile.findOne(),
    Skill.find(),
    Project.find(),
  ]);

  const skillsList = skills.map((s) => `${s.name} (${s.category}, ${s.percentage}%)`).join(', ') || 'none listed yet';

  const projectsList =
    projects
      .map((p) => `- ${p.title}: ${p.description} [tech: ${(p.techStack || []).join(', ') || 'n/a'}]`)
      .join('\n') || 'none listed yet';

  const educationList =
    (profile?.education || []).map((e) => `${e.degree} — ${e.institution} (${e.year})`).join('; ') || 'not listed';

  return `Name: ${profile?.name || 'the portfolio owner'}
Title: ${profile?.title || 'not listed'}
Summary: ${profile?.summary || 'not listed'}
Education: ${educationList}
Skills: ${skillsList}
Projects:
${projectsList}
Contact: email ${profile?.email || 'not listed'}, GitHub ${profile?.githubUrl || 'not listed'}, LinkedIn ${
    profile?.linkedinUrl || 'not listed'
  }`;
}

// @desc    Chat with an assistant embedded in the portfolio
// @route   POST /api/chat
// @access  Public (rate-limited — see routes/chatRoutes.js)
const chat = async (req, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'The chat assistant is not configured yet. Add ANTHROPIC_API_KEY to the backend .env.',
      });
    }

    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'A message is required.' });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ success: false, message: 'That message is too long.' });
    }

    const context = await buildPortfolioContext();

    const systemPrompt = `You are a friendly assistant embedded in a developer's portfolio website, answering questions from visitors.

Visitors may ask about the portfolio owner's background, skills, or projects — answer those using ONLY the information below. If something isn't covered by this information, say you're not sure rather than guessing.

Visitors may also ask general web development questions unrelated to the owner (e.g. "what's the difference between REST and GraphQL", "how does JWT auth work") — answer those helpfully and accurately using your own knowledge.

Keep answers concise (a few sentences, unless a short code snippet genuinely helps).

Portfolio owner's information:
${context}`;

    const safeHistory = Array.isArray(history)
      ? history
          .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
          .slice(-MAX_HISTORY_MESSAGES)
      : [];

    const response = await axios.post(
      ANTHROPIC_API_URL,
      {
        model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: systemPrompt,
        messages: [...safeHistory, { role: 'user', content: message }],
      },
      {
        headers: {
          'content-type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        timeout: 20000,
      }
    );

    const reply = response.data?.content?.find((block) => block.type === 'text')?.text;

    res.status(200).json({ success: true, reply: reply || "Sorry, I couldn't come up with a reply to that." });
  } catch (error) {
    console.error('Chat error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'The assistant is unavailable right now. Please try again shortly.',
    });
  }
};

module.exports = { chat };
