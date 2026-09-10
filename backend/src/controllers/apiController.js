
const News = require('../models/News');
const Teacher = require('../models/Teacher');
const Gallery = require('../models/Gallery');
const Agenda = require('../models/Agenda');
const Download = require('../models/Download');
const Book = require('../models/Book');
const Student = require('../models/Student');
const Alumni = require('../models/Alumni');
const ActivityLog = require('../models/ActivityLog');
const Feedback = require('../models/Feedback');

// Helper to handle async routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Generic CRUD factory
const createCrudController = (Model) => {
  return {
    getAll: asyncHandler(async (req, res) => {
      const data = await Model.find();
      res.json(data);
    }),
    getById: asyncHandler(async (req, res) => {
      const data = await Model.findById(req.params.id);
      if (!data) return res.status(404).json({ message: 'Not found' });
      res.json(data);
    }),
    create: asyncHandler(async (req, res) => {
      const data = new Model(req.body);
      const saved = await data.save();
      res.status(201).json(saved);
    }),
    update: asyncHandler(async (req, res) => {
      const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: 'Not found' });
      res.json(updated);
    }),
    delete: asyncHandler(async (req, res) => {
      const deleted = await Model.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted successfully' });
    })
  };
};

module.exports = {
  news: createCrudController(News),
  teachers: createCrudController(Teacher),
  gallery: createCrudController(Gallery),
  agendas: createCrudController(Agenda),
  downloads: createCrudController(Download),
  books: createCrudController(Book),
  students: createCrudController(Student),
  alumni: createCrudController(Alumni),
  activityLogs: createCrudController(ActivityLog),
  feedbacks: createCrudController(Feedback),
};
