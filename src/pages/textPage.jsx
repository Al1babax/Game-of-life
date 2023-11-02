import React, { useRef, useState, useEffect } from 'react';
import Controls from '../components/controls';
import Stats from '../components/stats';

// TODO: go back in time
// TODO: fix zooming when toggling cells
// TODO: choose preset scenarios

export default function Test() {
    const [grid, setGrid] = useState([])
    const [gridSize, setGridSize] = useState({ rows: 50, cols: 100 })
    const canvasRef = useRef(null);

    // controls
    const [isRunning, setIsRunning] = useState(false)
    const [speed, setSpeed] = useState(500)

    // Stats
    const [generationNumber, setGenerationNumber] = useState(0)
    const [population, setPopulation] = useState(0)
    const [maxPopulation, setMaxPopulation] = useState(0)
    const [minPopulation, setMinPopulation] = useState(0)
    const [newBorn, setNewBorn] = useState(0)
    const [dead, setDead] = useState(0)

    // Zoom states
    const [zoomOriginX, setZoomOriginX] = useState(0);
    const [zoomOriginY, setZoomOriginY] = useState(0);
    const [zoom, setZoom] = useState(1);

    // Dragging states
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragStartY, setDragStartY] = useState(0);
    const [gridX, setGridX] = useState((window.innerWidth - gridSize.cols * 30) / 2);
    const [gridY, setGridY] = useState((window.innerHeight - gridSize.rows * 30) / 2);


    // Init 100x50 grid
    function initGrid() {
        let grid = []
        for (let i = 0; i < gridSize.rows; i++) {
            let row = []
            for (let j = 0; j < gridSize.cols; j++) {
                // random generated
                if (Math.random() < 0.5) row.push(1)
                else row.push(0)

                // default
                /* row.push(0) */
            }
            grid.push(row)
        }
        setGrid(grid)
    }

    // Toggle cell state
    function toggleCell(x, y) {
        console.log(x, y)
        console.log(grid)
        console.log(grid.length, grid[0].length)
        let newGrid = [...grid]
        newGrid[x][y] = newGrid[x][y] === 0 ? 1 : 0
        setGrid(newGrid)
    }

    // Get cell color
    function getCellColor(x, y) {
        // if grid not yet init return white
        if (grid.length === 0) return "white"

        // Check if x or y is out of bounds and return white
        if (x < 0 || x >= grid.length || y < 0 || y >= grid[x].length) return "white"

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

    function resetZoom() {
        // Function to reset zoom
        setZoom(1);

        // Set origin to the center of the grid
        setZoomOriginX(gridSize.cols * 30 / 2);
        setZoomOriginY(gridSize.rows * 30 / 2);

        // Set grid position to the center of the screen by calculating the difference between the center of the screen and the center of the grid
        setGridX((window.innerWidth - gridSize.cols * 30) / 2);
        setGridY((window.innerHeight - gridSize.rows * 30) / 2);
    }


    function RenderCanvas() {
        const cellSize = 30;
        const rows = gridSize.rows
        const cols = gridSize.cols

        function calculateScreenSize() {
            const width = gridSize.cols * cellSize
            const height = gridSize.rows * cellSize

            return { width, height }
        }

        function handleCanvasClick(e) {

            // console.log("click")

            // Get canvas context
            const ctx = canvasRef.current.getContext('2d')

            // Get mouse position
            const rect = canvasRef.current.getBoundingClientRect()
            let x = e.clientX - rect.left
            let y = e.clientY - rect.top

            console.log(e.clientX, e.clientY)
            console.log(rect.left, rect.top)
            console.log(x, y)
            console.log(rect)

            // Draw rectangle in the grid
            ctx.fillStyle = 'black'
            ctx.fillRect(x - (x % cellSize), y - (y % cellSize), cellSize, cellSize)

            // Toggle cell state
            toggleCell(Math.floor(y / cellSize), Math.floor(x / cellSize))
        }

        function handleWheel(e) {
            // Function to handle zoom in and out
            e.preventDefault();
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            // Get mouse position
            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            // Get zoom origin
            const zoomOriginX = x / zoom;
            const zoomOriginY = y / zoom;

            // Get zoom direction
            const zoomDirection = e.deltaY < 0 ? 1 : -1;

            // Calculate new zoom
            const newZoom = zoom * (1 + zoomDirection * 0.1);

            // Calculate new origin
            const newOriginX = zoomOriginX - x / newZoom;
            const newOriginY = zoomOriginY - y / newZoom;

            // check that new zoom is within boundaries [0.5, 2]
            if (newZoom < 0.5 || newZoom > 2) return

            // Set new zoom and origin
            setZoom(newZoom);
            /* setZoomOriginX(newOriginX);
            setZoomOriginY(newOriginY); */
        }

        function handleCanvasMouseDown(e) {
            // console.log("mouse down")

            // check if input is mouse 2 down
            if (e.buttons !== 2) return

            // Function to handle dragging
            // Get canvas context
            const ctx = canvasRef.current.getContext('2d')

            // Get mouse position
            const rect = canvasRef.current.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            // Set dragging state
            setIsDragging(true);

            // Set drag start position
            setDragStartX(x);
            setDragStartY(y);
        }

        function handleCanvasMouseUp(e) {
            // Function to handle dragging
            // Set dragging state
            setIsDragging(false);
        }

        function handleCanvasMouseMove(e) {
            // Function to handle dragging

            // check if input is mouse 2 down
            if (e.buttons !== 2) return

            // Get canvas context
            const ctx = canvasRef.current.getContext('2d')

            // Get mouse position
            const rect = canvasRef.current.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            // If dragging
            if (isDragging) {
                // Calculate new grid position
                const newGridX = gridX + x - dragStartX;
                const newGridY = gridY + y - dragStartY;

                // Set new grid position
                setGridX(newGridX);
                setGridY(newGridY);
            }
        }

        function drawGrid() {
            // Draws grid lines based on cell size
            // Get canvas context
            const ctx = canvasRef.current.getContext('2d')

            // Get canvas width and height
            const { width, height } = calculateScreenSize()

            // Draw rows
            for (let i = 0; i < rows; i++) {
                ctx.beginPath()
                ctx.moveTo(0, i * cellSize)
                ctx.lineTo(width, i * cellSize)
                ctx.strokeStyle = 'black'
                ctx.stroke()
            }

            // Draw columns
            for (let j = 0; j < cols; j++) {
                ctx.beginPath()
                ctx.moveTo(j * cellSize, 0)
                ctx.lineTo(j * cellSize, height)
                ctx.strokeStyle = 'black'
                ctx.stroke()
            }

            // Draw cells
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const cColor = getCellColor(i, j)
                    ctx.fillStyle = cColor
                    if (cColor === 'black') {
                        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize)
                    }
                }
            }
        }

        useEffect(() => {
            // Get canvas context
            const ctx = canvasRef.current.getContext('2d')

            // Get canvas width and height
            const { width, height } = calculateScreenSize()

            // Set canvas background color
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, width, height)

            // Draw grid
            drawGrid()
        }, [])

        /* useEffect(() => {
            // Get the canvas element
            const canvas = canvasRef.current;

            // Add the wheel event listener with the { passive: true } option
            canvas.addEventListener('wheel', handleWheel, { passive: false });

            // Clean up the event listener when the component unmounts
            return () => {
                canvas.removeEventListener('wheel', handleWheel);
            };
        }, []); // Empty dependency array for component mounting and unmounting */

        return (
            <canvas
                ref={canvasRef}
                width={calculateScreenSize().width}
                height={calculateScreenSize().height}
                onClick={handleCanvasClick}
                onMouseDown={handleCanvasMouseDown}
                onMouseUp={handleCanvasMouseUp}
                onMouseMove={handleCanvasMouseMove}
                onMouseLeave={handleCanvasMouseUp}
                style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: `${calculateScreenSize().width / 2}px ${calculateScreenSize().height / 2}px`,
                    transition: 'transform 0.1s linear',
                    position: 'absolute',
                    left: `${gridX}px`,
                    top: `${gridY}px`,
                    overflow: 'hidden'
                }}
            />
        )
    }

    useEffect(() => {
        initGrid()
    }, [])

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
            }, speed);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isRunning, grid]);

    function resetGrid() {
        initGrid()
        setGenerationNumber(0)
        setPopulation(0)
        setMaxPopulation(0)
        setMinPopulation(0)
        setNewBorn(0)
        setDead(0)

        // Reset zoom
        resetZoom()
    }

    function changeGridSize(value) {
        // if value is uneven add one to it
        if (value % 2 !== 0) value++

        // Function to change grid size
        let newGridSize = {
            rows: Math.floor(value * 0.50),
            cols: value
        }

        setGridSize(newGridSize)
        resetGrid()
    }

    function handleContextMenu(event) {
        event.preventDefault(); // Prevent the default right-click menu
        // You can add custom logic here if needed
    }

    useEffect(() => {
        // Attach the contextmenu event listener to the root element
        document.addEventListener('contextmenu', handleContextMenu);
    
        // Clean up the event listener when the component unmounts
        return () => {
          document.removeEventListener('contextmenu', handleContextMenu);
        };
      }, []);

    //console.log(grid)
    // console log zooms
    console.log(zoomOriginX, zoomOriginY, zoom)

    return (
        <div className={`${isDragging ? "cursor-move" : "cursor-default"}`}>
            <RenderCanvas />
            <div className="controls fixed top-10 left-[600px]">
                <Controls
                    isRunning={isRunning}
                    setIsRunning={setIsRunning}
                    resetGrid={resetGrid}
                    setSpeed={setSpeed}
                    speed={speed}
                    changeGridSize={changeGridSize}
                    gridSize={gridSize}
                />
            </div>
            <div className="stats fixed top-[300px] right-[50px]">
                <Stats generationNumber={generationNumber} population={population} maxPopulation={maxPopulation} minPopulation={minPopulation} newBorn={newBorn} dead={dead} />
            </div>
        </div>
    )
}