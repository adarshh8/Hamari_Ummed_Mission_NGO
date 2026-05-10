const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const RewardedChild = require('./models/RewardedChild');

dotenv.config();

const sourceDir = path.join(__dirname, '../client/src/assets/stories');
const targetDir = path.join(__dirname, '../client/public/stories');

const students = [
  {
    photoFile: 'Abhishek.jpeg',
    name: 'Abhishek',
    age: 16,
    school: 'Government Inter College, Orai',
    class: '10th Board 2026',
    percentage: 'Good Marks',
    grade: 'A',
    subject: '10th Board',
    award: 'New Bicycle',
    year: 2026,
    story: 'Humari Umeed Mission enrolled Abhishek in its free coaching programme and provided him with all the study materials he needed. Our dedicated volunteers guided him regularly, helping him understand each subject clearly. Abhishek put in tremendous effort, attending every session with full dedication and never giving up. His consistent hard work paid off when he passed his 10th Board exam with excellent marks. To honour his achievement, Humari Umeed Mission proudly rewarded Abhishek with a brand new bicycle.',
  },
  {
    photoFile: 'Amrita.jpeg',
    name: 'Amrita',
    age: 15,
    school: 'Saraswati Vidya Mandir, Orai',
    class: '10th Board 2026',
    percentage: 'Good Marks',
    grade: 'A+',
    subject: '10th Board',
    award: 'New Bicycle',
    year: 2026,
    story: 'Humari Umeed Mission supported Amrita through its evening study sessions, providing her with free notebooks and a structured learning environment. Our volunteers worked closely with her, giving her the guidance and confidence she needed to excel. Amrita devoted herself completely to her studies, working hard every single day without losing focus. Her determination earned her outstanding marks in the 10th Board examination. Humari Umeed Mission celebrated her success by gifting her a brand new bicycle as a well-deserved reward.',
  },
  {
    photoFile: 'Anshika.jpeg',
    name: 'Anshika',
    age: 15,
    school: 'Kendriya Vidyalaya, Orai',
    class: '10th Board 2026',
    percentage: 'Good Marks',
    grade: 'A+',
    subject: '10th Board',
    award: 'New Bicycle',
    year: 2026,
    story: 'Humari Umeed Mission gave Anshika access to free tuition classes, sample papers, and regular mock tests conducted by trained volunteers. The NGO provided her with the right tools and encouragement to push beyond her limits. Anshika embraced every opportunity, studied with great passion, and gave her absolute best in every session. Her relentless effort led to brilliant results in the 10th Board examinations. To recognise her hard work and inspire others, Humari Umeed Mission rewarded Anshika with a shiny new bicycle.',
  },
  {
    photoFile: 'Devi Verma.jpeg',
    name: 'Devi Verma',
    age: 16,
    school: 'Pt. Deen Dayal Inter College, Orai',
    class: '10th Board 2026',
    percentage: 'Good Marks',
    grade: 'B+',
    subject: '10th Board',
    award: 'New Bicycle',
    year: 2026,
    story: 'Humari Umeed Mission identified Devi Verma as a bright student and immediately provided her with free study materials, a scholarship, and personal mentorship from our experienced educators. Volunteers worked with her patiently every evening, ensuring she never fell behind. Devi took full advantage of this support and studied with incredible focus and courage. She passed her 10th Board examination with good marks, proving that with the right help, every child can shine. The NGO gifted her a new bicycle to celebrate her success and support her journey ahead.',
  },
  {
    photoFile: 'Laxmi Verma.jpeg',
    name: 'Laxmi Verma',
    age: 15,
    school: 'Bal Vidya Mandir, Orai',
    class: '10th Board 2026',
    percentage: 'Good Marks',
    grade: 'A',
    subject: '10th Board',
    award: 'New Bicycle',
    year: 2026,
    story: 'Humari Umeed Mission provided Laxmi Verma with a solar study lamp, free books, and regular coaching at our learning centre. Our teachers gave her special attention in Mathematics and Science, helping her build strong fundamentals in both subjects. Laxmi attended every class with sincerity and practised tirelessly to improve herself day by day. Her dedication resulted in excellent marks in the 10th Board exam. As a mark of pride and encouragement, Humari Umeed Mission presented Laxmi with a new bicycle to support her continued journey of learning.',
  },
  {
    photoFile: 'Raj Awasthi.jpeg',
    name: 'Raj Awasthi',
    age: 16,
    school: 'Jawahar Navodaya Vidyalaya, Jalaun',
    class: '10th Board 2026',
    percentage: 'Good Marks',
    grade: 'A+',
    subject: '10th Board',
    award: 'New Bicycle',
    year: 2026,
    story: 'Humari Umeed Mission enrolled Raj Awasthi in its advanced coaching programme, offering him full study support, career guidance, and opportunities to participate in inter-school academic competitions. Our mentors recognised his potential early and channelled it with consistent training and motivation. Raj responded with exceptional dedication, studying with great discipline and pushing himself to achieve the very best. He scored among the highest marks in the district in his 10th Board exams. Humari Umeed Mission honoured this outstanding achievement by gifting Raj a new bicycle and celebrating his success with the entire community.',
  },
  {
    photoFile: 'Shalini.jpeg',
    name: 'Shalini',
    age: 15,
    school: 'Shri Ram Inter College, Orai',
    class: '10th Board 2026',
    percentage: 'Good Marks',
    grade: 'A',
    subject: '10th Board',
    award: 'New Bicycle',
    year: 2026,
    story: 'Humari Umeed Mission changed Shalini\'s academic journey by providing her with special coaching classes in Hindi, English, and Science. Our volunteers also conducted counselling sessions to help her build the right mindset for learning. Shalini embraced every session wholeheartedly, showing remarkable improvement and a strong will to succeed. She worked with great discipline and passed her 10th Board exam with very good marks. To honour her determination and celebrate her victory, Humari Umeed Mission gifted Shalini a brand new bicycle as her most treasured reward.',
  },
];

const seedStories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log('Created public/stories directory');
    }

    var childDocs = [];

    for (var i = 0; i < students.length; i++) {
      var student = students[i];
      var srcPath = path.join(sourceDir, student.photoFile);
      var destPath = path.join(targetDir, student.photoFile);

      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log('Copied: ' + student.photoFile);
      } else {
        console.log('WARNING - Photo not found: ' + student.photoFile);
      }

      childDocs.push({
        name: student.name,
        age: student.age,
        school: student.school,
        class: student.class,
        percentage: student.percentage,
        grade: student.grade,
        subject: student.subject,
        award: student.award,
        year: student.year,
        story: student.story,
        photo: '/stories/' + student.photoFile,
        isPublic: true,
      });
    }

    await RewardedChild.deleteMany({});
    console.log('Cleared all existing stories');

    await RewardedChild.insertMany(childDocs);
    console.log('SUCCESS: Seeded ' + childDocs.length + ' student stories!');

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

seedStories();
