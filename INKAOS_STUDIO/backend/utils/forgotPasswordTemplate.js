const forgotPasswordTemplate = ({ name, otp }) => {
    return `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <h2>Hi ${name},</h2>
        <p>You requested to reset your password. Use the OTP code below to reset your password:</p>
        <h3 style="background-color: #f8f9fa; padding: 10px; border-radius: 5px; display: inline-block;">
            ${otp}
        </h3>
        <p>This OTP will expire in an hour.</p>
        <br>
        <p>If you did not request this, please ignore this email.</p>
        <br>
        <p>Best regards,<br>InkAos Studio</p>
      </div>
    `
  }
export default forgotPasswordTemplate