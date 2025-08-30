'use client'

import {
  MapContainer,
  TileLayer,
  LayersControl,
  useMap,
  GeoJSON
} from 'react-leaflet';
import 'leaflet-side-by-side';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { useLocale, useTranslations } from 'next-intl'
import { censusData } from '@/data/data'
import { useEffect, useRef, useState } from 'react'
import '@/app/[locale]/globals.css'
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
import YoloONNX from './OnnxClient'
import { buildingData } from '@/data/buildingData'

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


type Props = {
  stateRegion: string;
  leftYear: string;
  rightYear: string;
  leftMaps: string[];
  leftBuildings: string[];
  rightMaps: string[];
  rightBuildings: string[];
};

const BASE_URL = "http://localhost";

function SideBySideLayer({
  stateRegion,
  leftYear,
  rightYear,
  leftMaps,
  leftBuildings,
  rightMaps,
  rightBuildings,
}: Props) {
  const map = useMap();
  const sideRef = useRef<any>(null);
  const leftLayersRef = useRef<L.TileLayer[]>([]);
  const rightLayersRef = useRef<L.TileLayer[]>([]);
  const buildingLayersRef = useRef<L.Layer[]>([]);

  useEffect(() => {
    if (!map) return;
    let cancelled = false;

    const makeTile = (ts: string, year: string) =>
      L.tileLayer(
        `${BASE_URL}:3001/api/maptiles/building/${ts}_${year}/{z}/{x}/{y}.png`,
        { maxZoom: 20 }
      );

    const fetchGJ = async (ts: string, year: string, color: string) => {
      try {
        const res = await fetch(
          `/geojsons/building-footprints/${stateRegion}/${ts}/${ts}_${year}.geojson`
        );
        if (!res.ok) return null;
        const data = await res.json();
        return L.geoJSON(data, {
          style: { color, weight: 2, fillOpacity: 0 },
        });
      } catch {
        return null;
      }
    };

    async function rebuild() {
      // 1) Cleanup old
      leftLayersRef.current.forEach(l => map.removeLayer(l));
      rightLayersRef.current.forEach(l => map.removeLayer(l));
      buildingLayersRef.current.forEach(l => map.removeLayer(l));
      leftLayersRef.current = [];
      rightLayersRef.current = [];
      buildingLayersRef.current = [];
      if (sideRef.current) {
        map.removeControl(sideRef.current);
        sideRef.current = null;
      }

      // 2) Create tile layers
      const leftTiles = leftMaps.map(ts => makeTile(ts, leftYear));
      const rightTiles = rightMaps.map(ts => makeTile(ts, rightYear));

      // 3) Create building overlays (add normally, not to side-by-side)
      const [leftGJ, rightGJ] = await Promise.all([
        Promise.all(leftBuildings.map(ts => fetchGJ(ts, leftYear, '#00ffff'))),
        Promise.all(rightBuildings.map(ts => fetchGJ(ts, rightYear, 'orange'))),
      ]);

      const buildings = [
        ...leftGJ.filter(Boolean),
        ...rightGJ.filter(Boolean),
      ] as L.Layer[];

      if (cancelled) return;

      // 4) Add to map
      leftTiles.forEach(l => l.addTo(map));
      rightTiles.forEach(l => l.addTo(map));
      buildings.forEach(l => l.addTo(map));

      leftLayersRef.current = leftTiles;
      rightLayersRef.current = rightTiles;
      buildingLayersRef.current = buildings;

      // 5) Setup side-by-side with ONLY tile layers
      if (leftTiles.length && rightTiles.length) {
        // @ts-ignore
        sideRef.current = L.control.sideBySide(leftTiles, rightTiles).addTo(map);
      }
    }

    rebuild();

    return () => {
      cancelled = true;
      if (sideRef.current) {
        map.removeControl(sideRef.current);
        sideRef.current = null;
      }
      [...leftLayersRef.current, ...rightLayersRef.current, ...buildingLayersRef.current].forEach(l =>
        map.removeLayer(l)
      );
    };
  }, [
    map,
    stateRegion,
    leftYear,
    rightYear,
    JSON.stringify(leftMaps),
    JSON.stringify(rightMaps),
    JSON.stringify(leftBuildings),
    JSON.stringify(rightBuildings),
  ]);

  return null;
}


