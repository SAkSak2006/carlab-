const { validationResult } = require('express-validator');
const prisma = require('../config/database');
const generateRequestNumber = require('../utils/generateRequestNumber');
const generateTrackingToken = require('../utils/generateToken');

const publicController = {
  // POST /api/public/requests - Create new request from landing page
  createRequest: async (req, res, next) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { client, vehicle, description } = req.body;

      // Generate unique request number and tracking token
      let requestNumber;
      let isUnique = false;

      // Ensure unique request number
      while (!isUnique) {
        requestNumber = generateRequestNumber();
        const existing = await prisma.serviceRequest.findUnique({
          where: { requestNumber }
        });
        if (!existing) isUnique = true;
      }

      const trackingToken = generateTrackingToken();

      // Create client (or find existing by phone)
      let clientRecord = await prisma.client.findFirst({
        where: { phone: client.phone }
      });

      if (!clientRecord) {
        clientRecord = await prisma.client.create({
          data: {
            firstName: client.firstName,
            lastName: client.lastName || null,
            phone: client.phone,
            email: client.email || null
          }
        });
      }

      // Create vehicle
      const vehicleRecord = await prisma.vehicle.create({
        data: {
          clientId: clientRecord.id,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year || null,
          vin: vehicle.vin || null,
          licensePlate: vehicle.licensePlate || null
        }
      });

      // Create service request
      const request = await prisma.serviceRequest.create({
        data: {
          requestNumber,
          trackingToken,
          clientId: clientRecord.id,
          vehicleId: vehicleRecord.id,
          description,
          status: 'new',
          progressPercentage: 0,
          totalAmount: 0,
          paymentStatus: 'unpaid'
        },
        include: {
          client: true,
          vehicle: true
        }
      });

      // Create initial status history
      await prisma.requestStatusHistory.create({
        data: {
          requestId: request.id,
          oldStatus: null,
          newStatus: 'new',
          changedBy: null
        }
      });

      // Generate tracking URL
      const trackingUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/track/${trackingToken}`;

      res.status(201).json({
        success: true,
        requestNumber,
        trackingToken,
        trackingUrl,
        message: 'Заявка успешно создана'
      });

    } catch (error) {
      next(error);
    }
  },

  // GET /api/public/track/:token - Track request by token
  trackRequest: async (req, res, next) => {
    try {
      const { token } = req.params;

      const request = await prisma.serviceRequest.findUnique({
        where: { trackingToken: token },
        include: {
          client: true,
          vehicle: true,
          works: true,
          statusHistory: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!request) {
        return res.status(404).json({ error: 'Заявка не найдена' });
      }

      res.json({
        request: {
          requestNumber: request.requestNumber,
          status: request.status,
          progressPercentage: request.progressPercentage,
          description: request.description,
          assignedMaster: request.assignedMaster,
          totalAmount: parseFloat(request.totalAmount),
          paymentStatus: request.paymentStatus,
          estimatedCompletion: request.estimatedCompletion,
          createdAt: request.createdAt,
          client: {
            firstName: request.client.firstName,
            lastName: request.client.lastName,
            phone: request.client.phone
          },
          vehicle: {
            brand: request.vehicle.brand,
            model: request.vehicle.model,
            year: request.vehicle.year,
            licensePlate: request.vehicle.licensePlate
          },
          works: request.works.map(work => ({
            id: work.id,
            workName: work.workName,
            quantity: parseFloat(work.quantity),
            unitPrice: parseFloat(work.unitPrice),
            totalPrice: parseFloat(work.totalPrice)
          })),
          statusHistory: request.statusHistory.map(history => ({
            oldStatus: history.oldStatus,
            newStatus: history.newStatus,
            createdAt: history.createdAt
          }))
        }
      });

    } catch (error) {
      next(error);
    }
  },

  // GET /api/public/track/number/:requestNumber - Track by number
  trackByNumber: async (req, res, next) => {
    try {
      const { requestNumber } = req.params;

      const request = await prisma.serviceRequest.findUnique({
        where: { requestNumber },
        include: {
          client: true,
          vehicle: true,
          works: true,
          statusHistory: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!request) {
        return res.status(404).json({ error: 'Заявка не найдена' });
      }

      // Return same format as trackRequest
      res.json({
        request: {
          requestNumber: request.requestNumber,
          status: request.status,
          progressPercentage: request.progressPercentage,
          description: request.description,
          assignedMaster: request.assignedMaster,
          totalAmount: parseFloat(request.totalAmount),
          paymentStatus: request.paymentStatus,
          estimatedCompletion: request.estimatedCompletion,
          createdAt: request.createdAt,
          client: {
            firstName: request.client.firstName,
            lastName: request.client.lastName,
            phone: request.client.phone
          },
          vehicle: {
            brand: request.vehicle.brand,
            model: request.vehicle.model,
            year: request.vehicle.year,
            licensePlate: request.vehicle.licensePlate
          },
          works: request.works.map(work => ({
            id: work.id,
            workName: work.workName,
            quantity: parseFloat(work.quantity),
            unitPrice: parseFloat(work.unitPrice),
            totalPrice: parseFloat(work.totalPrice)
          })),
          statusHistory: request.statusHistory.map(history => ({
            oldStatus: history.oldStatus,
            newStatus: history.newStatus,
            createdAt: history.createdAt
          }))
        }
      });

    } catch (error) {
      next(error);
    }
  }
};

module.exports = publicController;
