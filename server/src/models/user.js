import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import {sequelize} from "../lib/db.js";


// class User extends Model {

//   @param {string}
//   @returns {Promise<boolean>}

//   async comparePassword(candidatePassword) {
//     return await bcrypt.compare(candidatePassword, this.password)
//   }

//   toJSON() {
//     const values = { ...this.get()};
//     delete values.password;
//     delete values.mfaSecret;
//     return values;
//   }
// }
class User extends Model {}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type :DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isAlphanumeric: true,
      len: [3, 30],
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'seller', 'driver','admin'),
    defaultValue: 'user',
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'suspended', 'frozen'),
    defaultValue:'pending',
  },
  // Security & MFA
  isMfaEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  mfaSecret: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastLogin: {
    type:DataTypes.DATE,
  },
  // Verification for Fintech/Marketplace trust
  isEmailVerified: {
    type:DataTypes.BOOLEAN,
    defaultValue: false,
  },
  kycStatus: {
    type: DataTypes.ENUM('unverified', 'submitted', 'verified', 'rejected'),
    defaultValue: 'unverified',
  }
},{
 sequelize,
 modelName: 'User',
 tableName: 'users',
 timestamps: true,
 hooks: {
  //Hash Password before saving 
  beforeCreate: async(user) => {
    if(user.password) {
      user.password = await bcrypt.hash(user.password, 12)
    }
  },
  beforeUpdate: async(user) => {
    if(user.changed('password')){
      user.password = await bcrypt.hash(user.password, 12)
    }
   }
  }
 });

 User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  delete values.mfaSecret;
  return values;
};

 export default User;