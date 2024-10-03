export interface ContactInfo {
  email: string;
  phone: {
    countryCod?: string;
    area: string;
    number: string;
  };
  address?: {
    street?: string;
    city?: string;
    province?: string;
    country?: string;
  };
}

export interface EmergencyContactInfo {
  name: string;
  relation: string; // Relation to the patient (e.g., spouse, parent, friend)
  phone: {
    countryCod?: string;
    area: string;
    number: string;
  };
}
