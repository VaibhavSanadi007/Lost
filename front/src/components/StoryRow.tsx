const StoryRow = () => {
  const stories = [
    { id: 1, label: "Create Story", type: "create" },
    { id: 2, label: "This isnt the…", color: "bg-purple-600" },
    { id: 3, label: "", color: "bg-blue-500" },
    { id: 4, label: "", color: "bg-emerald-500" },
    { id: 5, label: "", color: "bg-gray-400" },
  ];

  // scrollbar-hide  baad mein lagayenge
  return (
    <div className="w-full flex py-1.5 xl:py-2 ">
      <div className="h-25 w-full xl:h-30  border border-gray-200 rounded-2xl overflow-x-auto  flex items-center pl-2 xl:pl-2 xl:gap-3 gap-3  ">
        {stories.map((s) =>
          s.type === "create" ? (
            <div
              key={s.id}
              className="h-20 w-15 xl:w-20 xl:h-25 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-gray-400 cursor-pointer"
            >
              <div className="h-9 w-9 rounded-full bg-indigo-600 text-white grid place-items-center text-lg">
                +
              </div>
              <span className="mt-2 text-xs font-medium text-gray-700 text-center">
                {s.label}
              </span>
            </div>
          ) : (
            <div
              key={s.id}
              className={`w-15 h-20 xl:w-20 xl:h-25 rounded-2xl ${s.color} relative cursor-pointer`}
            >
              {/* Avatar circle */}
              <div className="absolute left-2 bottom-2 h-7 w-7 rounded-full ring-2 ring-white bg-gray-200" />
            </div>
          )
        )}
      </div>
    </div>
  );
};
export default StoryRow;
