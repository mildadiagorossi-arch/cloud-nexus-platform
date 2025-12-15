import emailjs from '@emailjs/browser';

// These should be in environment variables
const SERVICE_ID = "service_mock_id";
const TEMPLATE_ID_ORDER = "template_order";
const TEMPLATE_ID_CONTACT = "template_contact";
const PUBLIC_KEY = "user_mock_key";

export const EmailService = {
    init: () => {
        emailjs.init(PUBLIC_KEY);
    },

    sendOrderConfirmation: async (email: string, orderId: string, amount: number, items: { name: string; quantity: number }[]) => {
        // In a real scenario, we would send this data to EmailJS
        console.log('Sending email to:', email);

        // Simulating API Call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`[EmailService] Order Confirmation sent to ${email} for Order #${orderId}`);
                resolve({ status: 200, text: 'OK' });
            }, 1000);
        });

        /* Real implementation would look like:
        return emailjs.send(SERVICE_ID, TEMPLATE_ID_ORDER, {
            to_email: email,
            order_id: orderId,
            amount: amount,
            items_list: items.map(i => `${i.quantity}x ${i.name}`).join('\n')
        });
        */
    },

    sendContactForm: async (data: { name: string, email: string, message: string }) => {
        console.log('Sending contact form:', data);
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`[EmailService] Contact message sent from ${data.email}`);
                resolve({ status: 200, text: 'OK' });
            }, 800);
        });
    }
};
