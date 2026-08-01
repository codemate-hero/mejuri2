export type CheckoutField =
  | "email"
  | "firstName"
  | "lastName"
  | "address"
  | "city"
  | "emirate"
  | "postalCode"
  | "phone";

export type CheckoutFormValues = Record<CheckoutField, string>;

export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

export type ContactSuggestion = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type AddressSuggestion = {
  label: string;
  address: string;
  city: string;
  emirate: string;
  postalCode: string;
};

export const initialCheckoutValues: CheckoutFormValues = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  emirate: "",
  postalCode: "",
  phone: "",
};

// Mock contacts stand in for the browser Contact Picker API, which is limited
// to supported browsers and requires a user gesture before it can open.
export const mockContactSuggestions: ContactSuggestion[] = [
  // {
  //   firstName: "Maya",
  //   lastName: "Khan",
  //   email: "maya.khan@example.com",
  //   phone: "971501234567",
  // },
  // {
  //   firstName: "Aisha",
  //   lastName: "Rahman",
  //   email: "aisha.rahman@example.com",
  //   phone: "971551112233",
  // },
  // {
  //   firstName: "Noor",
  //   lastName: "Ali",
  //   email: "noor.ali@example.com",
  //   phone: "971522223344",
  // },
];

export const mockAddressSuggestions: AddressSuggestion[] = [
  {
    label: "Dubai Mall, Downtown Dubai, Dubai",
    address: "Dubai Mall, Downtown Dubai",
    city: "Dubai",
    emirate: "Dubai",
    postalCode: "00000",
  },
  {
    label: "Marina Mall, Dubai Marina, Dubai",
    address: "Marina Mall, Dubai Marina",
    city: "Dubai",
    emirate: "Dubai",
    postalCode: "00000",
  },
  {
    label: "Yas Mall, Yas Island, Abu Dhabi",
    address: "Yas Mall, Yas Island",
    city: "Abu Dhabi",
    emirate: "Abu Dhabi",
    postalCode: "00000",
  },
];

export function validateCheckout(values: CheckoutFormValues): CheckoutErrors {
  const errors: CheckoutErrors = {};
  const phoneDigits = values.phone.replace(/\D/g, "");

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.firstName.trim()) {
    errors.firstName = "First name is required.";
  }

  if (!values.lastName.trim()) {
    errors.lastName = "Last name is required.";
  }

  if (!values.address.trim()) {
    errors.address = "Address is required.";
  }

  if (!values.city.trim()) {
    errors.city = "City is required.";
  }

  if (!values.emirate.trim()) {
    errors.emirate = "State is required.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (phoneDigits !== values.phone.trim()) {
    errors.phone = "Use numbers only.";
  } else if (phoneDigits.length < 7 || phoneDigits.length > 15) {
    errors.phone = "Enter a valid phone number.";
  }

  return errors;
}

export function getContactSuggestions(
  field: keyof ContactSuggestion,
  value: string
) {
  const query = value.trim().toLowerCase();

  if (!query) {
    return mockContactSuggestions;
  }

  return mockContactSuggestions.filter((contact) =>
    contact[field].toLowerCase().includes(query)
  );
}

export function getMockAddressSuggestions(value: string) {
  const query = value.trim().toLowerCase();

  if (!query) {
    return [];
  }

  return mockAddressSuggestions.filter((suggestion) =>
    suggestion.label.toLowerCase().includes(query)
  );
}
