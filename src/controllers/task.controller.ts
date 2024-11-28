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
