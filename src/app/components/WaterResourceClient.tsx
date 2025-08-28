'use client';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  useMap
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// import proj4 from "proj4";

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useTranslations } from 'next-intl';

import '@/app/[locale]/globals.css'
import './styles.css'
import { useEffect, useRef, useState } from 'react';
import redIconUrl from '../../../public/images/water-resources/abnormal.png'
import blueIconUrl from '../../../public/images/water-resources/normal.png'
import { waterResourceData, stateRegionWaterData } from '@/data/waterResourceData';

type FlatData = {
  state: string;
  district: string;
  township: string;
  name: string;
  type: string;
  condition: string;
  latitude: number;
  longitude: number;
};

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

// // Define EPSG:32647 UTM Zone 47N
// proj4.defs("EPSG:32647", "+proj=utm +zone=47 +datum=WGS84 +units=m +no_defs");

// function GeoJSONLayer({ url }: { url: string }) {
//   const map = useMap();

//   useEffect(() => {
//     fetch(url)
//       .then((res) => res.json())
//       .then((geojsonData) => {
//         // Reproject coordinates from EPSG:32647 to EPSG:4326
//         const from = "EPSG:32647";
//         const to = "EPSG:4326";

//         function reprojectFeature(feature: any) {
//           const type = feature.geometry.type;
//           if (type === "Polygon") {
//             feature.geometry.coordinates = feature.geometry.coordinates.map((ring: any[]) =>
//               ring.map((coord: any[]) => proj4(from, to, coord))
//             );
//           } else if (type === "MultiPolygon") {
//             feature.geometry.coordinates = feature.geometry.coordinates.map((polygon: any[]) =>
//               polygon.map((ring: any[]) =>
//                 ring.map((coord: any[]) => proj4(from, to, coord))
//               )
//             );
//           }
//           return feature;
//         }

//         geojsonData.features = geojsonData.features.map(reprojectFeature);

//         const geoJsonLayer = L.geoJSON(geojsonData, {
//           style: { color: "green", weight: 1 },
//           onEachFeature: (feature, layer) => {
//             const name = feature.properties?.Name || feature.properties?.name;
//             if (name) {
//               layer.bindPopup(name);
//             }
//           },
//         });

//         geoJsonLayer.addTo(map);
//         map.fitBounds(geoJsonLayer.getBounds());
//       });
//   }, [map, url]);

//   return null;
// }

function GeoJSONLayer({ url }: { url: string }) {
  const map = useMap();
  const controlRef = useRef<L.Control.Layers | null>(null);

  useEffect(() => {
    let geoJsonLayer: L.GeoJSON<any>;

    fetch(url, {
      credentials: "include" // ✅ include cookies
    })
      .then((res) => res.json())
      .then((geojsonData) => {
        geoJsonLayer = L.geoJSON(geojsonData, {
          style: {
            color: "blue",
            weight: 1,
          },
          onEachFeature: (feature, layer) => {
            const name = feature.properties?.Name || feature.properties?.name;
            if (name) {
              layer.bindPopup(name);
            }
          },
        });


        // Remove previous control if exists
        if (controlRef.current) {
          map.removeControl(controlRef.current);
        }

        // Create and store new control
        const control = L.control.layers(undefined, {
          [geojsonData.name || "GeoJSON Layer"]: geoJsonLayer,
        }, { collapsed: false });

        control.addTo(map);
        controlRef.current = control;

        map.fitBounds(geoJsonLayer.getBounds());
      });

    // Cleanup on unmount
    return () => {
      if (geoJsonLayer) map.removeLayer(geoJsonLayer);
      if (controlRef.current) {
        map.removeControl(controlRef.current);
        controlRef.current = null;
      }
    };
  }, [map, url]);

  return null;
}


