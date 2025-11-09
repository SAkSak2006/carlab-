const { validationResult } = require('express-validator');
const prisma = require('../config/database');

const requestsController = {
  // GET /api/requests - List all requests with optional filters
  listRequests: async (req, res, next) => {
    try {
      const { status, search, page = 1, limit = 50 } = req.query;

      const where = {};

      // Filter by status
      if (status && status !== 'all') {
        where.status = status;
      }

      // Search by request number or client name
      if (search) {
        where.OR = [
          { requestNumber: { contains: search } },
          { client: { firstName: { contains: search, mode: 'insensitive' } } },
          { client: { lastName: { contains: search, mode: 'insensitive' } } }
        ];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [requests, total] = await Promise.all([
        prisma.serviceRequest.findMany({
          where,
          include: {
            client: true,
            vehicle: true,
            works: true
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: parseInt(limit)
        }),
        prisma.serviceRequest.count({ where })
      ]);

      res.json({
        requests: requests.map(req => ({
          id: req.id,
          requestNumber: req.requestNumber,
          status: req.status,
          progressPercentage: req.progressPercentage,
          description: req.description,
          assignedMaster: req.assignedMaster,
          totalAmount: parseFloat(req.totalAmount),
          paymentStatus: req.paymentStatus,
          estimatedCompletion: req.estimatedCompletion,
          createdAt: req.createdAt,
          updatedAt: req.updatedAt,
          client: {
            id: req.client.id,
            firstName: req.client.firstName,
            lastName: req.client.lastName,
            phone: req.client.phone,
            email: req.client.email
          },
          vehicle: {
            id: req.vehicle.id,
            brand: req.vehicle.brand,
            model: req.vehicle.model,
            year: req.vehicle.year,
            licensePlate: req.vehicle.licensePlate
          },
          worksCount: req.works.length
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });

    } catch (error) {
      next(error);
    }
  },

  // GET /api/requests/:id - Get request details
  getRequest: async (req, res, next) => {
    try {
      const { id } = req.params;

      const request = await prisma.serviceRequest.findUnique({
        where: { id },
        include: {
          client: true,
          vehicle: true,
          works: {
            orderBy: { createdAt: 'asc' }
          },
          statusHistory: {
            orderBy: { createdAt: 'desc' },
            include: {
              user: {
                select: { fullName: true }
              }
            }
          }
        }
      });

      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      res.json({
        request: {
          id: request.id,
          requestNumber: request.requestNumber,
          trackingToken: request.trackingToken,
          status: request.status,
          progressPercentage: request.progressPercentage,
          description: request.description,
          assignedMaster: request.assignedMaster,
          totalAmount: parseFloat(request.totalAmount),
          paymentStatus: request.paymentStatus,
          estimatedCompletion: request.estimatedCompletion,
          createdAt: request.createdAt,
          updatedAt: request.updatedAt,
          client: request.client,
          vehicle: request.vehicle,
          works: request.works.map(work => ({
            id: work.id,
            workName: work.workName,
            quantity: parseFloat(work.quantity),
            unitPrice: parseFloat(work.unitPrice),
            totalPrice: parseFloat(work.totalPrice),
            createdAt: work.createdAt
          })),
          statusHistory: request.statusHistory.map(history => ({
            id: history.id,
            oldStatus: history.oldStatus,
            newStatus: history.newStatus,
            changedBy: history.user?.fullName || 'System',
            createdAt: history.createdAt
          }))
        }
      });

    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/requests/:id/status - Update request status
  updateStatus: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { status } = req.body;

      // Get current request
      const currentRequest = await prisma.serviceRequest.findUnique({
        where: { id }
      });

      if (!currentRequest) {
        return res.status(404).json({ error: 'Request not found' });
      }

      // Update request
      const updatedRequest = await prisma.serviceRequest.update({
        where: { id },
        data: {
          status,
          updatedAt: new Date()
        }
      });

      // Create status history entry
      await prisma.requestStatusHistory.create({
        data: {
          requestId: id,
          oldStatus: currentRequest.status,
          newStatus: status,
          changedBy: req.user.id
        }
      });

      res.json({
        success: true,
        request: {
          id: updatedRequest.id,
          status: updatedRequest.status,
          updatedAt: updatedRequest.updatedAt
        }
      });

    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/requests/:id/assign - Assign master
  assignMaster: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { masterName } = req.body;

      const updatedRequest = await prisma.serviceRequest.update({
        where: { id },
        data: {
          assignedMaster: masterName,
          updatedAt: new Date()
        }
      });

      res.json({
        success: true,
        request: {
          id: updatedRequest.id,
          assignedMaster: updatedRequest.assignedMaster,
          updatedAt: updatedRequest.updatedAt
        }
      });

    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/requests/:id/progress - Update progress percentage
  updateProgress: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { progress } = req.body;

      const updatedRequest = await prisma.serviceRequest.update({
        where: { id },
        data: {
          progressPercentage: progress,
          updatedAt: new Date()
        }
      });

      res.json({
        success: true,
        request: {
          id: updatedRequest.id,
          progressPercentage: updatedRequest.progressPercentage,
          updatedAt: updatedRequest.updatedAt
        }
      });

    } catch (error) {
      next(error);
    }
  },

  // POST /api/requests/:id/works - Add work item
  addWork: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { workName, quantity, unitPrice } = req.body;

      const totalPrice = parseFloat(quantity) * parseFloat(unitPrice);

      // Create work item
      const work = await prisma.requestWork.create({
        data: {
          requestId: id,
          workName,
          quantity: parseFloat(quantity),
          unitPrice: parseFloat(unitPrice),
          totalPrice
        }
      });

      // Recalculate total amount
      const allWorks = await prisma.requestWork.findMany({
        where: { requestId: id }
      });

      const totalAmount = allWorks.reduce((sum, w) => sum + parseFloat(w.totalPrice), 0);

      // Update request total amount
      await prisma.serviceRequest.update({
        where: { id },
        data: {
          totalAmount,
          updatedAt: new Date()
        }
      });

      res.status(201).json({
        success: true,
        work: {
          id: work.id,
          workName: work.workName,
          quantity: parseFloat(work.quantity),
          unitPrice: parseFloat(work.unitPrice),
          totalPrice: parseFloat(work.totalPrice),
          createdAt: work.createdAt
        },
        totalAmount
      });

    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/requests/:id/works/:workId - Delete work item
  deleteWork: async (req, res, next) => {
    try {
      const { id, workId } = req.params;

      // Delete work item
      await prisma.requestWork.delete({
        where: { id: workId }
      });

      // Recalculate total amount
      const allWorks = await prisma.requestWork.findMany({
        where: { requestId: id }
      });

      const totalAmount = allWorks.reduce((sum, w) => sum + parseFloat(w.totalPrice), 0);

      // Update request total amount
      await prisma.serviceRequest.update({
        where: { id },
        data: {
          totalAmount,
          updatedAt: new Date()
        }
      });

      res.json({
        success: true,
        totalAmount
      });

    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/requests/:id/payment - Update payment status
  updatePayment: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { paymentStatus } = req.body;

      const updatedRequest = await prisma.serviceRequest.update({
        where: { id },
        data: {
          paymentStatus,
          updatedAt: new Date()
        }
      });

      res.json({
        success: true,
        request: {
          id: updatedRequest.id,
          paymentStatus: updatedRequest.paymentStatus,
          updatedAt: updatedRequest.updatedAt
        }
      });

    } catch (error) {
      next(error);
    }
  }
};

module.exports = requestsController;
