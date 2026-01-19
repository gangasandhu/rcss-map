import React, { useState } from "react";

const Display = ({ id, productName, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(productName);

  const handleSave = () => {
    setIsEditing(false);
    onSave(id, value.trim());
  };

  return (
    <div className="w-20 h-16 border border-base-300 rounded-lg bg-base-100 shadow-sm flex flex-col">
      {/* Top label */}
      <div className="h-[25%] bg-base-200 text-xs font-medium px-2 flex items-center rounded-t-lg">
        {isEditing ? (
          <input
            autoFocus
            className="input input-xs w-full"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
        ) : (
          <span
            className="truncate cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {productName || "Empty"}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center text-base-content/50 text-sm">
        {id}
      </div>
    </div>
  );
};

export default Display;
