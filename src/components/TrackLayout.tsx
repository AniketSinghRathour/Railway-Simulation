import React, { useState } from 'react';
import { Train, Intersection, Track } from '../types/railway';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface TrackLayoutProps {
  trains: Train[];
  intersections: Intersection[];
  tracks: Track[];
  onTrainSelect: (train: Train) => void;
  onIntersectionSelect: (intersection: Intersection) => void;
}

const TrackLayout: React.FC<TrackLayoutProps> = ({
  trains,
  intersections,
  tracks,
  onTrainSelect,
  onIntersectionSelect
}) => {
  const [hoveredTrain, setHoveredTrain] = useState<string | null>(null);
  const [hoveredIntersection, setHoveredIntersection] = useState<string | null>(null);

  const getTrainColor = (type: Train['type']) => {
    switch (type) {
      case 'express': return '#ef4444'; // red
      case 'passenger': return '#3b82f6'; // blue
      case 'freight': return '#eab308'; // yellow
      default: return '#6b7280'; // gray
    }
  };

  const getTrackColor = (status: Track['status']) => {
    switch (status) {
      case 'occupied': return '#ef4444';
      case 'maintenance': return '#f97316';
      case 'clear': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getIntersectionColor = (status: Intersection['status']) => {
    switch (status) {
      case 'occupied': return '#ef4444';
      case 'blocked': return '#f97316';
      case 'clear': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="bg-card border rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2>Linear Track Schematic - Section Control</h2>
          <p className="text-sm text-muted-foreground">Railway Network Layout & Traffic Management</p>
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
        <TooltipProvider>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 900 600"
            className="absolute inset-0"
          >
            {/* Background */}
            <rect width="100%" height="100%" fill="#0f172a" />
            
            {/* Grid lines for railway schematic */}
            <defs>
              <pattern id="railwayGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#railwayGrid)" />
            
            {/* Section Labels */}
            <text x="30" y="140" className="fill-slate-400 text-xs" fontSize="12">Main Line 1</text>
            <text x="30" y="240" className="fill-slate-400 text-xs" fontSize="12">Main Line 2</text>
            <text x="30" y="40" className="fill-slate-400 text-xs" fontSize="12">Branch North</text>
            <text x="30" y="340" className="fill-slate-400 text-xs" fontSize="12">Branch South</text>
            <text x="30" y="440" className="fill-slate-400 text-xs" fontSize="12">Yard</text>
            
            {/* Distance markers */}
            {[100, 200, 300, 400, 500, 600, 700, 800].map(x => (
              <g key={x}>
                <line x1={x} y1="20" x2={x} y2="580" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
                <text x={x} y="15" textAnchor="middle" className="fill-slate-500 text-xs" fontSize="10">
                  {((x - 50) / 10).toFixed(0)}km
                </text>
              </g>
            ))}
            
            {/* Tracks with railway schematic styling */}
            {tracks.map((track) => (
              <g key={track.id}>
                {/* Main track line */}
                <line
                  x1={track.start.x}
                  y1={track.start.y}
                  x2={track.end.x}
                  y2={track.end.y}
                  stroke={getTrackColor(track.status)}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Track sleepers/ties for realism */}
                {Array.from({ length: Math.floor(Math.abs(track.end.x - track.start.x) / 20) }).map((_, i) => {
                  const x = track.start.x + (i * 20);
                  const y = track.start.y;
                  return (
                    <rect
                      key={i}
                      x={x - 1}
                      y={y - 8}
                      width="2"
                      height="16"
                      fill="#374151"
                      opacity="0.6"
                    />
                  );
                })}
              </g>
            ))}
            
            {/* Track ID labels */}
            {tracks.map((track) => {
              const midX = (track.start.x + track.end.x) / 2;
              const midY = (track.start.y + track.end.y) / 2;
              const isVertical = Math.abs(track.end.y - track.start.y) > Math.abs(track.end.x - track.start.x);
              return (
                <g key={`${track.id}-label`}>
                  <rect
                    x={midX - 15}
                    y={midY - (isVertical ? 30 : 8)}
                    width="30"
                    height="16"
                    fill="#0f172a"
                    stroke="#374151"
                    strokeWidth="1"
                    rx="2"
                    opacity="0.9"
                  />
                  <text
                    x={midX}
                    y={midY - (isVertical ? 22 : 0)}
                    textAnchor="middle"
                    className="fill-slate-300 text-xs font-mono"
                    fontSize="9"
                  >
                    {track.id}
                  </text>
                </g>
              );
            })}
            
            {/* Junctions/Intersections with railway switch styling */}
            {intersections.map((intersection) => (
              <g key={intersection.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g 
                      className="cursor-pointer" 
                      onMouseEnter={() => setHoveredIntersection(intersection.id)}
                      onMouseLeave={() => setHoveredIntersection(null)}
                      onClick={() => onIntersectionSelect(intersection)}
                    >
                      {/* Junction diamond */}
                      <polygon
                        points={`${intersection.position.x},${intersection.position.y - 12} ${intersection.position.x + 12},${intersection.position.y} ${intersection.position.x},${intersection.position.y + 12} ${intersection.position.x - 12},${intersection.position.y}`}
                        fill={getIntersectionColor(intersection.status)}
                        stroke="#ffffff"
                        strokeWidth="2"
                        style={{ filter: hoveredIntersection === intersection.id ? 'brightness(1.2)' : 'none' }}
                      />
                      {/* Junction center dot */}
                      <circle
                        cx={intersection.position.x}
                        cy={intersection.position.y}
                        r="3"
                        fill="#ffffff"
                      />
                    </g>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="p-2">
                      <p className="font-medium">{intersection.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {intersection.id}</p>
                      <p className="text-sm">Status: {intersection.status}</p>
                      <p className="text-xs text-muted-foreground">
                        Routes: {intersection.connectedTracks.join(', ')}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
                
                {/* Junction ID label */}
                {hoveredIntersection === intersection.id && (
                  <g>
                    <rect
                      x={intersection.position.x - 12}
                      y={intersection.position.y - 28}
                      width="24"
                      height="14"
                      fill="#0f172a"
                      stroke="#ffffff"
                      strokeWidth="1"
                      rx="2"
                    />
                    <text
                      x={intersection.position.x}
                      y={intersection.position.y - 18}
                      textAnchor="middle"
                      className="fill-white text-xs font-mono"
                      fontSize="10"
                    >
                      {intersection.id}
                    </text>
                  </g>
                )}
              </g>
            ))}
            
            {/* Trains with realistic railway styling */}
            {trains.map((train) => (
              <g key={train.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredTrain(train.id)}
                      onMouseLeave={() => setHoveredTrain(null)}
                      onClick={() => onTrainSelect(train)}
                    >
                      {/* Locomotive Front */}
                      <polygon
                        points={`${train.position.x + 12},${train.position.y - 5} ${train.position.x + 16},${train.position.y - 3} ${train.position.x + 16},${train.position.y + 3} ${train.position.x + 12},${train.position.y + 5}`}
                        fill={getTrainColor(train.type)}
                        stroke="#ffffff"
                        strokeWidth="1"
                        style={{ filter: hoveredTrain === train.id ? 'brightness(1.1)' : 'none' }}
                      />
                      
                      {/* Main Train Body */}
                      <rect
                        x={train.position.x - 15}
                        y={train.position.y - 5}
                        width="27"
                        height="10"
                        fill={getTrainColor(train.type)}
                        stroke="#ffffff"
                        strokeWidth="1"
                        rx="1"
                        style={{ filter: hoveredTrain === train.id ? 'brightness(1.1)' : 'none' }}
                      />
                      
                      {/* Train Cab/Driver Section */}
                      <rect
                        x={train.position.x + 6}
                        y={train.position.y - 4}
                        width="6"
                        height="8"
                        fill={getTrainColor(train.type)}
                        stroke="#ffffff"
                        strokeWidth="1"
                        rx="1"
                        opacity="0.9"
                      />
                      
                      {/* Train Windows */}
                      <rect
                        x={train.position.x - 12}
                        y={train.position.y - 3}
                        width="3"
                        height="2"
                        fill="#87ceeb"
                        opacity="0.8"
                      />
                      <rect
                        x={train.position.x - 7}
                        y={train.position.y - 3}
                        width="3"
                        height="2"
                        fill="#87ceeb"
                        opacity="0.8"
                      />
                      <rect
                        x={train.position.x - 2}
                        y={train.position.y - 3}
                        width="3"
                        height="2"
                        fill="#87ceeb"
                        opacity="0.8"
                      />
                      <rect
                        x={train.position.x + 7}
                        y={train.position.y - 3}
                        width="4"
                        height="2"
                        fill="#87ceeb"
                        opacity="0.8"
                      />
                      
                      {/* Train wheels - more realistic positioning */}
                      <circle cx={train.position.x - 10} cy={train.position.y + 6} r="2" fill="#374151" stroke="#ffffff" strokeWidth="1" />
                      <circle cx={train.position.x - 4} cy={train.position.y + 6} r="2" fill="#374151" stroke="#ffffff" strokeWidth="1" />
                      <circle cx={train.position.x + 2} cy={train.position.y + 6} r="2" fill="#374151" stroke="#ffffff" strokeWidth="1" />
                      <circle cx={train.position.x + 8} cy={train.position.y + 6} r="2" fill="#374151" stroke="#ffffff" strokeWidth="1" />
                      
                      {/* Status indicator light */}
                      <circle
                        cx={train.position.x + 13}
                        cy={train.position.y - 2}
                        r="1.5"
                        fill={train.status === 'running' ? '#10b981' : train.status === 'delayed' ? '#ef4444' : '#6b7280'}
                        stroke="#ffffff"
                        strokeWidth="0.5"
                      />
                      
                      {/* Train number/ID plate */}
                      <rect
                        x={train.position.x - 14}
                        y={train.position.y + 1}
                        width="8"
                        height="3"
                        fill="#ffffff"
                        stroke="#374151"
                        strokeWidth="0.5"
                        rx="0.5"
                      />
                      
                      {/* Pantograph/Power collector (for electric trains) */}
                      {train.type !== 'freight' && (
                        <line
                          x1={train.position.x}
                          y1={train.position.y - 5}
                          x2={train.position.x}
                          y2={train.position.y - 8}
                          stroke="#666"
                          strokeWidth="1"
                        />
                      )}
                      
                      {/* Cargo containers for freight trains */}
                      {train.type === 'freight' && (
                        <>
                          <rect
                            x={train.position.x - 8}
                            y={train.position.y - 7}
                            width="6"
                            height="4"
                            fill="#8b4513"
                            stroke="#ffffff"
                            strokeWidth="0.5"
                            rx="0.5"
                          />
                          <rect
                            x={train.position.x + 1}
                            y={train.position.y - 7}
                            width="6"
                            height="4"
                            fill="#8b4513"
                            stroke="#ffffff"
                            strokeWidth="0.5"
                            rx="0.5"
                          />
                        </>
                      )}
                    </g>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="p-2">
                      <p className="font-medium">{train.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {train.id}</p>
                      <p className="text-sm">Type: {train.type}</p>
                      <p className="text-sm">Speed: {train.speed} km/h</p>
                      <p className="text-sm">Priority: {train.priority}/10</p>
                      <p className="text-sm">Destination: {train.destination}</p>
                      <p className="text-sm">Status: {train.status}</p>
                      {train.delay > 0 && (
                        <p className="text-sm text-red-500">Delay: {train.delay} min</p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
                
                {/* Train ID and speed display on hover */}
                {hoveredTrain === train.id && (
                  <g>
                    <rect
                      x={train.position.x - 22}
                      y={train.position.y - 32}
                      width="44"
                      height="20"
                      fill="#0f172a"
                      stroke="#ffffff"
                      strokeWidth="1"
                      rx="3"
                      opacity="0.95"
                    />
                    <text
                      x={train.position.x}
                      y={train.position.y - 20}
                      textAnchor="middle"
                      className="fill-white text-xs font-mono"
                      fontSize="10"
                    >
                      {train.id}
                    </text>
                    <text
                      x={train.position.x}
                      y={train.position.y - 30}
                      textAnchor="middle"
                      className="fill-yellow-400 text-xs font-mono"
                      fontSize="9"
                    >
                      {train.speed}km/h
                    </text>
                  </g>
                )}
              </g>
            ))}
            
            {/* Enhanced Legend */}
            <g transform="translate(15, 520)">
              <rect x="0" y="0" width="950" height="80" fill="#0f172a" stroke="#374151" strokeWidth="2" rx="18" opacity="0.98" />
              {/* Track Status */}
              <g>
                <text x="30" y="36" className="fill-white text-sm font-bold" fontSize="14">Track Status:</text>
                <g transform="translate(140, 14)">
                  <rect x="0" y="0" width="70" height="24" rx="8" fill="#1e293b" opacity="0.8" />
                  <line x1="16" y1="12" x2="48" y2="12" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                  <text x="52" y="17" className="fill-slate-300 text-xs" fontSize="12">Clear</text>
                </g>
                <g transform="translate(220, 14)">
                  <rect x="0" y="0" width="90" height="24" rx="8" fill="#1e293b" opacity="0.8" />
                  <line x1="16" y1="12" x2="70" y2="12" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                  <text x="74" y="17" className="fill-slate-300 text-xs" fontSize="12">Occupied</text>
                </g>
                <g transform="translate(330, 14)">
                  <rect x="0" y="0" width="110" height="24" rx="8" fill="#1e293b" opacity="0.8" />
                  <line x1="16" y1="12" x2="90" y2="12" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
                  <text x="94" y="17" className="fill-slate-300 text-xs" fontSize="12">Maintenance</text>
                </g>
              </g>
              {/* Train Types */}
              <g>
                <text x="500" y="36" className="fill-white text-sm font-bold" fontSize="14">Train Types:</text>
                <g transform="translate(600, 14)">
                  <rect x="0" y="0" width="80" height="24" rx="8" fill="#1e293b" opacity="0.8" />
                  <rect x="13" y="6" width="18" height="12" fill="#ef4444" stroke="#ffffff" strokeWidth="1" rx="2" />
                  <polygon points="31,7 37,12 31,17" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                  <text x="43" y="17" className="fill-slate-300 text-xs" fontSize="12">Express</text>
                </g>
                <g transform="translate(690, 14)">
                  <rect x="0" y="0" width="100" height="24" rx="8" fill="#1e293b" opacity="0.8" />
                  <rect x="13" y="6" width="18" height="12" fill="#3b82f6" stroke="#ffffff" strokeWidth="1" rx="2" />
                  <polygon points="31,7 37,12 31,17" fill="#3b82f6" stroke="#ffffff" strokeWidth="1" />
                  <text x="43" y="17" className="fill-slate-300 text-xs" fontSize="12">Passenger</text>
                </g>
                <g transform="translate(800, 14)">
                  <rect x="0" y="0" width="110" height="24" rx="8" fill="#1e293b" opacity="0.8" />
                  <rect x="13" y="6" width="18" height="12" fill="#eab308" stroke="#ffffff" strokeWidth="1" rx="2" />
                  <rect x="18" y="3" width="7" height="6" fill="#8b4513" strokeWidth="1" />
                  <rect x="27" y="3" width="7" height="6" fill="#8b4513" strokeWidth="1" />
                  <polygon points="31,7 37,12 31,17" fill="#eab308" stroke="#ffffff" strokeWidth="1" />
                  <text x="43" y="17" className="fill-slate-300 text-xs" fontSize="12">Freight</text>
                </g>
              </g>
            </g>
          </svg>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default TrackLayout;