import { useEffect, useState } from "react";
import Stats from "../components/stats";

export default function HomeProto() {

    const [grid, setGrid] = useState([])
    const [isRunning, setIsRunning] = useState(false)

    // Dragging states
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragStartY, setDragStartY] = useState(0);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);

    // Zoom states
    const [zoomOriginX, setZoomOriginX] = useState(0);
    const [zoomOriginY, setZoomOriginY] = useState(0);
    const [zoom, setZoom] = useState(1);

    // Stats
    const [generationNumber, setGenerationNumber] = useState(0)
    const [population, setPopulation] = useState(0)
    const [maxPopulation, setMaxPopulation] = useState(0)
    const [minPopulation, setMinPopulation] = useState(0)
    const [newBorn, setNewBorn] = useState(0)
    const [dead, setDead] = useState(0)


    // Init 100x50 grid
    function initGrid() {
        let grid = []
        for (let i = 0; i < 25; i++) {
            let row = []
            for (let j = 0; j < 50; j++) {
                row.push(0)
            }
            grid.push(row)
        }
        setGrid(grid)
    }

    // Toggle cell state
    function toggleCell(x, y) {
        let newGrid = [...grid]
        newGrid[x][y] = newGrid[x][y] === 0 ? 1 : 0
        setGrid(newGrid)
    }

    // Get cell color
    function getCellColor(x, y) {
        return grid[x][y] === 0 ? "white" : "black"
    }

    // Grid update function
    function update(oldGrid) {
        // Update grid by game of life rules
        // Rules:
        // 1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        // 2. Any live cell with two or three live neighbours lives on to the next generation.
        // 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
        // 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

        // Check if grid is empty or none or undefined
        if (!oldGrid || oldGrid.length === 0 || oldGrid === undefined) return

        // Make deep copy of oldGrid
        let newGrid = JSON.parse(JSON.stringify(oldGrid))

        let newBornTemp = 0
        let deadTemp = 0

        // Loop through each cell in oldGrid
        for (let x = 0; x < oldGrid.length; x++) {
            for (let y = 0; y < oldGrid[x].length; y++) {

                // Count number of neighbors
                let neighbors = 0

                // Check top left
                if (x > 0 && y > 0 && oldGrid[x - 1][y - 1] === 1) neighbors++;

                // Check top
                if (x > 0 && oldGrid[x - 1][y] === 1) neighbors++;

                // Check top right
                if (x > 0 && y < oldGrid[x].length - 1 && oldGrid[x - 1][y + 1] === 1) neighbors++;

                // Check left
                if (y > 0 && oldGrid[x][y - 1] === 1) neighbors++;

                // Check right
                if (y < oldGrid[x].length - 1 && oldGrid[x][y + 1] === 1) neighbors++;

                // Check bottom left
                if (x < oldGrid.length - 1 && y > 0 && oldGrid[x + 1][y - 1] === 1) neighbors++;

                // Check bottom
                if (x < oldGrid.length - 1 && oldGrid[x + 1][y] === 1) neighbors++;

                // Check bottom right
                if (x < oldGrid.length - 1 && y < oldGrid[x].length - 1 && oldGrid[x + 1][y + 1] === 1) neighbors++;

                // Apply rules
                if (oldGrid[x][y] === 1 && neighbors < 2) {
                    newGrid[x][y] = 0

                    // Update stats
                    deadTemp++

                } else if (oldGrid[x][y] === 1 && (neighbors === 2 || neighbors === 3)) {
                    newGrid[x][y] = 1
                }
                else if (oldGrid[x][y] === 1 && neighbors > 3) {
                    newGrid[x][y] = 0

                    // Update stats
                    deadTemp++

                } else if (oldGrid[x][y] === 0 && neighbors === 3) {
                    newGrid[x][y] = 1

                    // Update stats
                    newBornTemp++
                }
            }
        }

        // Update stats
        setNewBorn(newBorn + newBornTemp)
        setDead(dead + deadTemp)

        // Update grid
        setGrid(newGrid)
    }

    // Run update function every 0.5 second
    useEffect(() => {
        let intervalId;

        if (isRunning) {
            intervalId = setInterval(() => {
                update(grid);

                // Update stats
                setGenerationNumber(generationNumber + 1)

                // Calculate population
                let population = 0
                for (let x = 0; x < grid.length; x++) {
                    for (let y = 0; y < grid[x].length; y++) {
                        if (grid[x][y] === 1) population++
                    }
                }
                setPopulation(population)

                // Calculate max population
                if (population > maxPopulation) setMaxPopulation(population)

                // Calculate min population
                if (population < minPopulation) setMinPopulation(population)
            }, 500);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isRunning, grid]);


    // Init grid on page load
    useEffect(() => {
        initGrid()
    }, [])

    // Start simulation
    function startSimulation() {
        setIsRunning(true)

        // setup initial population
        let population = 0;

        // Count all the cells that are alive
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid[x].length; y++) {
                if (grid[x][y] === 1) population++
            }
        }

        // Update stats
        setPopulation(population)
        setMaxPopulation(population)
        setMinPopulation(population)
    }

    // Stop simulation
    function stopSimulation() {
        setIsRunning(false)
    }

    // Reset simulation
    function resetSimulation() {
        setIsRunning(false)
        initGrid()
        setGenerationNumber(0)
        setPopulation(0)
        setMaxPopulation(0)
        setMinPopulation(0)
        setNewBorn(0)
        setDead(0)
    }

    // Mouse movements on grid
    function onMouseDown(e) {
        setIsDragging(true);
        setDragStartX(e.clientX);
        setDragStartY(e.clientY);
    }

    function onMouseUp() {
        setIsDragging(false);
    }

    function onMouseMove(e) {
        if (isDragging) {
            const offsetX = e.clientX - dragStartX;
            const offsetY = e.clientY - dragStartY;
            setGridX(gridX + offsetX);
            setGridY(gridY + offsetY);
            setDragStartX(e.clientX);
            setDragStartY(e.clientY);
        }
    }

    function handleZoom(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
        const newZoom = zoom * zoomFactor;
        const newZoomOriginX = (offsetX - gridX) / zoom;
        const newZoomOriginY = (offsetY - gridY) / zoom;

        setZoom(newZoom);
        setZoomOriginX(newZoomOriginX);
        setZoomOriginY(newZoomOriginY);

        // Prevent the default scroll behavior
        // event.preventDefault();
    }

    console.log(gridX, gridY)


    function RenderGrid() {
        return (
            <div
                className="bg-slate-400 grid gap-[1px]"
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                onWheel={handleZoom}
                style={{
                    transform: `translate(${gridX}px, ${gridY}px) scale(${zoom})`,
                    transformOrigin: `${zoomOriginX}px ${zoomOriginY}px`, // Set the origin
                }}
            >
                {grid.map((row, x) => (
                    <div key={x} className="flex justify-between items-center gap-[1px]">
                        {row.map((cell, y) => (
                            <div
                                key={y}
                                className="w-8 h-8"
                                style={{ backgroundColor: getCellColor(x, y) }}
                                onClick={() => toggleCell(x, y)}
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center items-center w-full h-full overflow-hidden">
            <RenderGrid />
        </div>
    );
}
