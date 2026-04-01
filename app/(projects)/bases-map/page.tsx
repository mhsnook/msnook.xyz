import type { Metadata } from 'next'
import BasesMapClient from './bases-map-client'

export const metadata: Metadata = {
  title: 'Foreign Military Bases Worldwide',
  description:
    'An interactive timeline map of foreign military bases around the world, from 1950 to 2026.',
}

export default function BasesMapPage() {
  return <BasesMapClient />
}