export default function BuildingClient() {
  const t = useTranslations();
  const locale = useLocale();
//   console.log("Locale:", locale)

  const [currentTab, setCurrentTab] = useState("about");
  const [stateRegion, setStateRegion] = useState("All");
  const [district, setDistrict] = useState("All");
  const [township,setTownship] = useState("All");
  const stateOptions = Object.keys(buildingData);
  const districtOptions = stateRegion !== "All"
      ? Object.keys(buildingData[stateRegion])
      : [];
  const townshipOptions = (stateRegion !== "All" && district !== "All")
      ? Object.keys(buildingData[stateRegion][district])
      : [];
  const [leftYear, setLeftYear] = useState("2005");
  const [rightYear, setRightYear] = useState("2025");

  const [leftMaps, setLeftMaps] = useState([]);
  const [leftBuildings, setLeftBuildings] = useState([]);
  const [rightMaps, setRightMaps] = useState([]);
  const [rightBuildings, setRightBuildings] = useState([]);

  const [basemap, setBasemap] = useState('ESRITopo');
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

  const leftMapCheckHandler = (e) => {
    if (e.target.checked) {
      setLeftMaps(prev => [...prev, e.target.name]);
    } else {
      setLeftMaps(prev => prev.filter(map => map !== e.target.name));
    }
  };

  const leftBuildingCheckHandler = (e) => {
    if (e.target.checked) {
      setLeftBuildings(prev => [...prev, e.target.name]);
    } else {
      setLeftBuildings(prev => prev.filter(building => building !== e.target.name));
    }
  };

  const rightMapCheckHandler = (e) => {
    if (e.target.checked) {
      setRightMaps(prev => [...prev, e.target.name]);
    } else {
      setRightMaps(prev => prev.filter(map => map !== e.target.name));
    }
  }

  const rightBuildingCheckHandler = (e) => {
    if (e.target.checked) {
      setRightBuildings(prev => [...prev, e.target.name]);
    } else {
      setRightBuildings(prev => prev.filter(building => building !== e.target.name));
    }
  }


  const chartRef = useRef<HTMLCanvasElement>(null)
  const pieRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (currentTab !== "applied") return; // only run when applied tab is active

    const barCtx = chartRef.current?.getContext("2d");
    const pieCtx = pieRef.current?.getContext("2d");
    if (!barCtx || !pieCtx) return;

    const barChart = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: censusData.map(data => t(`STATES.${data.id}`)),
        datasets: [
          {
            label: t('CENSUS.enu'),
            data: censusData.map(data => data.enu),
            backgroundColor: "rgba(54, 162, 235, 1)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1
          },
          {
            label: t('CENSUS.nonEnu'),
            data: censusData.map(data => data.nonEnu),
            backgroundColor: "rgba(54, 262, 35, 1)",
            borderColor: "rgba(54, 262, 35, 1)",
            borderWidth: 1
          },
          {
            label: t('CENSUS.total'),
            data: censusData.map(data => data.total),
            backgroundColor: "rgba(255, 222, 35, 1)",
            borderColor: "rgba(255, 222, 35, 1)",
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

    const pieChart = new Chart(pieCtx, {
        type: "pie",
        data: {
        labels: [t('CENSUS.enu'), t('CENSUS.nonEnu')],
        datasets: [
            {
                data: [32191407, 19125349],
                backgroundColor: [
                'rgba(54, 162, 235, 1)', 'rgba(54, 262, 35, 1)', 'rgba(242, 54, 35, 1)' 
                ]
            }
        ]
        },
        options: {
            responsive: true,
            plugins: {
                datalabels: {
                color: '#333',
                font: {
                    weight: 'normal' as const
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
        },
        plugins: [ChartDataLabels]

    });

    return () => {
        barChart.destroy();
        pieChart.destroy();
    };
  }, [t, currentTab])

  return (
    <div className="h-full flex flex-col items-center" style={{ fontFamily: 'Pyidaungsu', padding: '3%' }}>

      <div className='flex text-xl' style={{width: '100%', color: 'white', gap: '0%', marginBottom: '1%', justifyContent: 'flex-end'}}>
        <button onClick={()=>setCurrentTab("about")} style={{background: `${currentTab === 'about' ? 'rgb(37,58,149)' : ''}`, border: '1px solid gray',  width: '10%', cursor: 'pointer'}}>About</button>
        <button onClick={()=>setCurrentTab("applied")} style={{background: `${currentTab === 'applied' ? 'rgb(37,58,149)' : ''}`, border: '1px solid gray', width: '10%', cursor: 'pointer'}}>Applied</button>
        <button onClick={()=>setCurrentTab("current")} style={{background: `${currentTab === 'current' ? 'rgb(37,58,149)' : ''}`, border: '1px solid gray', width: '10%', cursor: 'pointer'}}>Current</button>
      </div>

      { currentTab === 'about' && (
        <div className='flex flex-col'>
        <h2 className='mb-20 text-5xl font-bold' style={{
          marginBottom: "50px",
          color: 'white',
          textAlign: 'center'
        }}>{t(`APPS.building.name`)}</h2>
        <p className='text-xl' style={{
            marginBottom: "50px",
            textIndent: "50px",
            lineHeight: "3",
            color: 'white'
        }}>{t('BUILDING.info')}</p>
        <div className="flex" style={{justifyContent: 'center', alignItems: 'center', gap: '50px'}}>
            
            <div className='flex flex-col' style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
              <img src="/images/building/1.png" alt="" style={{marginLeft: '-60%', width: '15%', rotate: '20deg'}}/>
              <div className='flex' style={{width: '100%', height: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
                <img src="/images/building/Picture1.png" alt="" style={{width: '25%'}}/>
                <div style={{width: '50px', height: '20px', background: 'white', clipPath: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)', margin: '5%'}}></div>
                <img src="/images/building/Picture2.png" alt="" style={{width: '20%'}}/>
                <div style={{width: '50px', height: '20px', background: 'white', clipPath: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)', margin: '5%'}}></div>
              </div>
            </div>
            

            <div style={{width: '100%', height: '70%', marginRight: '2%'}}>
              <YoloONNX />
            </div>
        </div>
      </div>
      )}

      { currentTab === 'applied' && (
        <div className='flex flex-col'>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          // textIndent: "50px",
          lineHeight: "3",
          color: 'white'
        }}>{t('BUILDING.applied')}</h2>
        <p className='text-xl' style={{
          marginBottom: "50px",
          textIndent: "50px",
          lineHeight: "3",
          color: 'white'
        }}>{t('CENSUS.info')}</p>

        <div className='flex' style={{width: '100%', height: '100%', gap: '1%', marginBottom: '3%'}}>
          <img src="/images/building/censusN.png" alt="" style={{width: '20%'}}/>
          {/* <div className='flex' style={{width: '40%', height: '100%'}}>
              <iframe src="/html/Census_2024.html" style={{width: '100%', height: '100%'}}></iframe>
          </div> */}

          <div className="overflow-x-auto">
            <table className="min-w-1/2 border border-gray-400 text-sm">
                <thead style={{background: "rgb(125, 230, 230)"}}>
                <tr>
                    <th className="border border-gray-400 px-4 py-2 text-center">{t('CENSUS.states')}</th>
                    <th className="border border-gray-400 px-4 py-2 text-center">{t('CENSUS.enu')}</th>
                    <th className="border border-gray-400 px-4 py-2 text-center">{t('CENSUS.nonEnu')}</th>
                    <th className="border border-gray-400 px-4 py-2 text-center">{t('CENSUS.total')}</th>
                </tr>
                </thead>
                <tbody className='bg-gray-50'>
                {censusData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                    <td className="border border-gray-400 px-4 py-2 text-left">{t(`STATES.${row.id}`)}</td>
                    <td className="border border-gray-400 px-4 py-2 text-right" align="right">{locale === 'mm' ? convertToMyanmarNumber(row.enu) : row.enu.toLocaleString("en-US")}</td>
                    <td className="border border-gray-400 px-4 py-2 text-right" align="right">{locale === 'mm' ? convertToMyanmarNumber(row.nonEnu) : row.nonEnu.toLocaleString("en-US")}</td>
                    <td className="border border-gray-400 px-4 py-2 text-right" align="right">{locale === 'mm' ? convertToMyanmarNumber(row.total) : row.total.toLocaleString("en-US")}</td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>

          <div style={{ width: '30%', height: '300px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '10px' }}>
              <canvas ref={chartRef}></canvas>
          </div>
          <div style={{ width: '15%', height: '310px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '10px' }}>
              <canvas ref={pieRef}></canvas>
          </div>

        </div>
      </div>
      )}
      
      { currentTab === 'current' && (
        <div className='flex flex-col'>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          // textIndent: "50px",
          lineHeight: "3",
          // color: 'white',
          display: 'none'

        }}>{t('BUILDING.applied')}</h2>
        <p className='text-xl' style={{
          
          // color: 'white'
          color: '#0000'
          
        }}>{t('CENSUS.info')}</p>

        <div className='flex' style={{width: '100%', height: '100%', gap: '1%', marginBottom: '3%'}}>
          {/* <img src="/images/building/censusN.png" alt="" style={{width: '20%'}}/> */}
          <div className='flex' style={{width: '100%', height: '90vh'}}>
              <MapContainer
                center={[19, 96.0891]}
                zoom={6}
                style={{ height: '100%', width: '100%' }}
              >
                {basemap !== '' && <TileLayer
                  attribution={basemaps[basemap].attribution}
                  url={basemaps[basemap].url}
                  maxZoom={20}
                />}
                <SideBySideLayer 
                  stateRegion={stateRegion}
                  leftYear={leftYear}
                  rightYear={rightYear}
                  leftMaps={leftMaps}
                  leftBuildings={leftBuildings}
                  rightMaps={rightMaps}
                  rightBuildings={rightBuildings}
                />
              </MapContainer>
          </div>

          <div className="flex" style={{width: '100%', height: '100%', gap: '1%'}}>

            <div className='flex flex-col' style={{width: '100%', height: '100%', gap: '1%'}}>
                <p style={{color: '#0000',}}>{t(`APPS.year`)}</p>

                <div className='flex' style={{alignItems: 'center', justifyContent: 'space-between', color: 'white', width: '100%', paddingLeft: '1%', paddingRight: '1%'}}>
                  <select 
                    // value='Townships'
                    style={{
                      width: '50%',
                      color: '#fff',
                      opacity: '0',
                      padding: '5px'
                    }}
                  >
                  </select>

                  <div className='flex' style={{width: '100%', gap: '1%', paddingRight: '1%'}}>
                    <p style={{width: '100%', textAlign: 'right'}}>2005</p>
                    <p style={{width: '100%', textAlign: 'right'}}>2010</p>
                    <p style={{width: '100%', textAlign: 'right'}}>2015</p>
                    <p style={{width: '100%', textAlign: 'right'}}>2020</p>
                    <p style={{width: '100%', textAlign: 'right'}}>2025</p>
                  </div>
                </div>
                

                {/* <div className='flex' style={{alignItems: 'center', justifyContent: 'space-between', color: 'white', width: '100%', paddingTop: '1%', paddingRight: '1%'}}>
                  <p style={{width: '30%', fontWeight: 'bold'}}>{t(`TOWNSHIPS.township`)}</p>
                  <p style={{opacity: '0'}} >Map</p>
                  <input type='checkbox' style={{opacity: '0'}} />
                  <p style={{opacity: '0'}}>Buildings</p>
                  <input type='checkbox' style={{opacity: '0'}} />
                  <p style={{width: '15%', fontWeight: 'bold', textAlign: 'right'}}>{t('BUILDING.buildings')}</p>
                </div> */}

                {district !== "All" && Object.keys(buildingData[stateRegion][district]).map(township => (
                  <div key={township} className='flex' style={{alignItems: 'center', justifyContent: 'space-between', background: 'gray', color: 'white', width: '100%', paddingTop: '1%', paddingLeft: '1%', paddingRight: '1%'}}>
                    <p style={{width: '50%'}}>{t(`TOWNSHIPS.${township}`)}</p>
                    
                    <div className='flex' style={{width: '100%', gap: '1%', paddingRight: '1%'}}>
                      {Object.keys(buildingData[stateRegion][district][township]).map(year => (
                        <p key={year} style={{width: '100%', textAlign: 'right'}}>{locale === 'mm' ? convertToMyanmarNumber(buildingData[stateRegion][district][township][year]) : buildingData[stateRegion][district][township][year]}</p>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            <div className='flex flex-col' style={{width: '100%', height: '100%', gap: '1%'}}>
                <p style={{color: 'white', textAlign: 'center'}}>{t("BUILDING.compare")}</p>

                <div className='flex' style={{justifyContent: 'space-between', gap: '1%'}}>
                  <select 
                    value={leftYear} 
                    onChange={e => {
                      setLeftYear(e.target.value)
                    }}
                    style={{
                      width: '100%',
                      color: '#00ffff',
                      background: '#0b0b2b',
                      padding: '5px'
                    }}
                  >
                    <option value="2025">2025</option>
                    <option value="2020">2020</option>
                    <option value="2015">2015</option>
                    <option value="2010">2010</option>
                    <option value="2005">2005</option>
                  </select>

                  <select 
                    value={rightYear} 
                    onChange={e => {
                      setRightYear(e.target.value)
                    }}
                    style={{
                      width: '100%',
                      color: 'orange',
                      background: '#0b0b2b',
                      padding: '5px'
                    }}
                  >
                    <option value="2025">2025</option>
                    <option value="2020">2020</option>
                    <option value="2015">2015</option>
                    <option value="2010">2010</option>
                    <option value="2005">2005</option>
                  </select>
                </div>
                

                {/* <div className='flex' style={{alignItems: 'center', justifyContent: 'space-between', color: 'white', width: '100%', paddingTop: '1%'}}>
                  <p style={{ fontWeight: 'bold', textAlign: 'left'}}>{t('BUILDING.buildings')}</p>
                </div> */}

                {district !== "All" && Object.keys(buildingData[stateRegion][district]).map(township => (
                  <div key={township} className='flex' style={{alignItems: 'center', justifyContent: 'space-around', background: 'gray', color: 'white', width: '100%', paddingTop: '1%', paddingRight: '1%'}}>
                    {/* <p style={{width: '30%'}}>{t(`TOWNSHIPS.${township}`)}</p> */}
                    
                    <div className='flex' style={{gap: '5px'}}>
                      <p>Map</p>
                      <input type='checkbox' name={township} onChange={leftMapCheckHandler}/>
                      <p>Buildings</p>
                      <input type='checkbox' name={township} onChange={leftBuildingCheckHandler}/>
                    </div>

                    <div className='flex' style={{gap: '5px'}}>
                      <p>Map</p>
                      <input type='checkbox' name={township} onChange={rightMapCheckHandler}/>
                      <p>Buildings</p>
                      <input type='checkbox' name={township} onChange={rightBuildingCheckHandler}/>
                    </div>
                    
                  </div>
                ))}
            </div>

            <div className='flex flex-col' style={{width: '50%', height: '100%', gap: '1%'}}>

              <p style={{color: 'white'}}>Basemap</p>

              <select
                value={basemap}
                onChange={(e)=>setBasemap(e.target.value)}
                style={{color: 'white', background: '#0b0b2b'}}
              >
                <option value="googleSatHybrid">Google Satellite Hybrid</option>
                <option value="OSM">Open Street Map</option>
                <option value="ESRITopo">ESRI Topo</option>
              </select>

              <p style={{color: 'white'}}>{t(`STATES.state_region`)}</p>

              <select 
                value={stateRegion} 
                onChange={e => {
                  setStateRegion(e.target.value);
                  setDistrict("All");
                  setTownship("All");
                }}
                style={{
                  color: 'white',
                  background: '#0b0b2b',
                  padding: '5px'
                }}
              >
                <option value="All">{t('APPS.all')}</option>
                {stateOptions.map((state) => (
                  <option key={state} value={state}>{t(`STATES.${state}`)}</option>
                ))}
              </select>

              <p style={{color: 'white'}}>{t(`DISTRICTS.district`)}</p>

              <select 
                value={district} 
                onChange={e => {
                  setDistrict(e.target.value);
                  setTownship("All");
                }} 
                disabled={stateRegion === "All"}
                style={{
                  color: 'white',
                  background: '#0b0b2b',
                  padding: '5px'
                }}
              >
                <option value="All">{t('APPS.all')}</option>
                {districtOptions.map((dist) => (
                  <option key={dist} value={dist}>{t(`DISTRICTS.${dist}`)}</option>
                ))}
              </select>


            </div>
          </div>


        </div>
      </div>
      )}


    </div>

  )
}
