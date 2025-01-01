


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  username: String,
  email: { type: String, unique: true }, 
  password: { type: String, required: true },
  phone: String,
  status: String,
  coupon:String,
  startTimeJava: { type: Date, default: null },
  startTimeWeb: { type: Date, default: null },
  githubJavaUrl: { type: String, default: '' },
  githubWebUrl: { type: String, default: '' },
  ExamButton:  { type: Date, default: null },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);


// // Pre-save hook to hash the password before saving it
// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     try {
//       const salt = await bcrypt.genSalt(10); // Generate a salt
//       this.password = await bcrypt.hash(this.password, salt); // Hash the password
//       next();
//     } catch (error) {
//       next(error);
//     }
//   } else {
//     next();
//   }
// });


