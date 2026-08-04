require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');
const projectRoutes = require('./routes/projectRoutes');
const profileRoutes = require('./routes/profileRoutes');
const chatRoutes = require('./routes/chatRoutes');

connectDB();

const app = express();

// Render (like Heroku, most PaaS/cloud hosts) sits your app behind a reverse
// proxy, which sets X-Forwarded-For. Trusting exactly one hop lets Express
// resolve the real visitor IP instead of the proxy's IP, so express-rate-limit
// can rate-limit per visitor rather than globally. See:
// https://express-rate-limit.github.io/ERR_ERL_UNEXPECTED_X_FORWARDED_FOR/
app.set('trust proxy', 1);

// Normalize CLIENT_URL so a trailing slash in the env var (a common copy-paste
// mistake) can't cause the origin comparison to fail — browsers match this
// value character-for-character.
const clientUrl = (process.env.CLIENT_URL).replace(/\/+$/, '');

app.use(helmet());
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chat', chatRoutes);

app.use(notFound);
app.use(errorHandler);




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});