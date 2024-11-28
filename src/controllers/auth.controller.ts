import { Request, Response } from 'express';
import { comparePassword, hashPassword } from '../utils/helpers';
import { prisma } from '../config/prisma';
import { generateAuthToken } from '../utils/tokenUtils';

export const signUpController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            res.status(400).json({ message: 'User already exists with this email.' });
            return;
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        const token = generateAuthToken(newUser.id, email);

        res.status(201).json({
            message: 'User registered successfully.',
            token,
        });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'An error occurred during registration.' });
    }
};


export const loginController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            res.status(400).json({ message: 'Invalid credentials.' });
            return;
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid credentials.' });
            return;
        }

        const token = generateAuthToken(user.id, user.email);

        res.status(200).json({
            message: 'Login successful.',
            token,
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
};


export const getCurrentUserController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                // name: true, //TO ADD
                // createdAt: true,
                // updatedAt: true,
                // tasks: true, 
            },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User details retrieved successfully',
            user,
        });
    } catch (err) {
        console.error('Error fetching user details:', err);
        res.status(500).json({ message: 'An error occurred while retrieving user details' });
    }
};