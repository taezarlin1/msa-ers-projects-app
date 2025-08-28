'use client'

import {
  MapContainer, 
  TileLayer, 
  GeoJSON,
  LayersControl,
  
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import '@/app/[locale]/globals.css'
import './styles.css'
import {
  Chart,
  BarController,
  BarElement,
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
// import MyanmarMap from './MyanmarMap'
import { recievedMapData } from '@/data/recievedMapData'

// Register all required components
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  PieController,
  ArcElement,
  ChartDataLabels
);


export default function ReceivedMapClient() {
  const t = useTranslations();
  const { BaseLayer } = LayersControl;
  const BASE_URL = "http://localhost";
  // const BASE_URL = "http://192.168.2.145";
  // const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [receivedMaps, setReceivedMaps] = useState(null);
  const [stateRegions, setStateRegions] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}:3001/api/geojsons/received-map/receivedMaps.geojson`, {
      credentials: "include" // ✅ include cookies
    })
      .then((res) => res.json())
      .then((data) => setReceivedMaps(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}:3001/api/geojsons/received-map/StateAndRegion.geojson`, {
      credentials: "include" // ✅ include cookies
    })
      .then((res) => res.json())
      .then((data) => setStateRegions(data))
      .catch(err => console.error(err));
  }, []);



  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const handleRegionClick = (regionId: string) => {
    setSelectedRegion(regionId)
  }

  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "2024-01-01",
    end: "2025-12-31"
  });

  const [resolution, setResolution] = useState<string>('All');
  const [satellite, setSatellite] = useState<string>('All');

  let filteredData;

  let townMap: Record<string, number> = {};

  if (selectedRegion !== 'All') {
    filteredData = recievedMapData[selectedRegion]
      .filter((data) => {
        const d = new Date(data.Date.split("/").reverse().join("-"));
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);

        const inDateRange = d >= start && d <= end;
        const resolutionMatch =
          resolution === 'All' || data.Resolution === parseFloat(resolution);
        const satelliteMatch =
          satellite === 'All' || data.Satellite === satellite;

        return inDateRange && resolutionMatch && satelliteMatch;
      });

    // Group by Town
    filteredData.forEach((item) => {
      if (!townMap[item.Town]) townMap[item.Town] = 0;
      townMap[item.Town] += item.Area;
    });
  } else {
    // selectedRegion === 'All'
    townMap = {};
    for (const region in recievedMapData) {
      const regionData = recievedMapData[region].filter((data) => {
        const d = new Date(data.Date.split("/").reverse().join("-"));
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);

        const inDateRange = d >= start && d <= end;
        const resolutionMatch =
          resolution === 'All' || data.Resolution === parseFloat(resolution);
        const satelliteMatch =
          satellite === 'All' || data.Satellite === satellite;

        return inDateRange && resolutionMatch && satelliteMatch;
      });

      const totalRegionArea = regionData.reduce((sum, item) => sum + item.Area, 0);
      if (totalRegionArea > 0) {
        townMap[region] = totalRegionArea;
      }
    }
  }

  

  const labels = Object.keys(townMap);
  const statesRegionsLabels = ['ကချင်ပြည်နယ်', 'ကယားပြည်နယ်', 'ကရင်ပြည်နယ်', 'ချင်းပြည်နယ်', 'စစ်ကိုင်းတိုင်းဒေသကြီး', 'တနင်္သာရီတိုင်းဒေသကြီး', 'ပဲခူးတိုင်းဒေသကြီး', 'မကွေးတိုင်းဒေသကြီး', 'မန္တလေးတိုင်းဒေသကြီး', 'မွန်ပြည်နယ်', 'ရခိုင်ပြည်နယ်', 'ရန်ကုန်တိုင်းဒေသကြီး', 'ရှမ်းပြည်နယ်', 'ဧရာဝတီတိုင်းဒေသကြီး', 'နေပြည်တော်']
  const data = Object.values(townMap);

  const totalArea = data.reduce((sum, value) => sum + value, 0);
  const formattedTotal = totalArea.toFixed(2); // Two decimal places

  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const barCtx = chartRef.current?.getContext("2d");
    if (!barCtx) return;

    const barChart = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: selectedRegion === 'All' ?  statesRegionsLabels : labels,
        datasets: [
          {
            label: "ဧရိယာ (စတုရန်းကီလိုမီတာ)",
            data: data,
            backgroundColor: "rgba(54, 162, 235, 1)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1
          }
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
                color: '#000'
              }
            },
          
            // tooltip: {
            //     enabled: true // Optional: keep tooltips
            // }
        },
        scales: {
            x: {
              ticks: {
                color: '#000'
              }
            },
            y: { 
              beginAtZero: true 
            }
        }
      }
    });


    return () => {
        barChart.destroy();
    };
  }, [townMap])

  return (
    <div className="flex flex-col items-center p-6" style={{fontFamily: 'Pyidaungsu',height: '100%'}}>
        <h2 className='mb-20 text-5xl font-bold' style={{
            marginBottom: "50px",
            color: 'white'
        }}>{t(`APPS.receiveMap.name`)}</h2>
        {/* <p className='text-xl' style={{
            marginBottom: "50px",
            textIndent: "50px",
            lineHeight: "3"
        }}>{t('STATES.info')}</p> */}
        

        <div className="flex mt-6 items-start" style={{justifyContent: 'space-around',  width: '100%', height: '100%'}}>
            {/* <div style={{width: '300px'}}>
              <MyanmarMap selectedRegion={selectedRegion} handleRegionClick={handleRegionClick}/>
            </div> */}

            <div className='flex' style={{width: '60%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                <MapContainer
                  center={[19, 96.0891]}
                  zoom={6}
                  style={{ height: '100%', width: '100%' }}
                >
                  <LayersControl position="topright">
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
                  </LayersControl>

                  {receivedMaps && <GeoJSON data={receivedMaps as any} />}

                  {stateRegions && (
                    <GeoJSON
                      data={stateRegions as any}
                      style={(feature: any) => {
                        const regionName = feature.properties?.ST || ""; // change property name based on your GeoJSON
                        const isSelected = selectedRegion !== "All" && regionName === selectedRegion;

                        if (selectedRegion === "All") {
                          return {
                            color: "indigo",         // border
                            weight: 2,               // border thickness
                            fillColor: "transparent",// no fill
                            fillOpacity: 0           // fully transparent
                          };
                        }

                        if (isSelected) {
                          return {
                            color: "indigo",         // border
                            weight: 2,
                            fillColor: "transparent",
                            fillOpacity: 0
                          };
                        } else {
                          return {
                            color: "indigo",         // border color
                            weight: 1,
                            fillColor: "indigo",     // filled indigo
                            fillOpacity: 1         // semi-transparent fill
                          };
                        }
                      }}
                    />
                  )}
                </MapContainer>
            </div>

            <div style={{width:'100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '50px', paddingRight: '50px', }}>
                <div className='flex' style={{width: '100%', justifyContent: 'space-around', color: 'white'}}>
                  <button onClick={()=>handleRegionClick('All')} style={{width: '100%', paddingLeft: '5px', paddingRight: '5px', borderRadius: '10px', border: '1px solid white', background: `${selectedRegion === 'All' ? 'green' : ''}`, cursor: 'pointer'}}>All</button>
                  <button onClick={()=>handleRegionClick('Kachin')} style={{width: '100%', paddingLeft: '5px', paddingRight: '5px', borderRadius: '10px', border: '1px solid white', background: `${selectedRegion === 'Kachin' ? 'green' : ''}`, cursor: 'pointer'}}>Kachin</button>
                  <button onClick={()=>handleRegionClick('Kayah')} style={{width: '100%', paddingLeft: '5px', paddingRight: '5px', borderRadius: '10px', border: '1px solid white', background: `${selectedRegion === 'Kayah' ? 'green' : ''}`, cursor: 'pointer'}}>Kayah</button>
                  <button onClick={()=>handleRegionClick('Kayin')} style={{width: '100%', paddingLeft: '5px', paddingRight: '5px', borderRadius: '10px', border: '1px solid white', background: `${selectedRegion === 'Kayin' ? 'green' : ''}`, cursor: 'pointer'}}>Kayin</button>
                  <button onClick={()=>handleRegionClick('Chin')} style={{width: '100%', paddingLeft: '5px', paddingRight: '5px', borderRadius: '10px', border: '1px solid white', background: `${selectedRegion === 'Chin' ? 'green' : ''}`, cursor: 'pointer'}}>Chin</button>
                  <button onClick={()=>handleRegionClick('Sagaing')} style={{width: '100%', paddingLeft: '5px', paddingRight: '5px', borderRadius: '10px', border: '1px solid white', background: `${selectedRegion === 'Sagaing' ? 'green' : ''}`, cursor: 'pointer'}}>Sagaing</button>
                  <button onClick={()=>handleRegionClick('Tanintharyi')} style={{width: '100%', paddingLeft: '5px', paddingRight: '5px', borderRadius: '10px', border: '1px solid white', background: `${selectedRegion === 'Tanintharyi' ? 'green' : ''}`, cursor: 'pointer'}}>Tanintharyi</button>
                  <button onClick={()=>handleRegionClick('Bago')} style={{width: '100%', paddingLeft: '5px', paddingRight: '5px', borderRadius: '10px', border: '1px solid white', background: `${selectedRegion === 'Bago' ? 'green' : ''}`, cursor: 'pointer'}}>Bago</button>
                  
                </div>

                <div className='flex' style={{width: '100%', justifyContent: 'space-around', marginTop: '1%', color: 'white'}}>
                  <button onClick={()=>handleRegionClick('Magway')} style={{width: '100%', paddingLeft: '5px', paddingRight: '5px', borderRadius: '10px', border: '1px solid white', background: `${selectedRegion === 'Magway' ? 'green' : ''}`, cursor: 'pointer'}}>Magway</button>
                  <button onClick={()=>handleRegionClick('Mandalay')} style={{width: '100%', paddingLeft: '5px', paddingRight: '5px', borderRadius: '10px', border: '1px solid white', background: `${selectedRegion === 'Mandalay' ? 'green' : ''}`, cursor: 'pointer'}}>Mandalay</button>
                  <button onClick={()=>handleRegionClick('Mon')} style={{width: '100%', paddingLeft: '5px', paddingRight: '5px', borderRadius: '10px', border: '1px solid white', background: `${selectedRegion === 'Mon' ? 'green' : ''}`, cursor: 'pointer'}}>Mon</button>
                  <button onClick={()=>handleRegionClick('Rakhine')} style={{width: '100%', paddingLeft: '5px', paddingRight: '5px', borderRadius: '10px', border: '1px solid white', background: `${selectedRegion === 'Rakhine' ? 'green' : ''}`, cursor: 'pointer'}}>Rakhine</button>
                  <button onClick={()=>handleRegionClick('Yangon')} style={{width: '100%', paddingLeft: '5px', paddingRight: '5px', borderRadius: '10px', border: '1px solid white', background: `${selectedRegion === 'Yangon' ? 'green' : ''}`, cursor: 'pointer'}}>Yangon</button>
                  <button onClick={()=>handleRegionClick('Shan')} style={{width: '100%', paddingLeft: '5px', paddingRight: '5px', borderRadius: '10px', border: '1px solid white', background: `${selectedRegion === 'Shan' ? 'green' : ''}`, cursor: 'pointer'}}>Shan</button>
                  <button onClick={()=>handleRegionClick('Ayeyarwady')} style={{width: '100%', paddingLeft: '5px', paddingRight: '5px', borderRadius: '10px', border: '1px solid white', background: `${selectedRegion === 'Ayeyarwady' ? 'green' : ''}`, cursor: 'pointer'}}>Irrawaddy</button>
                  <button onClick={()=>handleRegionClick('Nay Pyi Taw')} style={{width: '100%', paddingLeft: '5px', paddingRight: '5px', borderRadius: '10px', border: '1px solid white', background: `${selectedRegion === 'Nay Pyi Taw' ? 'green' : ''}`, cursor: 'pointer'}}>Naypyitaw</button>
                </div>

              <div className="flex flex-col sm:flex-row gap-6 my-4 items-center">
                
              {/* Date Range Pickers */}
                <div className="flex gap-2 items-center">
                  <label className="text-sm font-medium" style={{color: 'grey'}}>Date:</label>
                  <input
                    type="date"
                    className="border px-2 py-1 rounded"
                    style={{background: 'rgb(125, 230, 230)'}}
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                </div>
                <label className="text-sm font-medium" style={{color: 'grey'}}>-</label>
                <div className="flex items-center">
                  <input
                    type="date"
                    className="border px-2 py-1 rounded"
                    style={{background: 'rgb(125, 230, 230)'}}
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </div>

                {/* Resolution */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium" style={{color: 'grey'}}>Resolution:</label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="border px-2 py-1 rounded"
                    style={{background: 'rgb(125, 230, 230)'}}
                  >
                    <option value="All">All</option>
                    <option value="0.5">0.5</option>
                    <option value="0.7">0.7</option>
                    <option value="0.8">0.8</option>
                    <option value="1.0">1.0</option>
                    <option value="2">2</option>
                  </select>
                </div>

                {/* Satellite */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium" style={{color: 'grey'}}>Satellite:</label>
                  <select
                    value={satellite}
                    onChange={(e) => setSatellite(e.target.value)}
                    className="border px-2 py-1 rounded"
                    style={{background: 'rgb(125, 230, 230)'}}
                  >
                    <option value="All">All</option>
                    <option value="Resurs_P">Resurs_P</option>
                    <option value="Kanopus_V">Kanopus_V</option>
                    <option value="Jilin">Jilin</option>
                    <option value="WorldView">WorldView</option>
                    <option value="Satellogic">Satellogic</option>
                    <option value="Catosat">Catosat</option>
                    <option value="GeoSat">GeoSat</option>
                    <option value="Gaofan_7">Gaofan_7</option>
                  </select>
                </div>
              </div>

              <div style={{marginTop: '10px', marginBottom: '10px', width: '600px', height: '560px', overflowY: 'auto'}}>
                <table className="w-full border border-gray-400 text-sm border-collapse" style={{borderCollapse: 'collapse', border: '1px solid black'}}>
                 <thead style={{background: "rgb(125, 230, 230)", position: 'sticky', top: '0.1px', border: '1px solid black'}}>
                    <tr>
                        <th className="border border-gray-400 px-4 py-2 text-center">စဉ်</th>
                        <th className="border border-gray-400 px-4 py-2 text-center">နေရာ</th>
                        <th className="border border-gray-400 px-4 py-2 text-center">ဧရိယာ (စတုရန်းကီလိုမီတာ)</th>
                    </tr>
                  </thead>
                  <tbody className='bg-gray-50'>

                    {selectedRegion === 'All' ? 
                      statesRegionsLabels.map((label: string, idx: number)=>(
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="border border-gray-400 px-4 py-2 text-right" align="right">{convertToMyanmarNumber(idx + 1)}</td>
                          <td className="border border-gray-400 px-4 py-2 text-left" align="left">{label}</td>
                          <td className="border border-gray-400 px-4 py-2 text-right" align="right">
                            {Number(data[idx]).toFixed(2)}
                          </td>
                        </tr>
                      )) : labels.map((label: string, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="border border-gray-400 px-4 py-2 text-right" align="right">{convertToMyanmarNumber(idx + 1)}</td>
                          <td className="border border-gray-400 px-4 py-2 text-left" align="left">{label}</td>
                          <td className="border border-gray-400 px-4 py-2 text-right" align="right">
                            {Number(data[idx]).toFixed(2)}
                          </td>
                        </tr>
                    ))}
                    <tr className="bg-gray-200 font-semibold">
                      <td className="border border-gray-400 px-4 py-2 text-center" colSpan={2}>စုစုပေါင်း</td>
                      <td className="border border-gray-400 px-4 py-2 text-right">{formattedTotal}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* <a href="https://earth.google.com/earth/d/1wHhU9XWSD8V3CdKIHWJA2mjhj5z0IVC8?usp=sharing" style={{color: 'navy'}}>Click here to see <span style={{fontWeight:'bold'}}>Shape Files</span></a> */}
            </div>

            <div style={{ width: '100%', height: '600px', background: 'rgba(255, 255, 255, 1)', borderRadius: '10px' }}>
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    </div>

  )
}
