'use client'

import {
  MapContainer,
  TileLayer,
  LayersControl,
  useMap,
} from 'react-leaflet';
import 'leaflet-side-by-side';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { useLocale, useTranslations } from 'next-intl'
import { forestData } from '@/data/data'
import { useEffect, useRef, useState } from 'react'
import '@/app/[locale]/globals.css'
import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  PieController,
  ArcElement
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { convertToMyanmarNumber } from '../utils/convertToMMNumbers'

// Register all required components
Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  PieController,
  ArcElement,
  ChartDataLabels
);

// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x.src,
//   iconUrl: markerIcon.src,
//   shadowUrl: markerShadow.src,
// });

function SideBySideLayer({ leftYear, rightYear, state }: { leftYear: string, rightYear: string, state: string }) {
  const map = useMap();
  const leftLayerRef = useRef<L.TileLayer | null>(null);
  const rightLayerRef = useRef<L.TileLayer | null>(null);
  const BASE_URL = "http://localhost";

  useEffect(() => {
    if (map && leftLayerRef.current && rightLayerRef.current) {
      // @ts-ignore
      const sideBySide = L.control.sideBySide(
        leftLayerRef.current,
        rightLayerRef.current
      );
      sideBySide.addTo(map);

      return () => {
        map.removeControl(sideBySide);
      };
    }
  }, [map]);

  return (
    <>
      <TileLayer
        url={`${BASE_URL}:3001/api/maptiles/forest/${state}_${leftYear}/{z}/{x}/{y}.png`}
        maxZoom={20}
        ref={(ref) => { leftLayerRef.current = ref; }}
      />
      <TileLayer
        url={`${BASE_URL}:3001/api/maptiles/forest/${state}_${rightYear}/{z}/{x}/{y}.png`}
        maxZoom={20}
        ref={(ref) => { rightLayerRef.current = ref; }}
      />
    </>
  );
}


