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
                <div
                    className="
                        grid
                        grid-cols-9
                        grid-rows-15
                        gap-2
                        p-4

                        bg-base-200
                        outline
                        outline-1
                        outline-dashed
                        outline-base-300
                        outline-offset-[-1px]
                    "
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
    );
};

export default Map;
