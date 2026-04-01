const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Check si admin déjà existe
    const existingAdmin = await User.findOne({ email: 'admin@cabinet.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin déjà existe — suppression...');
      await User.deleteOne({ email: 'admin@cabinet.com' });
    }

    // Créer admin
    const admin = await User.create({
      name: 'Dr.Marween',
      email: 'admin@cabinet.com',
      password: 'admin123456',
      role: 'admin',
      phone: '+216 00 000 000',
    });

    console.log('🎉 Admin créé avec succès!');
    console.log('📧 Email    :', admin.email);
    console.log('🔑 Password : admin123456');
    console.log('👤 Role     :', admin.role);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

seedAdmin();