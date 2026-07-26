require('dotenv').config();
const connectDB = require('./config/db');
const Skill = require('./models/Skill');
const Project = require('./models/Project');
const Profile = require('./models/Profile');

const skills = [
  { name: 'Java', category: 'Languages', percentage: 35, order: 1 },
  { name: 'C++', category: 'Languages', percentage: 45, order: 2 },
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
      'A full-featured e-commerce platform with customer, seller, and admin dashboards, JWT-based role authentication, REST APIs for products/cart/orders, and Cloudinary image integration. Deployed on Render and Vercel.',
    techStack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Cloudinary'],
    githubUrl: 'https://github.com/sujeet301/multishop-frontend',
    liveUrl: 'https://multishop-frontend.vercel.app/',
    featured: true,
    order: 1,
  },
  {
    title: 'Hospital Management System (MERN Stack)',
    description:
      'A hospital management application with patient registration, appointment booking, and doctor scheduling, featuring role-based access for Admin, Doctor, and Patient roles.',
    techStack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JWT'],
    githubUrl: 'https://github.com/sujeet301/hospital-management-frontend', // TODO: your resume PDF's links for this project point to the MultiShop repos by mistake — add the real frontend repo URL here
    liveUrl: 'https://hospital-management-frontend.vercel.app/', // TODO: the "Live: Hospital" text in your resume isn't hyperlinked at all — add the real deployed URL here
    featured: true,
    order: 2,
  },
  {
    title: 'MovieVerse',
    description:
      'A responsive movie discovery app using the TMDB API, with a watchlist, favorites list, and OTP-based authentication.',
    techStack: ['React', 'TMDB API', 'OTP Auth'],
    githubUrl: 'https://github.com/sujeet301/movieverse-frontend',
    liveUrl: 'https://movieverse-frontend.vercel.app/', 
    featured: true,
    order: 3,
  },
  {
    title: 'Student Management System',
    description: 'A CRUD-based system for managing student records with MySQL integration and REST APIs.',
    techStack: ['REST APIs', 'MySQL'],
    githubUrl: '',
    liveUrl: '',
    featured: false,
    order: 4,
  },
  {
    title: 'News Application',
    description: 'A news app with infinite scrolling, built using the News API.',
    techStack: ['React', 'News API'],
    githubUrl: '',
    liveUrl: '',
    featured: false,
    order: 5,
  },
  {
    title: 'Calculator Web Application',
    description: 'A responsive multi-calculator web app built with vanilla HTML, CSS, and JavaScript.',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    githubUrl: '',
    liveUrl: '',
    featured: false,
    order: 6,
  },
];

const profile = {
  name: 'Sujeet Chaudhary',
  title: 'Full Stack Web Developer (MERN)',
  summary:
    'Motivated B.Tech student and Full Stack Web Developer with hands-on experience building responsive, scalable web applications using the MERN stack. Passionate about solving algorithmic problems and creating user-friendly applications.',
  email: 'sujeetwebdev@gmail.com',
  phone: '+91-8750212473',
  location: 'Burari, New Delhi, India',
  githubUrl: 'https://github.com/sujeet301',
  leetcodeUrl: 'https://www.leetcode.com/sujeet301',
  linkedinUrl: 'https://www.linkedin.com/in/sujeet-chaudhary-236bbb374 ', 
  portfolioUrl: 'https://portfolio-frontend-gold-tau.vercel.app/',
  resumeUrl: 'https://drive.google.com/file/d/17YBpLkqQMIfEAg80u5hejWSPVmPPteb8/view?usp=drive_link',
  profileImage: 'https://res.cloudinary.com/i47xzmbo/image/upload/v1784976762/myimage_zbn23n.png', 
  education: [
    {
      degree: 'Bachelor of Technology (B.Tech), Computer Science',
      institution: 'IITM Group of Institutions, Murthal',
      year: '2023 - 2027 ', 
      details:
        'Relevant coursework: Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, Software Engineering, OOP',
    },
    {
      degree: 'Web Development Course (PHP)',
      institution: 'CCDM (ISO 9001:2015 Certified Institute)',
      year: 'Mar 2025 - Jul 2025',
      details: 'Completed a 4-month PHP-focused web development course with Grade A+.',
    },
    {
      degree: 'Senior Secondary (XI-XII), Science Stream',
      institution: 'Sarvodaya Vidyalaya (GBSSS), Dr. Mukherjee Nagar',
      year: 'Apr 2021 - Mar 2023',
      details: '',
    },
  ],
  certificates: [
    {
      title: 'Web Development Course (PHP)',
      issuer: 'CCDM (ISO 9001:2015 Certified Institute)', 
      date: 'Jul 2025', 
      url: 'https://drive.google.com/file/d/1Q7ijp-iSR3aQCfgyABwSL0lObpkqdgze/view?usp=drive_link',
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
    'Solved numerous DSA problems in Javascript and python on platforms like LeetCode, Codeforces' ,
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