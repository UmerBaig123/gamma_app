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
  const [formData, setFormData] = useState<{ [key: string]: any }>(fData || {});

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
                  id={col.field}
                  className="col-span-3"
                  value={formData[col.field] || ""}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              onSubmit(formData);
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
