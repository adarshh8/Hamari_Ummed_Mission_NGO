const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Volunteer = require('../models/Volunteer');
const Donation = require('../models/Donation');
const Activity = require('../models/Activity');
const Event = require('../models/Event');
const RewardedChild = require('../models/RewardedChild');
const Contact = require('../models/Contact');

// @desc    Get platform stats
// @route   GET /api/v1/stats
// @access  Public
exports.getStats = asyncHandler(async (req, res) => {
  // Aggregate total donations
  const totalDonations = await Donation.aggregate([
    { $match: { status: { $in: ['confirmed', 'received'] } } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  // Aggregate stats for dashboard
  const childrenHelped = await RewardedChild.countDocuments();
  const activeVolunteers = await Volunteer.countDocuments({ status: 'approved' });
  const pendingVolunteers = await Volunteer.countDocuments({ status: 'pending' });
  const upcomingEvents = await Event.countDocuments({ status: 'upcoming' });
  const pendingMessages = await Contact.countDocuments({ status: 'new' });
  
  // Activity counts
  const totalActivities = await Activity.countDocuments();
  
  // Calculate specific "Books Distributed" (This might be a field in Activity or just a mock for now if no specific model)
  // For now, let's use a real sum if available or a calculated value
  const activities = await Activity.find();
  const booksDistributed = activities.reduce((sum, act) => sum + (act.stats?.booksDistributed || 0), 0);

  res.status(200).json({
    success: true,
    data: {
      livesImpacted: childrenHelped + totalDonations.length, // Only count confirmed helped children + donors as impact
      activeProjects: totalActivities,
      countries: 1, // Focus is Orai/India
      yearsOfService: 1, // New platform
      fundsRaised: totalDonations[0]?.total || 0,
      partnerOrgs: 0,
      
      // Admin specific stats
      childrenHelped,
      booksDistributed: booksDistributed || 0, 
      donationsThisMonth: totalDonations[0]?.total || 0, // Simplified for now
      activeVolunteers,
      upcomingEvents,
      pendingActions: pendingVolunteers + pendingMessages
    }
  });
});
