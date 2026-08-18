const Registration = require('../models/Registration');

const register = async (req, res) => {
  try {
    const count = await Registration.countDocuments();
    const regNumber = `PPDB-2026-${String(count + 1).padStart(4, '0')}`;
    
    const registrationData = {
      ...req.body,
      regNumber
    };

    if (req.files) {
      if (req.files.pasFoto) registrationData.pasFoto = req.files.pasFoto[0].path;
      if (req.files.ijazah) registrationData.ijazah = req.files.ijazah[0].path;
      if (req.files.rapor) registrationData.rapor = req.files.rapor[0].path;
      if (req.files.kartuKeluarga) registrationData.kartuKeluarga = req.files.kartuKeluarga[0].path;
      if (req.files.aktaKelahiran) registrationData.aktaKelahiran = req.files.aktaKelahiran[0].path;
      if (req.files.suratKeterangan) registrationData.suratKeterangan = req.files.suratKeterangan[0].path;
    }

    const registration = await Registration.create(registrationData);
    res.status(201).json({ regNumber: registration.regNumber, data: registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRegistrationByRegNumber = async (req, res) => {
  try {
    const { regNumber } = req.params;
    const registration = await Registration.findOne({
      $or: [
        { regNumber: { $regex: new RegExp('^' + regNumber + '$', 'i') } },
        { nisn: regNumber }
      ]
    });

    if (registration) {
      res.json(registration);
    } else {
      res.status(404).json({ message: 'Registration not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (registration) {
      res.json(registration);
    } else {
      res.status(404).json({ message: 'Registration not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);

    if (registration) {
      res.json({ message: 'Registration deleted successfully' });
    } else {
      res.status(404).json({ message: 'Registration not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  getRegistrations,
  getRegistrationByRegNumber,
  updateStatus,
  deleteRegistration
};
