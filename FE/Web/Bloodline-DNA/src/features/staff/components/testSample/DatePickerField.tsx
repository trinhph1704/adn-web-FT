import { CalendarIcon } from "lucide-react";
import { Button } from "../sample/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { cn } from "../../../../lib/utils";
import { format } from "date-fns";
import { Calendar } from "../../../../components/ui/calendar";

export default function DatePickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Date;
  onChange: (v: Date) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-500 font-medium">{label}</label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full h-10 justify-start text-left font-normal bg-white text-black border-gray-300 shadow-sm hover:bg-gray-100"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-gray-600" />
            {value ? format(value, "dd/MM/yyyy") : "Chọn ngày"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 bg-white shadow-lg border border-gray-200 rounded-md">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => date && onChange(date)}
            className="rounded-md bg-white text-gray-800"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
