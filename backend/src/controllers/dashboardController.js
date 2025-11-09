const prisma = require('../config/database');

const dashboardController = {
  // GET /api/dashboard/stats - Get dashboard statistics
  getStats: async (req, res, next) => {
    try {
      // Get current date range (today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Execute all queries in parallel
      const [
        totalRequests,
        newRequests,
        inProgressRequests,
        completedRequests,
        cancelledRequests,
        todayRequests,
        todayRevenue,
        pendingRequests
      ] = await Promise.all([
        // Total requests
        prisma.serviceRequest.count(),

        // New requests
        prisma.serviceRequest.count({
          where: { status: 'new' }
        }),

        // In progress requests
        prisma.serviceRequest.count({
          where: { status: 'in_progress' }
        }),

        // Completed requests
        prisma.serviceRequest.count({
          where: { status: 'completed' }
        }),

        // Cancelled requests
        prisma.serviceRequest.count({
          where: { status: 'cancelled' }
        }),

        // Today's requests
        prisma.serviceRequest.count({
          where: {
            createdAt: {
              gte: today,
              lt: tomorrow
            }
          }
        }),

        // Today's revenue (completed today)
        prisma.serviceRequest.aggregate({
          where: {
            status: 'completed',
            updatedAt: {
              gte: today,
              lt: tomorrow
            }
          },
          _sum: {
            totalAmount: true
          }
        }),

        // Pending requests (new + in_progress with unpaid status)
        prisma.serviceRequest.count({
          where: {
            OR: [
              { status: 'new' },
              { status: 'in_progress' }
            ],
            paymentStatus: 'unpaid'
          }
        })
      ]);

      // Recent requests (last 10)
      const recentRequests = await prisma.serviceRequest.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          client: true,
          vehicle: true
        }
      });

      res.json({
        stats: {
          totalRequests,
          requestsByStatus: {
            new: newRequests,
            in_progress: inProgressRequests,
            completed: completedRequests,
            cancelled: cancelledRequests
          },
          todayRequests,
          todayRevenue: parseFloat(todayRevenue._sum.totalAmount || 0),
          pendingRequests
        },
        recentRequests: recentRequests.map(req => ({
          id: req.id,
          requestNumber: req.requestNumber,
          status: req.status,
          clientName: `${req.client.firstName} ${req.client.lastName || ''}`.trim(),
          vehicle: `${req.vehicle.brand} ${req.vehicle.model}`,
          totalAmount: parseFloat(req.totalAmount),
          createdAt: req.createdAt
        }))
      });

    } catch (error) {
      next(error);
    }
  }
};

module.exports = dashboardController;
