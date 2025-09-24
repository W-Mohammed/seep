const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { Tenant } = require('../database/tenant.model');
const { setupDemoSurvey } = require('./databaseScripts');

// Load environment variables from .env.dev
dotenv.config({ path: '.env.dev' });

const initializeDb = async () => {
  try {
    // Get admin credentials from env or use defaults
    const adminUsername = process.env.ADMIN_USERNAME || 'wmohammed@darkpeakanalytics.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'SEEP123!';
    const organisationName = process.env.ORGANISATION_NAME || 'DPA';

    // Check if admin user exists
    const existingTenant = await Tenant.findOne({
      'users.username': adminUsername
    });

    if (!existingTenant) {
      console.log('Creating admin user and demo survey...');
      
      // Create tenant with admin user
      await Tenant.create({
        id: organisationName.toLowerCase(),
        name: organisationName,
        status: 'active',
        surveys: [],
        users: [
          {
            username: adminUsername,
            name: 'Admin User',
            role: 'admin',
            superadmin: true,
            password: await bcrypt.hash(adminPassword, 10),
            forcePasswordReset: true,
            actionTimestamps: [],
            lastLoggedIn: new Date()
          }
        ]
      });

      // Create demo survey
      await setupDemoSurvey('dpa');
      
      console.log('Admin user and demo survey created successfully');
    } else {
      console.log('Admin user already exists, skipping initialization');
    }

  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = { initializeDb };
