import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JSX, useContext, useEffect, useState } from "react";
import { columnsContext } from "@/app/page";
import { AlertDestructive } from "./ErrorAlert";
export function AddEditDialog({
  dialog_title,
  onSubmit,
  open,
  setOpen,
  fData,
}: {
  dialog_title: string;
  onSubmit: (data: object) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  fData?: object;
}) {
  const columns: Array<any> = useContext(columnsContext) || [];
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<{ [key: string]: any }>(fData || {});
  function validateForm(data: any) {
    const errors: { [key: string]: string } = {};

    if (!data.ticker || typeof data.ticker !== "string") {
      errors.ticker = "Ticker is required and must be a string.";
    }
    if (!data.timestamp || isNaN(Date.parse(data.timestamp))) {
      errors.timestamp = "Invalid timestamp format.";
    }
    if (isNaN(data.ask_price) || data.ask_price <= 0) {
      errors.ask_price = "Ask Price must be a positive number.";
    }
    if (isNaN(data.bid_price) || data.bid_price <= 0) {
      errors.bid_price = "Bid Price must be a positive number.";
    }
    if (isNaN(data.close_price) || data.close_price <= 0) {
      errors.close_price = "Close Price must be a positive number.";
    }
    if (isNaN(data.volume) || data.volume < 0) {
      errors.volume = "Volume must be a non-negative number.";
    }
    if (data.vva !== undefined && isNaN(data.vva)) {
      errors.vva = "VVA must be a number.";
    }
    return Object.keys(errors).length > 0 ? errors : null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  useEffect(() => {
    console.log(fData);
    setFormData(fData || {});
  }, [fData]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialog_title}</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {columns?.map((col: any) => (
            <div
              key={col.field}
              className="grid grid-cols-4 items-center gap-4"
            >
              <Label htmlFor={col.field} className="text-right">
                {col.headerName}
              </Label>
              {col.field == "timestamp" ? (
                <Input
                  type="datetime-local"
                  id={col.field}
                  className="col-span-3"
                  value={
                    formData[col.field]
                      ? new Date(formData[col.field]).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={handleChange}
                />
              ) : (
                <Input
                  type={col.field === "ticker" ? "text" : "number"}
                  id={col.field}
                  className="col-span-3"
                  value={formData[col.field] || ""}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter
          style={{
            display: "flex",
            gap: "1rem",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {error && <AlertDestructive message={error} />}
          <Button
            type="submit"
            onClick={() => {
              const errors = validateForm(formData);
              if (errors) {
                setError(Object.values(errors).join(" "));
                return;
              }

              onSubmit(formData);
              setFormData({});
              setOpen(false);
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default AddEditDialog;
