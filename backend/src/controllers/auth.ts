import { Request, Response } from "express";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "fallback", { expiresIn: "30d" });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, login, password, role } = req.body;
        const existing = await prisma.user.findUnique({ where: { login } });
        if (existing) return res.status(400).json({ message: "Bu login band, boshqasini kiriting" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 1 month subscription

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                login,
                password: hashedPassword,
                role: role || "FREE",
                subscriptionExpiresAt: expiresAt,
            },
            select: { id: true, firstName: true, lastName: true, role: true }
        });

        return res.status(201).json({ user, token: generateToken(user.id) });
    } catch (error) {
        return res.status(500).json({ error: "Ro'yxatdan o'tishda xatolik yuz berdi" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { login, password } = req.body;
        const user = await prisma.user.findUnique({ where: { login } });

        if (!user) return res.status(401).json({ message: "Noto'g'ri login parol" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Noto'g'ri login parol" });

        return res.json({
            user: { id: user.id, firstName: user.firstName, lastName: user.lastName, role: user.role },
            token: generateToken(user.id)
        });
    } catch (error) {
        return res.status(500).json({ error: "Tizimga kirishda xatolik yuz berdi" });
    }
};

export const me = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, firstName: true, lastName: true, login: true, role: true, generationsCount: true }
        });
        return res.json({ user });
    } catch (error) {
        return res.status(500).json({ error: "Me error" });
    }
};
