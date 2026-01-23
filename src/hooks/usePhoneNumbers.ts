import { useState, useEffect } from "react";
import { PhoneNumber } from "@/types/chat";

const STORAGE_KEY = "chat_phone_numbers";

const DEFAULT_PHONES: PhoneNumber[] = [
  { id: "1", number: "+17409001511", label: "Primary" },
];

export function usePhoneNumbers() {
  const [phones, setPhones] = useState<PhoneNumber[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as PhoneNumber[];
        setPhones(parsed);
        if (parsed.length > 0) {
          setSelectedPhone(parsed[0].number);
        }
      } catch {
        setPhones(DEFAULT_PHONES);
        setSelectedPhone(DEFAULT_PHONES[0].number);
      }
    } else {
      setPhones(DEFAULT_PHONES);
      setSelectedPhone(DEFAULT_PHONES[0].number);
    }
  }, []);

  // Save to localStorage whenever phones change
  useEffect(() => {
    if (phones.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(phones));
    }
  }, [phones]);

  const addPhone = (number: string, label?: string) => {
    // Clean the number - ensure it has +1 prefix
    const cleanNumber = number.startsWith("+1") ? number : `+1${number.replace(/\D/g, "")}`;
    
    // Check if already exists
    if (phones.some((p) => p.number === cleanNumber)) {
      return false;
    }

    const newPhone: PhoneNumber = {
      id: Date.now().toString(),
      number: cleanNumber,
      label,
    };

    setPhones((prev) => [...prev, newPhone]);
    return true;
  };

  const removePhone = (id: string) => {
    setPhones((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      // If we removed the selected phone, select the first one
      if (selectedPhone && !updated.some((p) => p.number === selectedPhone)) {
        setSelectedPhone(updated[0]?.number || null);
      }
      return updated;
    });
  };

  return {
    phones,
    selectedPhone,
    setSelectedPhone,
    addPhone,
    removePhone,
  };
}
