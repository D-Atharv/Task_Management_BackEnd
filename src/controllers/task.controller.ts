import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const createTaskController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, startTime, endTime, priority, status } = req.body;
        const userId = req.user!.id;

        const newTask = await prisma.task.create({
            data: {
                title,
                startTime,
                endTime,
                priority,
                status,
                userId,
            },
        });

        res.status(201).json(newTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating task' });
    }
};


export const getAllTasksController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;

        const tasks = await prisma.task.findMany({
            where: { userId },
        });

        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

export const updateTaskController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;
        const { title, startTime, endTime, priority, status } = req.body;

        const task = await prisma.task.findUnique({
            where: { id },
        });

        if (!task || task.userId !== userId) {
            res.status(404).json({ message: 'Task not found or not authorized to update' });
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                title,
                startTime,
                endTime,
                priority,
                status,
            },
        });

        res.status(200).json(updatedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating task' });
    }
};

export const deleteTaskController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        const task = await prisma.task.findUnique({
            where: { id },
        });

        if (!task || task.userId !== userId) {
            res.status(404).json({ message: 'Task not found or not authorized to delete' });
        }

        await prisma.task.delete({
            where: { id },
        });

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting task' });
    }
};

export const getTaskStatsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;

        const tasks = await prisma.task.findMany({ where: { userId } });

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'finished').length;
        const pendingTasks = tasks.filter(task => task.status === 'pending').length;

        const completedPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        const pendingPercentage = totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0;

        const now = new Date().getTime();

        let timeLapsed = 0;
        let estimatedTimeLeft = 0;
        let totalCompletionTime = 0;
        let completedTaskCount = 0;

        tasks.forEach(task => {
            const taskStartTime = new Date(task.startTime).getTime();

            if (task.status === 'pending') {
                timeLapsed += Math.max(now - taskStartTime, 0);

                if (task.endTime) {
                    const taskEndTime = new Date(task.endTime).getTime();
                    estimatedTimeLeft += Math.max(taskEndTime - now, 0);
                }
            } else if (task.status === 'finished' && task.endTime) {
                const taskEndTime = new Date(task.endTime).getTime();
                totalCompletionTime += taskEndTime - taskStartTime;
                completedTaskCount++;
            }
        });

        timeLapsed /= 1000 * 60 * 60;
        estimatedTimeLeft /= 1000 * 60 * 60;

        const avgCompletionTime = completedTaskCount > 0
            ? (totalCompletionTime / completedTaskCount) / (1000 * 60 * 60)
            : 0;

        res.status(200).json({
            totalTasks,
            completedPercentage,
            pendingPercentage,
            timeLapsed: timeLapsed.toFixed(2),
            estimatedTimeLeft: estimatedTimeLeft.toFixed(2),
            avgCompletionTime: avgCompletionTime.toFixed(2),
        });
    } catch (err) {
        console.error('Error fetching task stats:', err);
        res.status(500).json({ message: 'Error fetching task statistics' });
    }
};
