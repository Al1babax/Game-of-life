export default function Controls(props) {
    const { isRunning, setIsRunning, resetGrid, speed, setSpeed, gridSize, changeGridSize } = props

    function startSimulation() {
        setIsRunning(true)
    }

    function stopSimulation() {
        setIsRunning(false)
    }

    function resetSimulation() {
        resetGrid()
    }

    return (
        <div className="controls flex gap-4 bg-black opacity-[90%] justify-center items-center p-3 rounded">
            <div className="startButton w-36 h-12 text-slate-100 bg-green-500 flex items-center justify-center rounded-xl cursor-pointer hover:brightness-110" onClick={startSimulation}>
                Start simulation
            </div>
            <div className="stopButton w-36 h-12 text-slate-100 bg-red-500 flex items-center justify-center rounded-xl cursor-pointer hover:brightness-110" onClick={stopSimulation}>
                Stop simulation
            </div>
            <div className="resetButton w-36 h-12 text-slate-100 bg-blue-500 flex items-center justify-center rounded-xl cursor-pointer hover:brightness-110" onClick={resetSimulation}>
                Reset simulation
            </div>
            <div className="speedSlider">
                <span className="text-slate-100">Speed: </span>
                <input
                    type="range"
                    min="10"
                    max="1000"
                    value={speed}
                    className="slider"
                    id="myRange"
                    onChange={(e) => setSpeed(e.target.value)}
                />
            </div>
            <div className="gridSizeSlider">
                <span className="text-slate-100">Grid size: </span>
                <input
                    type="range"
                    min="50"
                    max="250"
                    value={gridSize.width}
                    className="slider"
                    id="myRange"
                    onChange={(e) => changeGridSize(e.target.value)}
                />
            </div>
            <div className="updateSpeed">
                <span className="text-slate-100">Speed: </span>
                <span className="text-white">{speed}ms</span>
            </div>
            <div className="updateGridSize">
                <span className="text-slate-100">Grid size: </span>
                <span className="text-white">{gridSize.cols}x{gridSize.rows}</span>
            </div>
            <div className="flex h-12 justify-center items-center gap-1">
                <span className="text-slate-100">Status: </span>
                <span className={`${isRunning ? "text-green-500" : "text-red-500"}`}>{isRunning ? "Running" : "Stopped"}</span>
            </div>
        </div>
    )
}