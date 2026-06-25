import transporter from '../config/nodemailer';

const sendMail = async (email: string, subject: string, htmlContent?: string) => {
    const mailOptions = {
        from: ' "Brijesh Singh" <rishiagarwal2k3@gmail.com>',
        to: email,
        subject,
        html: htmlContent || undefined, // Use HTML if provided, otherwise undefined
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        throw new Error('Error sending email');
    }
};

export default sendMail;
