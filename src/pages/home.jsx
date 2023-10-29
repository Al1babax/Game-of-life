import { useEffect, useState } from "react";

export default function Home() {

    const [grid, setGrid] = useState([])
    const [isRunning, setIsRunning] = useState(false)

    // Init 100x50 grid
    function initGrid() {
        let grid = []
        for (let i = 0; i < 50; i++) {
            let row = []
            for (let j = 0; j < 100; j++) {
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
    function update() {
        // Update grid by game of life rules
        // Rules:
        // 1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        // 2. Any live cell with two or three live neighbours lives on to the next generation.
        // 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
        // 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

        // Check if grid is empty or none or undefined
        if (!grid || grid.length === 0) return

        let newGrid = [...grid]

        // Loop through each cell in grid
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid[x].length; y++) {

                // Count number of neighbors
                let neighbors = 0

                // Check top left
                if (x > 0 && y > 0 && grid[x - 1][y - 1] === 1) neighbors++

                // Check top
                if (x > 0 && grid[x - 1][y] === 1) neighbors++

                // Check top right
                if (x > 0 && y < grid[x].length - 1 && grid[x - 1][y + 1] === 1) neighbors++

                // Check left
                if (y > 0 && grid[x][y - 1] === 1) neighbors++

                // Check right
                if (y < grid[x].length - 1 && grid[x][y + 1] === 1) neighbors++

                // Check bottom left
                if (x < grid.length - 1 && y > 0 && grid[x + 1][y - 1] === 1) neighbors++

                // Check bottom
                if (x < grid.length - 1 && grid[x + 1][y] === 1) neighbors++

                // Check bottom right
                if (x < grid.length - 1 && y < grid[x].length - 1 && grid[x + 1][y + 1] === 1) neighbors++

                // Apply rules
                if (grid[x][y] === 1 && neighbors < 2) {
                    newGrid[x][y] = 0
                } else if (grid[x][y] === 1 && neighbors > 3) {
                    newGrid[x][y] = 0
                } else if (grid[x][y] === 0 && neighbors === 3) {
                    newGrid[x][y] = 1
                }
            }
        }

        setGrid(newGrid)
    }

    // Run update function every 0.5 second
    useEffect(() => {
        let intervalId;
    
        if (isRunning) {
            intervalId = setInterval(() => {
                update();
            }, 500);
        }
    
        return () => {
            clearInterval(intervalId);
        };
    }, [isRunning]);
    

    // Init grid on page load
    useEffect(() => {
        initGrid()
    }, [])

    // Start simulation
    function startSimulation() {
        setIsRunning(true)
    }

    function RenderGrid() {
        return (
            <div className="w-[1400px] h-[700px] bg-white grid gap-[1px]">
                {grid.map((row, x) => (
                    <div key={x} className="flex justify-between items-center gap-[1px]">
                        {row.map((cell, y) => (
                            <div
                                key={y}
                                className="w-full h-full"
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
        <div className="flex flex-col justify-center items-center w-full h-full">
            <h1 className="text-5xl font-bold text-center pt-10 text-slate-100">Game of Life</h1>
            <div className="startButton w-36 h-12 text-slate-100 bg-green-500 flex items-center justify-center rounded-xl mt-4 cursor-pointer" onClick={startSimulation}>
                Start simulation
            </div>
            <div className="game flex justify-center items-center mt-6">
                <RenderGrid />
            </div>
        </div>
    );
}