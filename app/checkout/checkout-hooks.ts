"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type AddressSuggestion,
  type CheckoutErrors,
  type CheckoutField,
  type CheckoutFormValues,
  type ContactSuggestion,
  getContactSuggestions,
  getMockAddressSuggestions,
  initialCheckoutValues,
  validateCheckout,
} from "./checkout-utils";

type GooglePrediction = {
  description: string;
  place_id: string;
};

type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type GooglePlaceResult = {
  address_components?: GoogleAddressComponent[];
  formatted_address?: string;
  name?: string;
};

type GoogleAutocompleteService = {
  getPlacePredictions: (
    request: {
      input: string;
      componentRestrictions?: { country: string | string[] };
      types?: string[];
    },
    callback: (predictions: GooglePrediction[] | null) => void
  ) => void;
};

type GooglePlacesService = {
  getDetails: (
    request: { placeId: string; fields: string[] },
    callback: (place: GooglePlaceResult | null) => void
  ) => void;
};

type GoogleMapsWindow = Window & {
  google?: {
    maps?: {
      places?: {
        AutocompleteService: new () => GoogleAutocompleteService;
        PlacesService: new (node: HTMLDivElement) => GooglePlacesService;
      };
    };
  };
};

export type AddressOption = AddressSuggestion & {
  placeId?: string;
  source: "google" | "mock";
};

export function useCheckoutForm() {
  const [values, setValues] =
    useState<CheckoutFormValues>(initialCheckoutValues);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const setValue = useCallback(
    (field: CheckoutField, value: string) => {
      setValues((current) => ({ ...current, [field]: value }));

      if (submitted || errors[field]) {
        setErrors((current) => {
          const nextValues = { ...values, [field]: value };
          const nextErrors = validateCheckout(nextValues);
          return { ...current, [field]: nextErrors[field] };
        });
      }
    },
    [errors, submitted, values]
  );

  const applyContactSuggestion = useCallback((contact: ContactSuggestion) => {
    setValues((current) => ({
      ...current,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
    }));
    setErrors((current) => ({
      ...current,
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      phone: undefined,
    }));
  }, []);

  const applyAddressSuggestion = useCallback((address: AddressSuggestion) => {
    setValues((current) => ({
      ...current,
      address: address.address,
      city: address.city,
      emirate: address.emirate,
      postalCode: address.postalCode,
    }));
    setErrors((current) => ({
      ...current,
      address: undefined,
      city: undefined,
      emirate: undefined,
      postalCode: undefined,
    }));
  }, []);

  const validate = useCallback(() => {
    const nextErrors = validateCheckout(values);
    setSubmitted(true);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [values]);

  const contactSuggestions = useCallback(
    (field: keyof ContactSuggestion, value: string) =>
      getContactSuggestions(field, value),
    []
  );

  return {
    values,
    errors,
    setValue,
    validate,
    contactSuggestions,
    applyContactSuggestion,
    applyAddressSuggestion,
  };
}

export function useGoogleAddressAutocomplete(query: string) {
  const [googleOptions, setGoogleOptions] = useState<{
    query: string;
    options: AddressOption[];
  }>({ query: "", options: [] });
  const [googleReady, setGoogleReady] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const googleWindow = window as GoogleMapsWindow;
    return Boolean(googleWindow.google?.maps?.places);
  });

  const hasGooglePlaces = useCallback(() => {
    const googleWindow = window as GoogleMapsWindow;
    return Boolean(googleWindow.google?.maps?.places);
  }, []);

  const markGoogleReady = useCallback(() => {
    setGoogleReady(hasGooglePlaces());
  }, [hasGooglePlaces]);

  useEffect(() => {
    window.addEventListener("google-places-ready", markGoogleReady);

    return () => {
      window.removeEventListener("google-places-ready", markGoogleReady);
    };
  }, [markGoogleReady]);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      return;
    }

    if (!googleReady || !hasGooglePlaces()) {
      return;
    }

    const googleWindow = window as GoogleMapsWindow;
    const service =
      new googleWindow.google!.maps!.places!.AutocompleteService();

    service.getPlacePredictions(
      {
        input: trimmedQuery,
        componentRestrictions: { country: ["ae", "ca", "us"] },
        types: ["address"],
      },
      (predictions) => {
        const googleOptions = (predictions || []).slice(0, 5).map(
          (prediction): AddressOption => ({
            label: prediction.description,
            address: prediction.description,
            city: "",
            emirate: "",
            postalCode: "",
            placeId: prediction.place_id,
            source: "google",
          })
        );

        setGoogleOptions({ query: trimmedQuery, options: googleOptions });
      }
    );
  }, [googleReady, hasGooglePlaces, query]);

  const options = useMemo(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      return [];
    }

    // Keep checkout usable in local/dev environments where Google Places is not configured.
    const fallbackOptions = getMockAddressSuggestions(trimmedQuery).map(
      (suggestion) => ({ ...suggestion, source: "mock" as const })
    );

    if (!googleReady) {
      return fallbackOptions;
    }

    if (googleOptions.query === trimmedQuery && googleOptions.options.length) {
      return googleOptions.options;
    }

    return fallbackOptions;
  }, [googleOptions, googleReady, query]);

  const resolveGoogleAddress = useCallback(
    async (option: AddressOption): Promise<AddressSuggestion> => {
      if (option.source !== "google" || !option.placeId || !hasGooglePlaces()) {
        return option;
      }

      const googleWindow = window as GoogleMapsWindow;
      const placesNode = document.createElement("div");
      const service = new googleWindow.google!.maps!.places!.PlacesService(
        placesNode
      );

      return new Promise((resolve) => {
        service.getDetails(
          {
            placeId: option.placeId!,
            fields: ["address_components", "formatted_address", "name"],
          },
          (place) => {
            const components = place?.address_components || [];
            const findPart = (type: string) =>
              components.find((component) => component.types.includes(type))
                ?.long_name || "";
            const streetNumber = findPart("street_number");
            const route = findPart("route");
            const city =
              findPart("locality") ||
              findPart("postal_town") ||
              findPart("administrative_area_level_2");
            const emirate = findPart("administrative_area_level_1");
            const postalCode = findPart("postal_code");
            const address =
              [streetNumber, route].filter(Boolean).join(" ") ||
              place?.formatted_address ||
              option.address;

            resolve({
              label: place?.formatted_address || option.label,
              address,
              city,
              emirate,
              postalCode,
            });
          }
        );
      });
    },
    [hasGooglePlaces]
  );

  return useMemo(
    () => ({
      options,
      markGoogleReady,
      resolveGoogleAddress,
    }),
    [markGoogleReady, options, resolveGoogleAddress]
  );
}
