import React, { useEffect, useState } from "react";
import Display from "./Display";
import comprailData from "../data/comprail.json";
import { supabase } from "../supabaseClient";

const STORAGE_KEY = "comprailDisplays";

const Map = () => {
    const [displays, setDisplays] = useState([]);


    useEffect(() => {
        getDisplays()
    }, []);

    async function getDisplays() {
        const { data } = await supabase.from("displays").select()
        console.log(data)
        setDisplays(data)
    }

    const handleSave = async (displayId, productId) => {
        await supabase
            .from("displays")
            .update({
                product_id: productId,
                updated_at: new Date()
            })
            .eq("id", displayId);

        setDisplays((prev) =>
            prev.map((d) =>
                d.id === displayId ? { ...d, product_id: productId } : d

            )
        );

        console.log(displays.map((d) =>
                d.id === displayId ? { ...d, product_id: productId } : d

            ))
    };



    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
                Front Comp Rail
            </h2>

            {/* Scroll container */}
            <div className="overflow-auto">
                <div
                    className="
            grid
            gap-2
            md:p-4
          
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
                                productId={slot.product_id}
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
