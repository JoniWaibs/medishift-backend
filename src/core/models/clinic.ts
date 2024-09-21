export interface Clinic {
  name: string;
  contactInfo: {
    email: string;
    phone: {
      area: string;
      number: string;
    };
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
    };
  };
}
