import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneNumber } from "@/types/chat";
import { Phone, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhoneSelectorProps {
  phones: PhoneNumber[];
  selectedPhone: string | null;
  onSelect: (phone: string) => void;
  onAdd: (number: string, label?: string) => boolean;
  onRemove: (id: string) => void;
}

function formatPhoneDisplay(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function PhoneSelector({
  phones,
  selectedPhone,
  onSelect,
  onAdd,
  onRemove,
}: PhoneSelectorProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const { toast } = useToast();

  const handleAdd = () => {
    if (!newNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    const success = onAdd(newNumber, newLabel || undefined);
    if (success) {
      setNewNumber("");
      setNewLabel("");
      setIsAddDialogOpen(false);
      toast({
        title: "Phone added",
        description: "The phone number has been added successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "This phone number already exists",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-muted-foreground" />
        <Select value={selectedPhone || ""} onValueChange={onSelect}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select phone..." />
          </SelectTrigger>
          <SelectContent>
            {phones.map((phone) => (
              <SelectItem key={phone.id} value={phone.number}>
                <div className="flex items-center justify-between w-full">
                  <span>
                    {phone.label
                      ? `${phone.label} - ${formatPhoneDisplay(phone.number)}`
                      : formatPhoneDisplay(phone.number)}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsAddDialogOpen(true)}
          title="Add phone number"
        >
          <Plus className="h-4 w-4" />
        </Button>
        {selectedPhone && phones.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const phone = phones.find((p) => p.number === selectedPhone);
              if (phone) onRemove(phone.id);
            }}
            title="Remove phone number"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Phone Number</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="7409001511"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter the 10-digit phone number (without +1)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Label (optional)</Label>
              <Input
                id="label"
                placeholder="e.g., Work, Personal"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
