const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// @desc    Create a donation order
// @route   POST /api/v1/donations
// @access  Public
exports.createDonation = asyncHandler(async (req, res) => {
  const { donor, amount, campaign, isAnonymous, message } = req.body;

  // Verify campaign if provided
  if (campaign) {
    const camp = await Campaign.findById(campaign);
    if (!camp) {
      res.status(404);
      throw new Error(`Campaign not found`);
    }
  }

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy'
  });

  const options = {
    amount: amount * 100, // amount in the smallest currency unit (paise)
    currency: "INR",
    receipt: `rcptid_${Date.now()}`
  };

  try {
    const order = await instance.orders.create(options);
    
    // Save preliminary donation record
    const donation = await Donation.create({
      donor: { ...donor, isAnonymous },
      amount,
      campaign,
      message,
      transactionId: order.id,
      status: 'pending'
    });

    res.status(200).json({
      success: true,
      data: { order, donationId: donation._id }
    });
  } catch (error) {
    res.status(500);
    throw new Error('Payment gateway error');
  }
});

// @desc    Verify payment and update donation status
// @route   POST /api/v1/donations/verify
// @access  Public
exports.verifyDonation = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationId } = req.body;

  const text = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy')
    .update(text.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error('Invalid signature');
  }

  const donation = await Donation.findById(donationId);
  if (!donation) {
    res.status(404);
    throw new Error('Donation not found');
  }

  donation.status = 'success';
  await donation.save();

  // Update campaign raised amount if applicable
  if (donation.campaign) {
    const campaign = await Campaign.findById(donation.campaign);
    campaign.raisedAmount += donation.amount;
    campaign.donorCount += 1;
    await campaign.save();
  }

  // Send Email receipt
  try {
    await sendEmail({
      email: donation.donor.email,
      subject: 'Thank you for your donation - Hamari Ummeed Mission',
      message: `<h1>Thank You!</h1><p>We received your donation of ₹${donation.amount}. Your receipt number is ${donation.receiptNumber}.</p>`
    });
  } catch (err) {
    console.error('Email could not be sent', err);
  }

  res.status(200).json({ success: true, data: donation });
});

// @desc    Get all donations
// @route   GET /api/v1/donations
// @access  Private/Admin
exports.getDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find().populate('campaign', 'title');
  res.status(200).json({ success: true, count: donations.length, data: donations });
});


