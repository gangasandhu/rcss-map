import React, { useEffect, useState } from "react";
import Display from "./Display";
import compRailData from "../data/compRail.json";

const STORAGE_KEY = "compRailDisplays";

const Map = () => {
  const [displays, setDisplays] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : compRailData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(displays));
  }, [displays]);

  const handleSave = (id, newName) => {
    setDisplays((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, productName: newName } : d
      )
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Front Comp Rail</h2>

      <div className="flex gap-4">
        {displays.map((slot) => (
          <Display
            key={slot.id}
            id={slot.id}
            productName={slot.productName}
            onSave={handleSave}
          />
        ))}
      </div>
    </div>
  );
};

export default Map;
