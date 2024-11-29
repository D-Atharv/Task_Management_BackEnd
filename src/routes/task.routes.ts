import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { createTaskController, getAllTasksController, updateTaskController, deleteTaskController, getTaskStatsController } from '../controllers/task.controller';
import {  validateRequest } from '../middlewares/validate.middleware';

const router = Router();

router
    .post('/create', protect, validateRequest, createTaskController)
    .get('/tasks', protect, getAllTasksController)
    .put('/tasks/:id', protect, validateRequest, updateTaskController)
    .delete('/tasks/:id', protect, deleteTaskController)
    .get('/tasks/stats', protect, getTaskStatsController);

export default router;
