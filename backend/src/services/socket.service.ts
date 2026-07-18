import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { logger } from '../config/logger';

let io: SocketIOServer;

export const initSocketService = (socketIo: SocketIOServer): void => {
  io = socketIo;

  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; role: string };
      socket.data.userId = decoded.userId;
      socket.data.role = decoded.role;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const { userId, role } = socket.data;
    logger.info(`Socket connected: ${userId} (${role})`);

    // Join personal room
    socket.join(`user:${userId}`);

    // Join role-based rooms
    if (role === 'kitchen_staff') socket.join('kitchen');
    if (role === 'admin') { socket.join('kitchen'); socket.join('admin'); }
    if (role === 'delivery_partner') socket.join('delivery');

    // Delivery partner location updates
    socket.on('location_update', (data: { lat: number; lng: number; orderId: string }) => {
      io.to(`order:${data.orderId}`).emit('delivery_location', {
        lat: data.lat,
        lng: data.lng,
        timestamp: new Date(),
      });
    });

    // Customer tracking a specific order
    socket.on('track_order', (orderId: string) => {
      socket.join(`order:${orderId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${userId}`);
    });
  });
};

export const getIO = (): SocketIOServer => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};

// Emit helper functions
export const emitToUser = (userId: string, event: string, data: unknown): void => {
  io.to(`user:${userId}`).emit(event, data);
};

export const emitToKitchen = (event: string, data: unknown): void => {
  io.to('kitchen').emit(event, data);
};

export const emitToDelivery = (partnerId: string, event: string, data: unknown): void => {
  io.to(`user:${partnerId}`).emit(event, data);
};
