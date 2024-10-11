export interface ContactInfo {
  email?: string;
  phone: {
    countryCode?: string;
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
  name?: string;
  relation?: string; // Relation to the patient (e.g., spouse, parent, friend)
  contactInfo: ContactInfo;
}
