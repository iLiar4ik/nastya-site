import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns"
import { cn } from "@/lib/utils"

interface CalendarProps {
  value?: Date
  onValueChange?: (date: Date) => void
  className?: string
}

export function Calendar({ value, onValueChange, className }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(value || new Date())
  const selectedDate = value

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get first day of week for the month
  const firstDayOfWeek = monthStart.getDay()
  const daysBeforeMonth = Array.from({ length: firstDayOfWeek }, (_, i) => null)

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  return (
    <div className={cn("rounded-md border p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePreviousMonth}
          className="p-1 hover:bg-accent rounded-md"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-accent rounded-md"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {daysBeforeMonth.map((_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}
        {daysInMonth.map((day) => {
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => onValueChange?.(day)}
              className={cn(
                "p-2 text-sm rounded-md hover:bg-accent transition-colors",
                isSelected && "bg-primary text-primary-foreground",
                !isCurrentMonth && "text-muted-foreground opacity-50"
              )}
            >
              {format(day, "d")}
            </button>
          )
        })}
      </div>
    </div>
  )
}

