'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { bases, operatorColors, type MilitaryBase } from './bases-data'

const START_YEAR = 1950
const END_YEAR = 2026
const MS_PER_YEAR = 100 // 0.1s = 100ms per year

function getActiveBases(year: number): MilitaryBase[] {
  return bases.filter(
    (b) => b.established <= year && (!b.closed || b.closed > year)
  )
}

function getCountByYear(): { year: number; count: number }[] {
  const data: { year: number; count: number }[] = []
  for (let y = START_YEAR; y <= END_YEAR; y++) {
    data.push({ year: y, count: getActiveBases(y).length })
  }
  return data
}

// Mini sparkline drawn on a canvas
function MiniGraph({
  data,
  currentYear,
}: {
  data: { year: number; count: number }[]
  currentYear: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, w, h)

    const maxCount = Math.max(...data.map((d) => d.count))
    const minCount = Math.min(...data.map((d) => d.count))
    const range = maxCount - minCount || 1

    const visibleData = data.filter((d) => d.year <= currentYear)
    if (visibleData.length < 2) return

    const xScale = w / (END_YEAR - START_YEAR)
    const yPad = 4

    // Draw filled area
    ctx.beginPath()
    ctx.moveTo(0, h)
    visibleData.forEach((d) => {
      const x = (d.year - START_YEAR) * xScale
      const y = h - yPad - ((d.count - minCount) / range) * (h - yPad * 2)
      ctx.lineTo(x, y)
    })
    const lastX = (visibleData[visibleData.length - 1].year - START_YEAR) * xScale
    ctx.lineTo(lastX, h)
    ctx.closePath()
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)'
    ctx.fill()

    // Draw line
    ctx.beginPath()
    visibleData.forEach((d, i) => {
      const x = (d.year - START_YEAR) * xScale
      const y = h - yPad - ((d.count - minCount) / range) * (h - yPad * 2)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Current year dot
    const last = visibleData[visibleData.length - 1]
    const dotX = (last.year - START_YEAR) * xScale
    const dotY = h - yPad - ((last.count - minCount) / range) * (h - yPad * 2)
    ctx.beginPath()
    ctx.arc(dotX, dotY, 3, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
  }, [data, currentYear])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  )
}

export default function BasesMapClient() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.CircleMarker[]>([])
  const [year, setYear] = useState(END_YEAR)
  const [playing, setPlaying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countData = useRef(getCountByYear()).current
  const activeBases = getActiveBases(year)

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2.5,
      minZoom: 2,
      maxZoom: 6,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
    })

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
      { subdomains: 'abcd' }
    ).addTo(map)

    // Add sparse labels on top
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
      { subdomains: 'abcd', opacity: 0.4 }
    ).addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Update markers when year changes
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Remove old markers
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    const active = getActiveBases(year)
    active.forEach((base) => {
      const color = operatorColors[base.operator] || '#ffffff'
      const marker = L.circleMarker([base.lat, base.lng], {
        radius: 4,
        fillColor: color,
        fillOpacity: 0.85,
        color: color,
        weight: 1,
        opacity: 0.4,
      })
        .bindTooltip(
          `<strong>${base.name}</strong><br/>${base.operator} in ${base.country}<br/>Est. ${base.established}`,
          { className: 'dark-tooltip' }
        )
        .addTo(map)
      markersRef.current.push(marker)
    })
  }, [year])

  // Play/pause animation
  const play = useCallback(() => {
    setYear(START_YEAR)
    setPlaying(true)
  }, [])

  const pause = useCallback(() => {
    setPlaying(false)
  }, [])

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setYear((y) => {
          if (y >= END_YEAR) {
            setPlaying(false)
            return END_YEAR
          }
          return y + 1
        })
      }, MS_PER_YEAR)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [playing])

  // Operator legend (only show operators present at current year)
  const activeOperators = Array.from(
    new Set(activeBases.map((b) => b.operator))
  ).sort()

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-white overflow-hidden flex flex-col">
      <style jsx global>{`
        .dark-tooltip {
          background: rgba(10, 10, 10, 0.92) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          color: #e5e5e5 !important;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          font-size: 12px !important;
          padding: 6px 10px !important;
          border-radius: 4px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
        }
        .dark-tooltip::before {
          border-top-color: rgba(10, 10, 10, 0.92) !important;
        }
        .leaflet-container {
          background: #0a0a0a !important;
        }
      `}</style>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] pointer-events-none">
        <div className="px-6 pt-5 pb-3">
          <div className="flex items-baseline gap-4">
            <span className="text-5xl font-light tabular-nums tracking-tight">
              {activeBases.length}
            </span>
            <span className="text-lg text-neutral-400 font-light">
              foreign military bases
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-1 font-light">
            {year} &middot; operated by{' '}
            {activeOperators.length} countries
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-5 right-6 z-[1000] pointer-events-none">
        <div className="flex flex-col gap-1">
          {activeOperators.map((op) => (
            <div key={op} className="flex items-center gap-2 text-xs text-neutral-400">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: operatorColors[op] || '#fff' }}
              />
              <span>{op}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div ref={mapRef} className="flex-1 w-full" />

      {/* Bottom controls */}
      <div className="bg-[#0a0a0a] border-t border-neutral-800 px-6 py-4 z-[1000]">
        <div className="flex items-center gap-4">
          {/* Play button */}
          <button
            onClick={playing ? pause : play}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-600 hover:border-neutral-400 transition-colors shrink-0"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <rect x="2" y="1" width="3.5" height="12" rx="1" />
                <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <path d="M3 1.5v11l9-5.5z" />
              </svg>
            )}
          </button>

          {/* Timeline */}
          <div className="flex-1 flex flex-col gap-1">
            {/* Mini graph */}
            <div className="h-8 w-full">
              <MiniGraph data={countData} currentYear={year} />
            </div>

            {/* Scrubber */}
            <input
              type="range"
              min={START_YEAR}
              max={END_YEAR}
              value={year}
              onChange={(e) => {
                setPlaying(false)
                setYear(Number(e.target.value))
              }}
              className="w-full appearance-none bg-transparent cursor-pointer
                [&::-webkit-slider-runnable-track]:h-[2px] [&::-webkit-slider-runnable-track]:bg-neutral-700
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:-mt-[5px]
                [&::-moz-range-track]:h-[2px] [&::-moz-range-track]:bg-neutral-700
                [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
            />

            {/* Year labels */}
            <div className="flex justify-between text-xs text-neutral-500 tabular-nums">
              <span>{START_YEAR}</span>
              <span>{END_YEAR}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
