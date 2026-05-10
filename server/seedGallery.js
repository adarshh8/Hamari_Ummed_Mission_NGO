const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Gallery = require('./models/Gallery');

dotenv.config();

const sourceDir = path.join(__dirname, '../client/src/assets/images');
const targetDir = path.join(__dirname, '../client/public/gallery');

const seedImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Read files from source
    const files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.jpeg') || file.endsWith('.jpg'));
    
    const galleryItems = [];

    for (const file of files) {
      const srcPath = path.join(sourceDir, file);
      const destPath = path.join(targetDir, file);
      
      // Copy file to public/gallery so it can be served statically in dev and prod
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file} to public/gallery`);

      // Determine category based on filename
      let category = 'events';
      const lowerName = file.toLowerCase();
      if (lowerName.includes('certificate') || lowerName.includes('winner') || lowerName.includes('award')) {
        category = 'awards';
      } else if (lowerName.includes('oldage') || lowerName.includes('elder')) {
        category = 'elderly';
      } else if (lowerName.includes('book') || lowerName.includes('school') || lowerName.includes('education') || lowerName.includes('tuition')) {
        category = 'children';
      }

      // Prepare DB entry
      galleryItems.push({
        title: file.split('.')[0].replace(/[0-9]/g, ' ').trim(), // e.g. "fortvisit1.jpeg" -> "fortvisit"
        imageUrl: `/gallery/${file}`,
        caption: 'Beautiful moments captured during our community events.',
        category: category,
        location: '',
        featured: true,
      });
    }

    // Delete existing gallery items to prevent duplicates
    await Gallery.deleteMany({});
    console.log('Cleared existing gallery items');

    // Insert new items
    await Gallery.insertMany(galleryItems);
    console.log(`Successfully added ${galleryItems.length} images to the Gallery collection!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding gallery:', error);
    process.exit(1);
  }
};

seedImages();
