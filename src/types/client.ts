export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    whatsapp?: string;
    company: string;
    socials: {
        instagram?: string;
        linkedin?: string;
        twitter?: string;
    };
    createdAt: string;
    updatedAt: string;
}
