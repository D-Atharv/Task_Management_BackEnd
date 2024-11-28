import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { createTaskController, getAllTasksController, updateTaskController, deleteTaskController, getTaskStatsController } from '../controllers/task.controller';
import { validateTask, validateRequest } from '../middlewares/validate.middleware';

const router = Router();

router
    .post('/tasks', protect, validateTask, validateRequest, createTaskController)
    .get('/tasks', protect, getAllTasksController)
    .put('/tasks/:id', protect, validateTask, validateRequest, updateTaskController)
    .delete('/tasks/:id', protect, deleteTaskController)
    .get('/tasks/stats', protect, getTaskStatsController);

export default router;
