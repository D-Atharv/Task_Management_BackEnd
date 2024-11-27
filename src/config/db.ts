import { prisma } from "./prisma";

export const connectDB = async (): Promise<void> => {
    try {
        await prisma.$connect();
        console.log('Database connected');
    }
    catch (err: unknown) {
        console.error(`Prisma connection error: ${(err as Error).message}`);
        process.exit(1);
    }
}