import { Request, Response } from 'express';
import { hashPassword } from '../utils/helpers';
import { prisma } from '../config/prisma';
import { generateAuthToken } from '../utils/tokenUtils';

export const signUpController = async (req: Request, res: Response): Promise<void> => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required.' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ message: 'Invalid email format.' });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 characters long.' });
            return;
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            res.status(400).json({ message: 'Invalid email or password.' });
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
