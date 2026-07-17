require('dotenv').config();
const connectDB = require('./config/db');
const Skill = require('./models/Skill');
const Project = require('./models/Project');
const Profile = require('./models/Profile');

const skills = [
  { name: 'Java', category: 'Languages', percentage: 80, order: 1 },
  { name: 'C++', category: 'Languages', percentage: 75, order: 2 },
  { name: 'JavaScript', category: 'Languages', percentage: 85, order: 3 },
  { name: 'HTML5', category: 'Languages', percentage: 90, order: 4 },
  { name: 'CSS3', category: 'Languages', percentage: 85, order: 5 },

  { name: 'React.js', category: 'Frontend', percentage: 85, order: 1 },
  { name: 'Bootstrap', category: 'Frontend', percentage: 80, order: 2 },
  { name: 'Tailwind CSS', category: 'Frontend', percentage: 80, order: 3 },
  { name: 'React Router', category: 'Frontend', percentage: 80, order: 4 },
  { name: 'Context API', category: 'Frontend', percentage: 75, order: 5 },
  { name: 'Axios', category: 'Frontend', percentage: 80, order: 6 },

  { name: 'Node.js', category: 'Backend', percentage: 80, order: 1 },
  { name: 'Express.js', category: 'Backend', percentage: 80, order: 2 },
  { name: 'REST APIs', category: 'Backend', percentage: 85, order: 3 },
  { name: 'JWT Authentication', category: 'Backend', percentage: 75, order: 4 },
  { name: 'Socket.IO', category: 'Backend', percentage: 65, order: 5 },
  { name: 'OTP Authentication', category: 'Backend', percentage: 65, order: 6 },

  { name: 'MongoDB', category: 'Database', percentage: 80, order: 1 },
  { name: 'MySQL', category: 'Database', percentage: 75, order: 2 },

  { name: 'Git', category: 'Tools', percentage: 80, order: 1 },
  { name: 'GitHub', category: 'Tools', percentage: 80, order: 2 },
  { name: 'VS Code', category: 'Tools', percentage: 90, order: 3 },
  { name: 'Postman', category: 'Tools', percentage: 75, order: 4 },
  { name: 'Cloudinary', category: 'Tools', percentage: 65, order: 5 },
  { name: 'Render', category: 'Tools', percentage: 70, order: 6 },
  { name: 'Vercel', category: 'Tools', percentage: 75, order: 7 },
  { name: 'XAMPP', category: 'Tools', percentage: 65, order: 8 },
];

const projects = [
  {
    title: 'MultiShop (MERN E-Commerce)',
    description:
      'A full-featured e-commerce platform with JWT authentication, seller and admin dashboards, REST APIs, and Cloudinary image integration. Deployed on Render and Vercel.',
    techStack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Cloudinary'],
    githubUrl: '',
    liveUrl: '',
    featured: true,
    order: 1,
  },
  {
    title: 'MovieVerse',
    description:
      'A responsive movie discovery app using the TMDB API, with a watchlist, favorites list, and OTP-based authentication.',
    techStack: ['React', 'TMDB API', 'OTP Auth'],
    githubUrl: '',
    liveUrl: '',
    featured: true,
    order: 2,
  },
  {
    title: 'Student Management System',
    description: 'A CRUD-based system for managing student records with MySQL integration and REST APIs.',
    techStack: ['REST APIs', 'MySQL'],
    githubUrl: '',
    liveUrl: '',
    featured: false,
    order: 3,
  },
  {
    title: 'News Application',
    description: 'A news app with infinite scrolling, built using the News API.',
    techStack: ['React', 'News API'],
    githubUrl: '',
    liveUrl: '',
    featured: false,
    order: 4,
  },
  {
    title: 'Calculator Web Application',
    description: 'A responsive multi-calculator web app built with vanilla HTML, CSS, and JavaScript.',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    githubUrl: '',
    liveUrl: '',
    featured: false,
    order: 5,
  },
];

const profile = {
  name: 'Sujeet Chaudhary',
  title: 'Full Stack Web Developer (MERN)',
  summary:
    'Motivated B.Tech student and Full Stack Web Developer with hands-on experience building responsive, scalable web applications using the MERN stack. Passionate about solving algorithmic problems and creating user-friendly applications.',
  email: 'your.email@example.com', // TODO: update
  phone: '+91-XXXXXXXXXX', // TODO: update
  location: 'India',
  githubUrl: 'https://github.com/sujeet301',
  linkedinUrl: '', // TODO: add
  portfolioUrl: '', // TODO: add once deployed
  resumeUrl: '', // TODO: add a link to a hosted PDF of your resume
  education: [
    {
      degree: 'Bachelor of Technology (B.Tech)',
      institution: 'Add your college/university name', // TODO
      year: 'Expected graduation - add year', // TODO
      details:
        'Relevant coursework: Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, Software Engineering, OOP',
    },
  ],
  softSkills: [
    'Problem Solving',
    'Team Collaboration',
    'Quick Learner',
    'Communication',
    'Time Management',
    'Analytical Thinking',
  ],
  achievements: [
    'Solved numerous DSA problems in Java and C++',
    'Strong understanding of React Hooks, Context API, Routing, and State Management',
    'Experience with deployment workflows and Git',
  ],
  languages: ['English', 'Hindi'],
};

const importData = async () => {
  try {
    await connectDB();

    await Skill.deleteMany();
    await Project.deleteMany();
    await Profile.deleteMany();

    await Skill.insertMany(skills);
    await Project.insertMany(projects);
    await Profile.create(profile);

    console.log('✅ Data imported successfully! Remember to fill in the TODOs in seed.js (email, phone, links).');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Skill.deleteMany();
    await Project.deleteMany();
    await Profile.deleteMany();
    console.log('🗑️  Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
