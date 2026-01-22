import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const MapCanvas = ({ children, cols, rows }) => {
    return (
        <div className="relative overflow-hidden border border-base-300 rounded-xl bg-base-300 shadow-inner h-[80vh] w-full">
            <TransformWrapper
                initialScale={0.5}
                minScale={0.1}
                maxScale={2}
                // centerOnInit={true}
            >
                {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                        {/* Floating Controls */}
                        <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-2">
                            <button className="btn btn-circle btn-primary shadow-lg" onClick={() => zoomIn()}>+</button>
                            <button className="btn btn-circle btn-primary shadow-lg" onClick={() => zoomOut()}>-</button>
                            <button className="btn btn-circle btn-ghost bg-base-100 shadow-md" onClick={() => resetTransform()}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                                </svg>
                            </button>
                        </div>

                        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
                            <div
                                className="grid p-24 bg-grid-dots"
                                style={{
                                    gridTemplateColumns: `repeat(${cols}, 130px)`,
                                    gridTemplateRows: `repeat(${rows}, 130px)`,
                                    width: 'max-content'
                                }}
                            >
                                {children}
                            </div>
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>

        </div>
    );
};

export default MapCanvas;