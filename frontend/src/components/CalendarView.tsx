// Define the schedule data structure
type ScheduleBlock = {
  day: number; // 0-6 for days of week
  startTime: string;
  endTime: string;
};

export function CalendarView() {
  // Sample schedule data
  const scheduleBlocks: ScheduleBlock[] = [
    { day: 0, startTime: "7:30", endTime: "8:30" }, // Monday 7:30-8:30
    { day: 0, startTime: "11:30", endTime: "13:00" }, // Monday 11:30-13:00
    { day: 1, startTime: "8:30", endTime: "10:00" }, // Tuesday 8:30-10:00
    { day: 2, startTime: "8:30", endTime: "10:00" }, // Wednesday 8:30-10:00
    { day: 3, startTime: "7:30", endTime: "8:30" }, // Thursday 7:30-8:30
    { day: 3, startTime: "11:30", endTime: "13:00" }, // Thursday 11:30-13:00
    { day: 4, startTime: "8:30", endTime: "10:00" }, // Friday 8:30-10:00
    { day: 5, startTime: "9:30", endTime: "12:00" }, // Saturday 9:30-12:00
  ];

  const days = [
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
    "Sobota",
    "Niedziela",
  ];

  const timeSlots = [
    "7:30",
    "8:00",
    "8:30",
    "9:00",
    "9:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
  ];

  // Function to get the height of a block
  const getBlockHeight = (day: number, time: string) => {
    const block = scheduleBlocks.find(
      (b) => b.day === day && b.startTime === time
    );
    if (!block) return 1;

    const startIndex = timeSlots.indexOf(block.startTime);
    const endIndex = timeSlots.indexOf(block.endTime);
    return endIndex - startIndex;
  };

  // Function to check if this is the start of a block
  const isBlockStart = (day: number, time: string) => {
    return scheduleBlocks.some(
      (block) => block.day === day && block.startTime === time
    );
  };

  return (
    <div className="bg-[#f5f7fa] rounded-lg p-4 overflow-hidden">
      <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-2">
        {/* Header row with days */}
        <div className=""></div>
        {days.map((day, _) => (
          <div
            key={day}
            className="text-center font-medium text-[#263238] py-2"
          >
            {day}
          </div>
        ))}

        {/* Time slots and schedule blocks */}
        {timeSlots.map((time, _) => (
          <>
            <div
              key={`time-${time}`}
              className="text-right pr-4 py-2 text-[#263238]"
            >
              {time}
            </div>

            {days.map((_, dayIndex) => (
              <div key={`slot-${dayIndex}-${time}`} className="relative h-10">
                {isBlockStart(dayIndex, time) && (
                  <div
                    className="absolute inset-0.5 bg-primary rounded-md"
                    style={{
                      height: `${getBlockHeight(dayIndex, time) * 40 - 4}px`,
                    }}
                  ></div>
                )}
              </div>
            ))}
          </>
        ))}
      </div>

      <div className="mt-4 flex">
        <button className="bg-primary text-white px-6 py-3 rounded-full hover:bg-[#3d9c40] transition-colors">
          Dodaj nową podróż
        </button>
      </div>
    </div>
  );
}
