
const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const { protect } = require('../middleware/authMiddleware');

const endpoints = [
  { path: 'news', controller: apiController.news },
  { path: 'teachers', controller: apiController.teachers },
  { path: 'gallery', controller: apiController.gallery },
  { path: 'agendas', controller: apiController.agendas },
  { path: 'downloads', controller: apiController.downloads },
  { path: 'books', controller: apiController.books },
  { path: 'students', controller: apiController.students },
  { path: 'alumni', controller: apiController.alumni },
  { path: 'activity-logs', controller: apiController.activityLogs },
  { path: 'feedbacks', controller: apiController.feedbacks },
];

endpoints.forEach(({ path, controller }) => {
  // Public GET
  router.get(`/${path}`, controller.getAll);
  router.get(`/${path}/:id`, controller.getById);
  
  // Protected POST, PUT, DELETE
  router.post(`/${path}`, protect, controller.create);
  router.put(`/${path}/:id`, protect, controller.update);
  router.delete(`/${path}/:id`, protect, controller.delete);
});

module.exports = router;
