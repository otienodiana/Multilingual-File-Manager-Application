const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ensure this imports the Sequelize instance

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

async function authenticateUser(username, candidatePassword) {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await user.comparePassword(candidatePassword);
    if (!isMatch) {
      throw new Error('Invalid password');
    }

    console.log('User authenticated:', user);
    return user;
  } catch (err) {
    console.error('Error authenticating user:', err);
  }
}

// Hash password before saving user
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// Add a method to compare passwords
User.prototype.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
