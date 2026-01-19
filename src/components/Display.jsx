import React, { useState } from "react";

const Display = ({ id, productName, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(productName);

  const save = () => {
    setEditing(false);
    onSave(id, value.trim());
  };

  return (
    <div className="w-full h-full border border-base-300 rounded bg-base-100 shadow-sm flex flex-col">
      {/* Label */}
      <div className="h-6 bg-base-200 text-[10px] px-1 flex items-center rounded-t truncate">
        {editing ? (
          <input
            autoFocus
            className="input input-xs w-full"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => e.key === "Enter" && save()}
          />
        ) : (
          <span
            className="cursor-pointer truncate"
            onClick={() => setEditing(true)}
          >
            {productName || "Empty"}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center text-xs text-base-content/50">
        {id}
      </div>
    </div>
  );
};

export default Display;
