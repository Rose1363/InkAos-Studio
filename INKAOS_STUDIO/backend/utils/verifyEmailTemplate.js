const verifyEmailTemplate = ({name, url})=>{
    return `
       <p>Dear ${name},</p>
        <p>Thank you for registering with InkAos Studio.</p>
        <a href="${url}" style="color:white; margin-top:10px; padding:20px;">
            Verify Email
        </a>
        `
    
}

export default verifyEmailTemplate