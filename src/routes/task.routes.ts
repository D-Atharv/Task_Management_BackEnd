import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { createTaskController, getAllTasksController, updateTaskController, deleteTaskController, getTaskStatsController } from '../controllers/task.controller';
import {  validateRequest } from '../middlewares/validate.middleware';

const router = Router();

router
    .post('/create', protect, validateRequest, createTaskController)
    .get('/getAll', protect, getAllTasksController)
    .put('/:id', protect, validateRequest, updateTaskController)
    .delete('/:id', protect, deleteTaskController)
    .get('/tasks/stats', protect, getTaskStatsController);

export default router;
