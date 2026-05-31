import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { formatCurrency } from '../utils/formatters'

// Fix leaflet default icon path issue with Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [0, -32],
  shadowSize: [32, 32],
})

// Coordenadas aproximadas por cidade/estado
const LOCATION_COORDS = {
  'Uberaba, MG':       [-19.7476, -47.9307],
  'Três Corações, MG': [-21.6917, -45.2670],
  'Chapecó, SC':       [-27.1007, -52.6152],
  'Passo Fundo, RS':   [-28.2577, -52.4071],
  'Jataí, GO':         [-17.8802, -51.7128],
  'Barretos, SP':      [-20.5571, -48.5678],
  'Rondonópolis, MT':  [-16.4727, -54.6361],
  'Maringá, PR':       [-23.4273, -51.9375],
  'Dourados, MS':      [-22.2208, -54.8055],
  'Petrolina, PE':     [-9.3891, -40.5019],
}

function getCoords(location) {
  if (LOCATION_COORDS[location]) return LOCATION_COORDS[location]
  // Fallback: distribui aleatório mas consistente por string hash
  const hash = [...location].reduce((a, c) => a + c.charCodeAt(0), 0)
  const lat = -10 - (hash % 20)
  const lng = -45 - (hash % 20)
  return [lat, lng]
}

function FitBounds({ animals }) {
  const map = useMap()
  useEffect(() => {
    if (!animals.length) return
    const coords = animals.map((a) => getCoords(a.location))
    if (coords.length === 1) {
      map.setView(coords[0], 7)
    } else {
      map.fitBounds(L.latLngBounds(coords), { padding: [40, 40] })
    }
  }, [animals, map])
  return null
}

export default function MapaCatalogo({ animals }) {
  return (
    <div className="border border-slate-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-600">
          Mapa de lotes — {animals.length} resultado{animals.length !== 1 ? 's' : ''}
        </p>
        <p className="text-xs text-slate-400">Clique no marcador para ver detalhes</p>
      </div>
      <MapContainer
        center={[-15.7801, -47.9292]}
        zoom={5}
        style={{ height: 480, width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds animals={animals} />
        {animals.map((animal) => {
          const [lat, lng] = getCoords(animal.location)
          return (
            <Marker key={animal.id} position={[lat, lng]} icon={customIcon}>
              <Popup maxWidth={240}>
                <div className="min-w-44">
                  <img
                    src={animal.image}
                    alt={animal.title}
                    className="mb-2 h-24 w-full object-cover"
                  />
                  <p className="font-bold text-emerald-950 text-sm leading-tight">{animal.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{animal.location}</p>
                  <p className="mt-1 text-sm font-black text-emerald-700">{formatCurrency(animal.price)}</p>
                  <p className="text-xs text-slate-400">{animal.quantity} cabeças · Score {animal.traceability}%</p>
                  <Link
                    to={`/anuncio/${animal.id}`}
                    className="mt-2 block w-full bg-emerald-600 px-3 py-1.5 text-center text-xs font-bold text-white hover:bg-emerald-700 transition"
                  >
                    Ver anúncio →
                  </Link>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
