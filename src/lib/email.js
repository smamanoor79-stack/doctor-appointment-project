import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. Fires when patient submits the booking (payment still pending)
export async function sendBookingReceivedEmails(booking) {
  const { name, phone, email, service, date, timeSlot, reasonForVisit, bookingNumber } = booking;
  const ownerEmail = process.env.OWNER_EMAIL;

  // Notify clinic owner — needs to review payment proof
  await transporter.sendMail({
    from: `"Dr. Ahsan Malik Clinic" <${process.env.EMAIL_USER}>`,
    to: ownerEmail,
    subject: `New Booking Awaiting Review - ${bookingNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
        <h2 style="color: #1A4D42;">New Booking — Payment Review Needed</h2>
        <p><strong>Booking Number:</strong> ${bookingNumber}</p>
        <p><strong>Patient Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${timeSlot}</p>
        <p><strong>Reason for Visit:</strong> ${reasonForVisit || "N/A"}</p>
        <p style="margin-top:16px;">Please review the payment proof in the admin dashboard and approve or reject this booking.</p>
      </div>
    `,
  });

  // Let patient know it's received but not yet confirmed
  await transporter.sendMail({
    from: `"Dr. Ahsan Malik Clinic" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `We've Received Your Booking - ${bookingNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
        <h2 style="color: #1A4D42;">Booking Received</h2>
        <p>Dear ${name},</p>
        <p>We've received your appointment request and payment reference. Our team is verifying it now.</p>
        <p><strong>Booking Number:</strong> ${bookingNumber}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${timeSlot}</p>
        <p>You'll get a confirmation email once your payment is verified.</p>
        <p style="margin-top: 20px;">Main Branch — Gulshan-e-Iqbal, Karachi</p>
      </div>
    `,
  });
}

// 2. Fires only when admin clicks "Approve"
export async function sendApprovedEmail(booking) {
  const { name, email, service, date, timeSlot, bookingNumber } = booking;

  await transporter.sendMail({
    from: `"Dr. Ahsan Malik Clinic" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your Appointment is Confirmed - ${bookingNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
        <h2 style="color: #1A4D42;">Appointment Confirmed ✅</h2>
        <p>Dear ${name},</p>
        <p>Your payment has been verified and your appointment with <strong>Dr. Ahsan Malik</strong> is now confirmed.</p>
        <p><strong>Booking Number:</strong> ${bookingNumber}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${timeSlot}</p>
        <p>Please be ready 15 minutes before your appointment time.</p>
        <p style="margin-top: 20px;">Main Branch — Gulshan-e-Iqbal, Karachi</p>
        <p>Thank you for choosing Dr. Ahsan Malik's Clinic.</p>
      </div>
    `,
  });
}

// 3. Fires only when admin clicks "Reject"
export async function sendRejectedEmail(booking) {
  const { name, email, bookingNumber } = booking;

  await transporter.sendMail({
    from: `"Dr. Ahsan Malik Clinic" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Payment Issue - ${bookingNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
        <h2 style="color: #1A4D42;">We Couldn't Verify Your Payment</h2>
        <p>Dear ${name},</p>
        <p>We were unable to verify the payment for booking <strong>${bookingNumber}</strong>.</p>
        <p>Please contact us on WhatsApp so we can resolve this together.</p>
        <p style="margin-top: 20px;">Main Branch — Gulshan-e-Iqbal, Karachi</p>
      </div>
    `,
  });
}

// 4. Fires when a "Pay at Clinic" booking is created — no payment to verify
export async function sendClinicBookingConfirmedEmail(booking) {
  const { name, email, service, date, timeSlot, bookingNumber } = booking;

  await transporter.sendMail({
    from: `"Dr. Ahsan Malik Clinic" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your Appointment is Confirmed - ${bookingNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
        <h2 style="color: #1A4D42;">Appointment Confirmed ✅</h2>
        <p>Dear ${name},</p>
        <p>Your appointment with <strong>Dr. Ahsan Malik</strong> is confirmed. Payment is due in cash at the clinic.</p>
        <p><strong>Booking Number:</strong> ${bookingNumber}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${timeSlot}</p>
        <p>Please be ready 15 minutes before your appointment time.</p>
        <p style="margin-top: 20px;">Main Branch — Gulshan-e-Iqbal, Karachi</p>
      </div>
    `,
  });
}

// 5. Fires when admin replies to a contact form message
export async function sendContactReplyEmail({ name, email, originalMessage, replyText }) {
  await transporter.sendMail({
    from: `"Dr. Ahsan Malik Clinic" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Re: Your message to Dr. Ahsan Malik Clinic`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
        <h2 style="color: #1A4D42;">A Reply From Our Team</h2>
        <p>Dear ${name},</p>
        <p>${replyText.replace(/\n/g, "<br/>")}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #888; font-size: 12px;">Your original message: "${originalMessage}"</p>
        <p style="margin-top: 20px;">Main Branch — Gulshan-e-Iqbal, Karachi</p>
      </div>
    `,
  });
}