export default function WaterResourceClient() {
  const t = useTranslations();
  const { BaseLayer } = LayersControl;
  const [stateRegion, setStateRegion] = useState("All");
  const [district, setDistrict] = useState("All");
  const [township,setTownship] = useState("All");
  const [showMarkers, setShowMarkers] = useState(false);

  const grandTotals = Object.values(stateRegionWaterData).reduce(
    (acc, cur) => {
      acc.dam += cur.dam;
      acc.lake += cur.lake;
      return acc;
    },
    { dam: 0, lake: 0 }
  );


  const redIcon = new L.Icon({
    iconUrl: redIconUrl.src,
    // shadowUrl: shadowUrl.src,
    iconSize: [25, 30],
    iconAnchor: [12, 30],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  const blueIcon = new L.Icon({
    iconUrl: blueIconUrl.src,
    // shadowUrl: shadowUrl.src,
    iconSize: [25, 30],
    iconAnchor: [12, 30],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
  
  const stateOptions = Object.keys(waterResourceData);

  const districtOptions = stateRegion !== "All"
    ? Object.keys(waterResourceData[stateRegion])
    : [];

  const townshipOptions = (stateRegion !== "All" && district !== "All")
    ? Object.keys(waterResourceData[stateRegion][district])
    : [];

  const markers = [];

  if (stateRegion === "All") {
    for (const [stateName, state] of Object.entries(waterResourceData)) {
      for (const [districtName, district] of Object.entries(state)) {
        for (const [townshipName, township] of Object.entries(district)) {
          markers.push(
            ...township.map(item => ({
              ...item,
              stateRegion: stateName,
              district: districtName,
              township: townshipName
            }))
          );
        }
      }
    }
  } else if (district === "All") {
    const state = waterResourceData[stateRegion];
    for (const [districtName, district] of Object.entries(state)) {
      for (const [townshipName, township] of Object.entries(district)) {
        markers.push(
          ...township.map(item => ({
            ...item,
            stateRegion,
            district: districtName,
            township: townshipName
          }))
        );
      }
    }
  } else if (township === "All") {
    const townships = waterResourceData[stateRegion][district];
    for (const [townshipName, township] of Object.entries(townships)) {
      markers.push(
        ...township.map(item => ({
          ...item,
          stateRegion,
          district,
          township: townshipName
        }))
      );
    }
  } else {
    markers.push(
      ...waterResourceData[stateRegion][district][township].map(item => ({
        ...item,
        stateRegion,
        district,
        township
      }))
    );
  }


  const flattenedData: FlatData[] = [];

  for (const [state, districts] of Object.entries(waterResourceData)) {
    for (const [district, townships] of Object.entries(districts)) {
      for (const [township, items] of Object.entries(townships)) {
        for (const item of items) {
          flattenedData.push({
            state,
            district,
            township,
            name: item.name,
            type: item.type,
            condition: item.condition,
            latitude: item.latitude,
            longitude: item.longitude,
          });
        }
      }
    }
  }

  const filteredTableData = flattenedData.filter(item =>
    (stateRegion === 'All' || item.state === stateRegion) &&
    (district === 'All' || item.district === district) &&
    (township === 'All' || item.township === township)
  );

  // console.log("Markers:", markers)


  return (
    <div className="flex flex-col items-center p-6" style={{fontFamily: 'Pyidaungsu',height: '100%'}}>
      <h2 className='mb-20 text-5xl font-bold' style={{
            marginBottom: "50px",
            color: 'white'
        }}>{t(`APPS.waterResource.name`)}</h2>
      <p className='text-xl text-white indent-10 mb-5'>ရေအရင်းအမြစ် (Water Resources) ဆိုသည်မှာ လူသားများသောက်သုံးရန်၊ စိုက်ပျိုးရေးလုပ်ငန်း၊ စက်မှုလုပ်ငန်းများနှင့် အခြားသော လူမှုစီးပွားဆိုင်ရာ အသုံးချမှုများအတွက် အသုံးပြုနိုင်သော ကမ္ဘာပေါ်ရှိ ရေအားလုံးကို စုပေါင်းခေါ်ဝေါ်ခြင်း ဖြစ်ပါသည်။  ရေအရင်းအမြစ်ကို မျက်နှာပြင်ရေ(မြစ်/ချောင်း/အင်း/အိုင်/ဆည်/တမံ/ကန်)နှင့် မြေအောက်ရေ ဟူ၍ခွဲခြားနိုင်သည်။
      </p>

      <div className='flex w-full h-full justify-center text-white'>
        <div className='flex flex-col w-full h-full'>
          <div className='flex w-full h-full justify-center'>
            <img src="/images/water-resources/river.jpg" alt="" className='w-80'/>
            <img src="/images/water-resources/well.jpg" alt="" className='w-80'/>
          </div>
          <div className='flex w-full h-full justify-center'>
            <img src="/images/water-resources/world-water.png" alt="" className='w-160'/>
          </div>
        </div>
        <div className='flex flex-col w-full h-full'>
          <div className='flex w-full h-full'>
            <img src="/images/water-resources/water-cycle.png" alt="" className='w-150' />
          </div>
          <div onClick={()=>setShowMarkers(true)} className='w-150' style={{ height: '100%', overflowX: 'auto', fontSize: '0.8rem'}}>
            <table className="table-auto border border-gray-400 text-xs text-black" style={{borderCollapse: 'collapse',  border: '1px solid black', width: '100%'}}>
              <thead style={{background: "rgb(125, 230, 230)", position: 'sticky', top: '0.1px', border: '1px solid black'}}>
                <tr>
                  <th className="border border-gray-400 px-2 py-1 text-center">
                    စဉ်
                  </th>
                  <th className="border border-gray-400 px-2 py-1 text-center">
                    တိုင်းဒေသကြီး/ပြည်နယ်
                  </th>
                  <th className="border border-gray-400 px-2 py-1 text-center">
                    ဆည်/တမံ
                  </th>
                  <th className="border border-gray-400 px-2 py-1 text-center">
                    ကန်
                  </th>
                  <th className="border border-gray-400 px-2 py-1 text-center">
                    စုစုပေါင်း
                  </th>
                </tr>
              </thead>
              <tbody className='bg-gray-50'>
                {Object.keys(stateRegionWaterData).map((stateRegion: string, idx: number)=> {
                  const dam = stateRegionWaterData[stateRegion].dam;
                  const lake = stateRegionWaterData[stateRegion].lake;
                  const rowTotal = dam + lake;

                  return (
                    <tr key={idx}>
                      <td className="border border-gray-400 px-2 py-1 text-right">{idx + 1}</td>
                      <td className="border border-gray-400 px-2 py-1 text-left">{t(`STATES.${stateRegion}`)}</td>
                      <td className="border border-gray-400 px-2 py-1 text-right">{stateRegionWaterData[stateRegion].dam}</td>
                      <td className="border border-gray-400 px-2 py-1 text-right">{stateRegionWaterData[stateRegion].lake}</td>
                      <td className="border border-gray-400 px-2 py-1 text-right font-semibold">{rowTotal}</td>
                    </tr>
                  )
                })}

                {/* Grand total row */}
                <tr className="bg-gray-200 font-bold">
                  <td colSpan={2} className="border border-gray-400 px-2 py-1 text-center">
                    Total
                  </td>
                  <td className="border border-gray-400 px-2 py-1 text-right">{grandTotals.dam}</td>
                  <td className="border border-gray-400 px-2 py-1 text-right">{grandTotals.lake}</td>
                  <td className="border border-gray-400 px-2 py-1 text-right">
                    {grandTotals.dam + grandTotals.lake}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showMarkers && (
        <div className="flex fixed bg-[radial-gradient(circle_at_center,_#0b0b2b,_#1b2735,_#090a0f)] items-start top-20" style={{justifyContent: 'center',  width: '100%', height: '100vh', paddingLeft: '5%', paddingRight: '5%', gap: '5%'}}>
          <div className='flex flex-col' style={{width: '50%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
            

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

              <GeoJSONLayer url="http://localhost:3001/api/geojsons/water-resource/Mandalay_waterbody.geojson" />

              {markers.map((loc, idx) => (
                <Marker  
                  key={idx}
                  position={[loc.latitude, loc.longitude]}
                  icon={loc.condition === "abnormal" || loc.condition === "နည်း" ? redIcon : blueIcon}
                >
                  <Popup>
                    <div 
                      style={{ 
                        lineHeight: '1.5',
                        color: loc.condition === "abnormal" || loc.condition === "နည်း" ? "red" : "black" }}>
                      <div><strong>{loc.name}</strong></div>
                      <div>တိုင်း/ပြည်နယ် - {loc.stateRegion}</div>
                      <div>ခရိုင် - {loc.district}</div>
                      <div>မြို့နယ် - {loc.township}</div>
                      <div>အမျိုးအစား - {loc.type}</div>
                      <div>အခြေအနေ - {loc.condition}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}

            </MapContainer>
          </div>

          <div className='flex flex-col' style={{width: '100%', height:'100%', gap: '1%'}}>
              <div className='flex' style={{alignItems: 'center', gap: '1%'}}>
                <p style={{color: 'white'}}>State/ Region</p>

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
                  <option value="All">All</option>
                  {stateOptions.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>

                <p style={{color: 'white'}}>District</p>

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
                  <option value="All">All</option>
                  {districtOptions.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>

                <p style={{color: 'white'}}>Township</p>

                <select 
                  value={township} 
                  onChange={e => setTownship(e.target.value)} 
                  disabled={district === "All"}
                  style={{
                    color: 'white',
                    background: '#0b0b2b',
                    padding: '5px'
                  }}
                >
                  <option value="All">All</option>
                  {townshipOptions.map((ts) => (
                    <option key={ts} value={ts}>{ts}</option>
                  ))}
                </select>
              
              </div>

              <div className="overflow-x-auto h-full" style={{width: '100%', height: '900px', display: 'flex', flexDirection: 'column'}}>
                <table className="min-w-1/2 border border-gray-400 text-sm" style={{height: '100%'}}>
                  <thead style={{background: "rgb(125, 230, 230)"}}>
                    <tr>
                      <th className="border border-gray-400 px-4 py-2 text-center">စဉ်</th>
                      <th className="border border-gray-400 py-2 text-center">တိုင်းဒေသကြီး/ပြည်နယ်</th>
                      <th className="border border-gray-400 px-4 py-2 text-center">ခရိုင်</th>
                      <th className="border border-gray-400 px-4 py-2 text-center">မြို့နယ်</th>
                      <th className="border border-gray-400 px-4 py-2 text-center">အမည်</th>
                      <th className="border border-gray-400 px-4 py-2 text-center">အမျိုးအစား</th>
                      <th className="border border-gray-400 py-2 text-center">အခြေအနေ</th>
                    </tr>
                  </thead>
                  <tbody className='bg-gray-50'>
                    {filteredTableData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-400 px-4 py-2" align='right'>{index + 1}</td>
                        <td className="border border-gray-400 px-4 py-2">{item.state}</td>
                        <td className="border border-gray-400 px-4 py-2">{item.district}</td>
                        <td className="border border-gray-400 px-4 py-2">{item.township}</td>
                        <td className="border border-gray-400 px-4 py-2">{item.name}</td>
                        <td className="border border-gray-400 px-4 py-2">{item.type}</td>
                        <td
                          className="border border-gray-400 px-4 py-2"
                          style={{
                            color: item.condition === 'abnormal' || item.condition === 'နည်း' ? 'red' : undefined,
                            fontWeight: item.condition === 'abnormal' || item.condition === 'နည်း' ? 'bold' : undefined,
                          }}
                        >
                          {item.condition}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
          </div>

          <p onClick={()=>setShowMarkers(false)} className='text-xl text-red-500 cursor-pointer'>x</p>
        </div>
      )}

    </div>
  );
}
