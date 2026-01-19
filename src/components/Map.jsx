import React, { useEffect, useState } from "react";
import Display from "./Display";
import comprailData from "../data/comprail.json";

const STORAGE_KEY = "comprailDisplays";

// Logical size of ONE display slot
const CELL_WIDTH = "6rem";
const CELL_HEIGHT = "4.5rem";

const COLS = 9;
const ROWS = 15;

const Map = () => {
    const [displays, setDisplays] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : comprailData;
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

            {/* Scroll container */}
            <div className="overflow-auto">
                <div
                    className="
      origin-top-left
      scale-[0.6]
      sm:scale-100
      transition-transform
    "
                >
                    <div
                        className="
        grid
        gap-2
        p-4
        bg-base-200
        outline
        outline-1
        outline-dashed
        outline-base-300
      "
                        style={{
                            gridTemplateColumns: `repeat(9, 6rem)`,
                            gridTemplateRows: `repeat(15, 4.5rem)`
                        }}
                    >
                        {displays.map((slot) => (
                            <div
                                key={slot.id}
                                style={{
                                    gridColumn: slot.col,
                                    gridRow: slot.row
                                }}
                            >
                                <Display
                                    id={slot.id}
                                    productName={slot.productName}
                                    onSave={handleSave}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Map;