export default function ForestClient() {
  const t = useTranslations();
  const locale = useLocale();
  //  console.log("Locale:", locale)

  const { BaseLayer } = LayersControl;
  const [leftYear, setLeftYear] = useState('2020');
  const [rightYear, setRightYear] = useState('2021');
  const [basemap, setBasemap] = useState('googleSatHybrid');

  const basemaps = {
    "googleSatHybrid": {
      attribution: "&copy; Google Hybrid",
      url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
    },
    "OSM": {
      attribution: "&copy; OpenStreetMap",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    },
    "ESRITopo": {
      attribution: "&copy; ESRI Topo",
      url: "https://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
    }
  }
  const state = 'yangon';
  
  const forestChartRef = useRef<HTMLCanvasElement>(null);
  const forestChartInstance = useRef<Chart | null>(null);


  useEffect(()=>{
    if (!forestChartRef.current) return;
    const ctx = forestChartRef.current.getContext("2d");
    if (!ctx) return;

    if (forestChartInstance.current) {
      forestChartInstance.current.destroy();
    }

    forestChartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: forestData.map((data: { year: string }) => data.year),
        datasets: [
          {
            label: t('FORESTSOIL.area'),
            data: forestData.map((data: { area: number }) => data.area),
            backgroundColor: "rgba(54, 255, 110, 1)",
            borderColor: "rgba(54, 255, 110, 1)",
            borderWidth: 1
          },
      
         
        ]
      },
      options: {
        responsive: true,
        plugins: {
            datalabels: {
            color: '#3330',
            font: {
                weight: 'bold' as const
            },
            formatter: (value, context) => {
                const data = context.chart.data.datasets[0].data as number[];
                const total = data.reduce((sum, val) => sum + val, 0);
                const percent = ((value / total) * 100).toFixed(1);
                return `${value.toLocaleString()} (${percent}%)`;
            }
            },
            legend: {
              position: 'top',
              labels: {
                color: '#fff'
              }
            },
          
            // tooltip: {
            //     enabled: true // Optional: keep tooltips
            // }
        },
        scales: {
            x: {
              ticks: {
                color: '#fff'
              }
            },
            y: { 
              beginAtZero: true 
            }
        }
      }
    })

  }, [])


  return (
    <div className="flex flex-col items-center p-6" style={{ fontFamily: 'Pyidaungsu', height: '100%'}}>
        <h2 className='mb-20 text-5xl font-bold' style={{
            marginBottom: "50px",
            color: 'white'
        }}>{t(`APPS.forest.name`)}</h2>
        {/* <p className='text-xl' style={{
            marginBottom: "50px",
            textIndent: "50px",
            lineHeight: "2"
        }}>{t('RIVER.about')}</p> */}
        
        <div className="flex mt-6 items-start" style={{justifyContent: 'center',  width: '100%', height: '100%', paddingLeft: '5%', paddingRight: '5%', gap: '5%'}}>

          <div className='flex flex-col' style={{width: '50%', height: '90%', alignItems: 'center', justifyContent: 'center'}}>
            <div className='flex' style={{width: '100%', justifyContent: 'space-between', color: 'white'}}>
              <div>
                <select
                  value={leftYear}
                  onChange={(e)=>setLeftYear(e.target.value)}
                  style={{color: 'white', background: '#0b0b2b'}}
                >
                  <option value="2020">2020</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <div>
                <select
                  value={basemap}
                  onChange={(e)=>setBasemap(e.target.value)}
                  style={{color: 'white', background: '#0b0b2b'}}
                >
                  <option value="googleSatHybrid">Google Satellite Hybrid</option>
                  <option value="OSM">Open Street Map</option>
                  <option value="ESRITopo">ESRI Topo</option>
                </select>
              </div>

              <div>
                <select
                  value={rightYear}
                  onChange={(e)=>setRightYear(e.target.value)}
                  style={{color: 'white', background: '#0b0b2b'}}
                >
                  <option value="2020">2020</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
              </div>

            </div>
            <MapContainer
              center={[19, 96.0891]}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
            >
              
              {/* <LayersControl position="topright">
                <BaseLayer checked name="OpenStreetMap">
                  <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                  />
                </BaseLayer>

                <BaseLayer name="ESRI Topo">
                  <TileLayer
                    attribution="&copy; ESRI Topo"
                    url="https://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={19}
                  />
                </BaseLayer>

                <BaseLayer name="Google Hybrid">
                  <TileLayer
                    attribution="&copy; Google Hybrid"
                    url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                    maxZoom={20}
                  />
                </BaseLayer>
              </LayersControl> */}

              <TileLayer
                    attribution={basemaps[basemap].attribution}
                    url={basemaps[basemap].url}
                    maxZoom={20}
              />

              <SideBySideLayer
                leftYear={leftYear}
                rightYear={rightYear}
                state={state}
              />
              
            </MapContainer>

          </div>

          {/* Forest */}
          <div style={{width: '30%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem'}}>
            <p className='font-bold text-center' style={{color: 'white'}}>{t('FORESTSOIL.forestTitle')}</p>

            <img src="/images/forest-soil/forest_yangon.gif" alt="" style={{width: '30%'}}/>

            <div className='borde' style={{display: 'flex', flexDirection: 'column', justifyContent:'center',  width: '100%', height: '40%', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '10px'}}>
                <canvas ref={forestChartRef}></canvas>
            </div>

            <div className="overflow-x-auto h-full" style={{width: '100%', height: '40%', display: 'flex', flexDirection: 'column'}}>
                  <table className="min-w-1/2 border border-gray-400 text-sm" style={{height: '100%'}}>
                      <thead style={{background: "rgb(125, 230, 230)"}}>
                      <tr>
                          <th></th>
                          <th className="border border-gray-400 px-4 py-2 text-center">{t('FORESTSOIL.year')}</th>
                          <th className="border border-gray-400 px-4 py-2 text-center">{t('FORESTSOIL.area')}</th>
                      </tr>
                      </thead>
                      <tbody className='bg-gray-50'>
                      {forestData.map((row: { year: string; area: number}, idx: number) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="border border-gray-400 px-4 py-2 text-right" align="right">{idx + 1}</td>
                            <td className="border border-gray-400 px-4 py-2 text-left">{row.year}</td>
                            <td className="border border-gray-400 px-4 py-2 text-right" align="right">{locale === 'mm' ? convertToMyanmarNumber(row.area) : row.area.toLocaleString("en-US")}</td>
                            
                          </tr>
                      ))}
                      </tbody>
                  </table>
                </div>
          </div>

        </div>
    </div>

  )
}
