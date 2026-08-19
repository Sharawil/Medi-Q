// Notification service for sending SMS/email alerts

/**
 * Send SMS notification
 * @param {string} phoneNumber - Patient phone number
 * @param {string} message - Message to send
 * @returns {Promise<boolean>} Success status
 */
const sendSMS = async (phoneNumber, message) => {
  // In a real implementation, this would integrate with an SMS provider like Twilio
  // For now, we'll simulate the behavior
  console.log(`SMS sent to ${phoneNumber}: ${message}`);
  return true;
};

/**
 * Send email notification
 * @param {string} email - Patient email
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @returns {Promise<boolean>} Success status
 */
const sendEmail = async (email, subject, body) => {
  // In a real implementation, this would integrate with an email service like SendGrid
  // For now, we'll simulate the behavior
  console.log(`Email sent to ${email}: ${subject} - ${body}`);
  return true;
};

/**
 * Send queue update notification to patient
 * @param {Object} patient - Patient object
 * @param {Object} queueToken - Queue token object
 * @param {string} messageType - Type of update (called, completed, etc.)
 * @returns {Promise<boolean>} Success status
 */
const sendQueueUpdateNotification = async (patient, queueToken, messageType) => {
  const messages = {
    called: `Your turn is coming up! Please proceed to the consultation room. Token: #${queueToken.tokenNumber}`,
    completed: `Your consultation is complete. Thank you for visiting Medi-Q. Token: #${queueToken.tokenNumber}`,
    cancelled: `Your appointment has been cancelled. Please reschedule if needed. Token: #${queueToken.tokenNumber}`,
    'no-show': `We noticed you missed your appointment. Please contact us to reschedule. Token: #${queueToken.tokenNumber}`
  };

  const message = messages[messageType] || `Update for your token #${queueToken.tokenNumber}`;

  // Try SMS first, then email as fallback
  if (patient.phone) {
    try {
      await sendSMS(patient.phone, message);
      return true;
    } catch (smsError) {
      console.warn('SMS failed, trying email:', smsError);
    }
  }

  if (patient.email) {
    try {
      await sendEmail(
        patient.email,
        `Medi-Q Queue Update`,
        message
      );
      return true;
    } catch (emailError) {
      console.warn('Email failed:', emailError);
    }
  }

  return false;
};

module.exports = {
  sendSMS,
  sendEmail,
  sendQueueUpdateNotification
};