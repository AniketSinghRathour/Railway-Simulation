import React from 'react'

function TrackLayout({
    signals,
    blueTrainPos,
    redTrainPos,
    yellowTrainPos
}) {
  return (
    <>
      <div className="relative bg-card border rounded-lg p-4 h-full m-[3.5]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2>Live Train Traffic System - Section Management</h2>
          <p className="text-sm text-muted-foreground">Railway Network Layout</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Express</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm">Passenger</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm">Freight</span>
          </div>
        </div>
      </div>
      
      <div className="relative bg-slate-900 rounded-lg overflow-hidden border-2 border-slate-700" style={{ height: '600px' }}>
        <div className="flex items-center justify-center h-full">
        <svg transform="scale(1.2)" width="800" height="400" style={{ backgroundColor: '' }}>

          {/* T1 and T2 */}
          <line x1="0" y1="125" x2="800" y2="125" stroke="white" strokeWidth={1.5}/>
          <line x1="0" y1="250" x2="800" y2="250" stroke="white" strokeWidth={1.5}/>

          {/* Block Lines */}
          <line x1="175" y1="50" x2="175" y2="320" stroke="grey"  strokeWidth={1} strokeDasharray="5,5"/>
          <line x1="325" y1="50" x2="325" y2="320" stroke="grey"  strokeWidth={1} strokeDasharray="5,5"/>
          <line x1="475" y1="50" x2="475" y2="320" stroke="grey"  strokeWidth={1} strokeDasharray="5,5"/>
          <line x1="625" y1="50" x2="625" y2="320" stroke="grey"  strokeWidth={1} strokeDasharray="5,5"/>

          {/* Side Loops */}
          <polygon points="175 125, 200 75, 300 75, 325 125" fill="none" stroke="white" strokeWidth={1.2}/>
          <polygon points="325 250, 350 300, 450 300, 475 250" fill="none" stroke="white" strokeWidth={1.2}/>

          {/* Intersection T1_T2_CONN */}
          <line x1="475" y1="125" x2="625" y2="250" stroke="white" strokeWidth={1.2}/>

          {/* Signals */}
          {/* for T1 */}
          <rect x="170" y="130" width="10" height="10" fill={signals[0]} strokeWidth={1.2}/>
          <rect x="320" y="130" width="10" height="10" fill={signals[2]} strokeWidth={1.2}/>
          <rect x="470" y="110" width="10" height="10" fill="green" strokeWidth={1.2}/>
          <rect x="620" y="110" width="10" height="10" fill="green" strokeWidth={1.2}/>

          {/* for T2 */}
          <rect x="170" y="255" width="10" height="10" fill="green" strokeWidth={1.2}/>
          <rect x="320" y="235" width="10" height="10" fill="green" strokeWidth={1.2}/>
          <rect x="470" y="235" width="10" height="10" fill="green" strokeWidth={1.2}/>
          <rect x="620" y="255" width="10" height="10" fill="green" strokeWidth={1.2}/>

          {/* for Side Loops and CONN */}
          <rect x="170" y="105" width="10" height="10" fill={signals[1]} strokeWidth={1.2}/>
          <rect x="320" y="105" width="10" height="10" fill={signals[3]} strokeWidth={1.2}/>
          <rect x="320" y="260" width="10" height="10" fill="red" strokeWidth={1.2}/>
          <rect x="470" y="260" width="10" height="10" fill="red" strokeWidth={1.2}/>
          <rect x="470" y="135" width="10" height="10" fill="red" strokeWidth={1.2}/>
          <rect x="620" y="230" width="10" height="10" fill="red" strokeWidth={1.2}/>

          {/* Trains */}
          {/* <g transform={`translate(${blueTrainPos.x}, ${blueTrainPos.y})`}>
            <polygon points="35 115, 65 115, 75 125, 65 135, 35 135" fill="blue" stroke="white" strokeWidth={1.2}/>
          </g>

          <g transform={`translate(${redTrainPos.x}, ${redTrainPos.y}) rotate(180, 35, 125)`}>
            <polygon points="35 115, 65 115, 75 125, 65 135, 35 135" fill="red" stroke="white" strokeWidth={1.2}/>
          </g> */}

          {/* <g transform='translate(160, 125)'>
            <polygon points="35 115, 65 115, 75 125, 65 135, 35 135" fill="yellow" stroke="white" strokeWidth={1.2}/>
          </g> */}

          <g transform={`translate(${blueTrainPos.x}, ${blueTrainPos.y})`}>
            <svg fill="#701cd6" width="35px" height="35px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
              <path d="M188,24H68A32.03667,32.03667,0,0,0,36,56V184a32.03667,32.03667,0,0,0,32,32H79.99976L65.59961,235.2002a8.00019,8.00019,0,0,0,12.80078,9.5996L100.00024,216h55.99952l21.59985,28.7998a8.00019,8.00019,0,0,0,12.80078-9.5996L176.00024,216H188a32.03667,32.03667,0,0,0,32-32V56A32.03667,32.03667,0,0,0,188,24ZM84,184a12,12,0,1,1,12-12A12,12,0,0,1,84,184Zm36-64H52V80h68Zm52,64a12,12,0,1,1,12-12A12,12,0,0,1,172,184Zm32-64H136V80h68Z"/>
            </svg>
          </g>

          <g transform={`translate(${redTrainPos.x}, ${redTrainPos.y})`}>
            <svg fill="#f55a42" width="35px" height="35px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
              <path d="M188,24H68A32.03667,32.03667,0,0,0,36,56V184a32.03667,32.03667,0,0,0,32,32H79.99976L65.59961,235.2002a8.00019,8.00019,0,0,0,12.80078,9.5996L100.00024,216h55.99952l21.59985,28.7998a8.00019,8.00019,0,0,0,12.80078-9.5996L176.00024,216H188a32.03667,32.03667,0,0,0,32-32V56A32.03667,32.03667,0,0,0,188,24ZM84,184a12,12,0,1,1,12-12A12,12,0,0,1,84,184Zm36-64H52V80h68Zm52,64a12,12,0,1,1,12-12A12,12,0,0,1,172,184Zm32-64H136V80h68Z"/>
            </svg>
          </g>

          <g transform={`translate(${yellowTrainPos.x}, ${yellowTrainPos.y})`}>
            <svg fill="yellow" width="35px" height="35px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
              <path d="M188,24H68A32.03667,32.03667,0,0,0,36,56V184a32.03667,32.03667,0,0,0,32,32H79.99976L65.59961,235.2002a8.00019,8.00019,0,0,0,12.80078,9.5996L100.00024,216h55.99952l21.59985,28.7998a8.00019,8.00019,0,0,0,12.80078-9.5996L176.00024,216H188a32.03667,32.03667,0,0,0,32-32V56A32.03667,32.03667,0,0,0,188,24ZM84,184a12,12,0,1,1,12-12A12,12,0,0,1,84,184Zm36-64H52V80h68Zm52,64a12,12,0,1,1,12-12A12,12,0,0,1,172,184Zm32-64H136V80h68Z"/>
            </svg>
          </g>
          
        </svg>
        </div>      
      </div>

    </div>
    </>
    
  )
}

export default TrackLayout