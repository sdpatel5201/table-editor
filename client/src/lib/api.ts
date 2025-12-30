import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

const API_BASE_URL = "https://685013d7e7c42cfd17974a33.mockapi.io";

// Schemas
export const TaxSchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string(),
  // Add other fields that might be in the API but we focus on name/country for editing
  createdAt: z.string().optional(),
  avatar: z.string().optional(),
});

export const CountrySchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string().optional(),
});

export type Tax = z.infer<typeof TaxSchema>;
export type Country = z.infer<typeof CountrySchema>;

// API Functions
export const fetchTaxes = async (): Promise<Tax[]> => {
  const response = await fetch(`${API_BASE_URL}/taxes`);
  if (!response.ok) {
    throw new Error("Failed to fetch taxes");
  }
  return response.json();
};

export const fetchCountries = async (): Promise<Country[]> => {
  const response = await fetch(`${API_BASE_URL}/countries`);
  if (!response.ok) {
    throw new Error("Failed to fetch countries");
  }
  return response.json();
};

export const updateTax = async (data: Tax): Promise<Tax> => {
  const response = await fetch(`${API_BASE_URL}/taxes/${data.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update tax");
  }
  return response.json();
};
