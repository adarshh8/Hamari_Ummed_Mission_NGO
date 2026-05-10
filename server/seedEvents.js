const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Event = require('./models/Event');

dotenv.config();

const sourceDir = path.join(__dirname, '../client/src/assets/fonts');
const targetDir = path.join(__dirname, '../client/public/events');

const seedEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Helper function to process an event
    const createEventFromImages = async (prefix, fileExt, title, desc, dateStr) => {
      const files = fs.readdirSync(sourceDir).filter(file => file.startsWith(prefix) && file.endsWith(fileExt));
      
      if (files.length === 0) {
        console.log(`No ${prefix} images found in assets/fonts`);
        return;
      }

      const galleryUrls = [];

      for (const file of files) {
        const srcPath = path.join(sourceDir, file);
        const destPath = path.join(targetDir, file);
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${file} to public/events`);
        galleryUrls.push(`/events/${file}`);
      }

      const existingEvent = await Event.findOne({ title });
      if (existingEvent) {
        await existingEvent.deleteOne();
        console.log(`Deleted existing ${title} event to prevent duplicates`);
      }

      const newEvent = await Event.create({
        title,
        description: desc,
        eventType: 'Other',
        date: new Date(dateStr),
        time: '5:00 PM',
        venue: 'Orai Community Center',
        address: 'Main Square, Orai',
        city: 'Orai',
        coverImage: galleryUrls[0],
        gallery: galleryUrls,
        status: 'completed',
        childrenParticipated: 80,
        volunteersInvolved: 20,
        highlights: [
          'Community gathering',
          'Cultural performances',
          'Sweets and festive meals distributed'
        ]
      });

      console.log(`Successfully created event: "${newEvent.title}" with ${galleryUrls.length} images!`);
    };

    await createEventFromImages('Holi', '.jpg', 'Holi Festival Celebration', 'A vibrant and joyful celebration of the festival of colors with the children and local community in Orai.', '2026-03-03');
    await createEventFromImages('ramleel', '.jpeg', 'Ramleela and Diwali Celebration', 'A grand celebration of Ramleela and Diwali, bringing the community together with lights, performances, and joy.', '2025-10-31');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
};

seedEvents();
