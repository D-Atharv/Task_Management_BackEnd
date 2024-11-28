import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';  
import { createTaskController, getAllTasksController, updateTaskController, deleteTaskController } from '../controllers/task.controller';

const router = Router();

router.post('/tasks', protect, createTaskController);  
router.get('/tasks', protect, getAllTasksController);  
router.put('/tasks/:id', protect, updateTaskController);  
router.delete('/tasks/:id', protect, deleteTaskController);  

export default router;
