import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  nisn: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  schoolOrigin: { type: String },
  birthDate: { type: String },
  birthPlace: { type: String },
  gender: { type: String, enum: ['L', 'P'] },
  religion: { type: String, default: 'Islam' },
  address: { type: String },
  raporScore: { type: Number },
  guardianName: { type: String },
  guardianPhone: { type: String },
  // File fields stored as Base64 data URIs
  pasFoto: { type: String },
  ijazah: { type: String },
  rapor: { type: String },
  kartuKeluarga: { type: String },
  aktaKelahiran: { type: String },
  suratKeterangan: { type: String },
  submittedFiles: {
    rapor: { type: Boolean, default: false },
    kk: { type: Boolean, default: false },
    ijazah: { type: Boolean, default: false }
  },
  regNumber: { type: String, unique: true, required: true },
  status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Registration || mongoose.model('Registration', registrationSchema);
