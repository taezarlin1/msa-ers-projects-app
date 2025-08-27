'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'
// import '@/app/[locale]/globals.css'
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
import { sensingData } from '@/data/sensingData'

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


export default function ErsTechnologyClient() {
  const t = useTranslations();
  const monthLabels = ["ဇန်နဝါရီ", "ဖေဖော်ဝါရီ", "မတ်", "ဧပြီ", "မေ", "ဇွန်", "ဇူလိုင်", "ဩဂုတ်", "စက်တင်ဘာ", "အောက်တိုဘာ", "နိုဝင်ဘာ", "ဒီဇင်ဘာ"];

  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedRack, setSelectedRack] = useState("");
  const [selectedSwith, setSelectedSwitch] = useState("");

  const switches = {
    motor1: "Elevation Angle (EA) of Motor 1",
    motor2: "Elevation Angle (EA) of Motor 2",
    inputCtrl: "Input Control Switch",
    azimuth1: "Azimuth Control Switch",
    azimuth2: "Azimuth Snubber Module and Relay",
    azimuth3: "Azimuth Contactor",
    ea1: "EA Control Switch",
    ea2: "EA Snubber Module and Relay",
    ea3: "EA Contactor",
    cea1: "CEA Control Switch",
    cea2: "CEA Relay and Contactor",
    protectRelay: "Protective Relays",
    psCtrl: "Power Supply Control Switch",
    ventilation: "Ventilation Control Switch",
    azMotor1: "Azimuth of Motor 1",
    azMotor2: "Azimuth of Motor 2",
    ceaMotor: "Cross EA (CEA) of motor",
  }

  const chartData = useMemo(() => {
    const filtered = sensingData.sort((a, b) => a.Name.localeCompare(b.Name, undefined, { numeric: true })).filter(d => {
      const year = new Date(d.Date).getFullYear().toString();
      return selectedYear === "All" || year === selectedYear;
    });

    const nameMap = new Map<string, { seconds: number[]; count: number[] }>(); // name -> [12 months]

    for (const item of filtered) {
      const month = new Date(item.Date).getMonth(); // 0-11
      const name = item.Name;

      if (!nameMap.has(name)) {
        nameMap.set(name, {
          seconds: Array(12).fill(0),
          count: Array(12).fill(0)
        });
      }

      const entry = nameMap.get(name)!;
      entry.seconds[month] += item.Seconds;
      entry.count[month] += 1;
    }

    const durationDatasets = Array.from(nameMap.entries()).map(([name, {seconds}], i) => ({
      label: `${name}`,
      data: seconds,
      backgroundColor: `hsl(${(i * 40) % 360}, 70%, 60%)`,
      borderColor: `hsl(${(i * 40) % 360}, 70%, 40%)`,
      borderWidth: 1,
    }));

    const countDatasets = Array.from(nameMap.entries()).map(([name, {count}], i) => ({
      label: `${name}`,
      data: count,
      backgroundColor: `hsl(${(i * 40) % 360}, 70%, 60%)`,
      borderColor: `hsl(${(i * 40) % 360}, 70%, 40%)`,
      borderWidth: 1,
    }));

    // console.log('Datasets:', datasets)

    return {
      labels: monthLabels,
      durationDatasets,
      countDatasets
    };
  }, [selectedYear]);

  // console.log(chartData)



  const chartRef = useRef<HTMLCanvasElement>(null)
  const countChartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const barCtx = chartRef.current?.getContext("2d");
    const countCtx = countChartRef.current?.getContext("2d");
    if (!barCtx || !countCtx) return;

    const barChart = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: chartData.labels,
        datasets: chartData.durationDatasets
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

    const countChart = new Chart(countCtx, {
      type: "bar",
      data: {
        labels: chartData.labels,
        datasets: chartData.countDatasets
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
          x: { ticks: { color: '#000' } },
          y: { beginAtZero: true }
        }
        
      },

    });

    return () => {
        barChart.destroy();
        countChart.destroy();
    };
  }, [chartData])

  return (
    <div className="flex flex-col" style={{height: '100%', width: '100%', alignItems: 'center', justifyContent: 'space-around'}}>
        <h2 className='mb-20 text-5xl font-bold' style={{
            marginBottom: "50px",
            color: 'white'
        }}>ERS Technology</h2>
        {/* <p className='text-xl' style={{
            marginBottom: "50px",
            textIndent: "50px",
            lineHeight: "3"
        }}>{t('STATES.info')}</p> */}
        <div className='flex' style={{justifyContent: 'space-around'}}>
          <div className='flex' style={{justifyContent: 'center', alignItems: 'end', gap: '0%', width: '30%', height: '100%'}}>
            <div className='flex flex-col' style={{justifyContent: 'end', alignItems: 'center', width: '100%', height: '100%', color: 'white'}}>
              <img onClick={()=>setSelectedRack("antennaPower")} src="/images/technology/server1.png" width='25%' alt="" style={{borderRadius: '5px', cursor: 'pointer'}}/>
              <p>Antenna Power Supply Control Unit</p>
            </div>
            <div className='flex flex-col' style={{justifyContent: 'end', alignItems: 'center', width: '100%', height: '100%', color: 'white'}}>
              <img onClick={()=>setSelectedRack("antennaControl")} src="/images/technology/server2.png" width='20%' alt="" style={{borderRadius: '5px', cursor: 'pointer'}}/>
              <p>Antenna Control Unit</p>
            </div>
          </div>

          <div className='flex' style={{gap: '10px'}}>
            <div >
              <img src="/images/technology/hoffice.png" alt="" className='rounded-xl' style={{width: '500px'}}/>
            </div>
            <div className='flex flex-col' style={{alignItems: 'center', rotate: '65deg', marginLeft: '-150px', marginTop: '-100px'}}>
              <div>
                <img src="/images/technology/1.png" alt="" style={{width: '100px'}}/>
              </div>
              <div className="signal-container" style={{display: 'flex', flexDirection: 'column'}}>
                <div className="signal-wave"></div>
                <div className="signal-wave"></div>
                <div className="signal-wave"></div>
              </div>
            </div>
          </div>

          <div className='flex' style={{justifyContent: 'center', alignItems: 'end', gap: '0%', width: '30%', height: '100%'}}>
            <div className='flex flex-col' style={{justifyContent: 'end', alignItems: 'center', width: '100%', height: '100%', color: 'white'}}>
              <img onClick={()=>setSelectedRack("receiving")} src="/images/technology/server3.png" width='20%' alt="" style={{borderRadius: '5px', cursor: 'pointer'}}/>
              <p>Receiving Server</p>
            </div>
            <div className='flex flex-col' style={{justifyContent: 'end', alignItems: 'center', width: '100%', height: '100%', color: 'white'}}>
              <img onClick={()=>setSelectedRack("processing")} src="/images/technology/server4.png" width='20%' alt="" style={{borderRadius: '5px', cursor: 'pointer'}}/>
              <p>Processing server</p>
            </div>
          </div>
        </div>

        {selectedRack === "antennaPower" && (
          <div
            style={{
              display: 'flex', 
              position: 'fixed', 
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: '1',
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.9)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',
                width: '1280px',
                height: '720px'
              }}
            >
              <img src="/images/technology/server1.png" alt="" style={{width: '20%', height: '100%'}}/>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '50%',
                  height: '100%',
                  // background: 'red'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                    color: 'white',
                    gap: '20%'
                  }}
                >
                  <h1 style={{fontSize: 'x-large', fontWeight: 'bold'}}>Antenna Power Supply Control Rack</h1>
                  <button
                    onClick={()=>setSelectedRack("")}
                    style={{background: 'transparent', cursor: 'pointer', borderRadius: '50%', padding: '1%'}}
                  >X</button>
                </div>

                <div
                  onClick={()=>setSelectedSwitch("motor1")}
                  style={{
                    position: 'absolute',
                    left: '225px',
                    top: '85px',
                    width: '65px',
                    height: '100px',
                    cursor: 'pointer',
                    border: `${selectedSwith === "motor1" ? "2px solid red" : ""}`
                  }}
                >
                </div>

                <div
                  onClick={()=>setSelectedSwitch("inputCtrl")}
                  style={{
                    position: 'absolute',
                    left: '305px',
                    top: '100px',
                    width: '40px',
                    height: '80px',
                    cursor: 'pointer',
                    border: `${selectedSwith === "inputCtrl" ? "2px solid red" : ""}`
                  }}
                >
                </div>

                <div
                  onClick={()=>setSelectedSwitch("motor2")}
                  style={{
                    position: 'absolute',
                    left: '355px',
                    top: '85px',
                    width: '70px',
                    height: '100px',
                    cursor: 'pointer',
                    border: `${selectedSwith === "motor2" ? "2px solid red" : ""}`
                  }}
                >
                </div>

                <div
                  onClick={()=>setSelectedSwitch("azimuth1")}
                  style={{
                    position: 'absolute',
                    left: '220px',
                    top: '205px',
                    width: '20px',
                    height: '30px',
                    cursor: 'pointer',
                    border: `${selectedSwith === "azimuth1" ? "2px solid red" : ""}`
                  }}
                >
                </div>

                <div
                  onClick={()=>setSelectedSwitch("azimuth2")}
                  style={{
                    position: 'absolute',
                    left: '240px',
                    top: '205px',
                    width: '15px',
                    height: '30px',
                    cursor: 'pointer',
                    border: `${selectedSwith === "azimuth2" ? "2px solid red" : ""}`
                  }}
                >
                </div>

                <div
                  onClick={()=>setSelectedSwitch("azimuth3")}
                  style={{
                    position: 'absolute',
                    left: '250px',
                    top: '205px',
                    width: '20px',
                    height: '30px',
                    cursor: 'pointer',
                    border: `${selectedSwith === "azimuth3" ? "2px solid red" : ""}`
                  }}
                >
                </div>

                <div
                  onClick={()=>setSelectedSwitch("ea1")}
                  style={{
                    position: 'absolute',
                    left: '270px',
                    top: '205px',
                    width: '17px',
                    height: '30px',
                    cursor: 'pointer',
                    border: `${selectedSwith === "ea1" ? "2px solid red" : ""}`
                  }}
                >
                </div>

                <div
                  onClick={()=>setSelectedSwitch("ea2")}
                  style={{
                    position: 'absolute',
                    left: '283px',
                    top: '205px',
                    width: '14px',
                    height: '30px',
                    cursor: 'pointer',
                    border: `${selectedSwith === "ea2" ? "2px solid red" : ""}`
                  }}
                >
                </div>

                <div
                  onClick={()=>setSelectedSwitch("ea3")}
                  style={{
                    position: 'absolute',
                    left: '295px',
                    top: '205px',
                    width: '18px',
                    height: '30px',
                    cursor: 'pointer',
                    border: `${selectedSwith === "ea3" ? "2px solid red" : ""}`
                  }}
                >
                </div>

                <div
                  onClick={()=>setSelectedSwitch("cea1")}
                  style={{
                    position: 'absolute',
                    left: '310px',
                    top: '205px',
                    width: '20px',
                    height: '30px',
                    cursor: 'pointer',
                    border: `${selectedSwith === "cea1" ? "2px solid red" : ""}`
                  }}
                >
                </div>

                <div
                  onClick={()=>setSelectedSwitch("cea2")}
                  style={{
                    position: 'absolute',
                    left: '326px',
                    top: '205px',
                    width: '23px',
                    height: '30px',
                    cursor: 'pointer',
                    border: `${selectedSwith === "cea2" ? "2px solid red" : ""}`
                  }}
                >
                </div>

                <div
                  onClick={()=>setSelectedSwitch("protectRelay")}
                  style={{
                    position: 'absolute',
                    left: '346px',
                    top: '205px',
                    width: '23px',
                    height: '30px',
                    cursor: 'pointer',
                    border: `${selectedSwith === "protectRelay" ? "2px solid red" : ""}`
                  }}
                >
                </div>

                <div
                  onClick={()=>setSelectedSwitch("psCtrl")}
                  style={{
                    position: 'absolute',
                    left: '367px',
                    top: '205px',
                    width: '18px',
                    height: '30px',
                    cursor: 'pointer',
                    border: `${selectedSwith === "psCtrl" ? "2px solid red" : ""}`
                  }}
                >
                </div>

                <div
                  onClick={()=>setSelectedSwitch("ventilation")}
                  style={{
                    position: 'absolute',
                    left: '390px',
                    top: '205px',
                    width: '18px',
                    height: '30px',
                    cursor: 'pointer',
                    border: `${selectedSwith === "ventilation" ? "2px solid red" : ""}`
                  }}
                >
                </div>

                <div
                  onClick={()=>setSelectedSwitch("azMotor1")}
                  style={{
                    position: 'absolute',
                    left: '225px',
                    top: '245px',
                    width: '67px',
                    height: '100px',
                    cursor: 'pointer',
                    border: `${selectedSwith === "azMotor1" ? "2px solid red" : ""}`
                  }}
                >
                </div>

                <div
                  onClick={()=>setSelectedSwitch("ceaMotor")}
                  style={{
                    position: 'absolute',
                    left: '305px',
                    top: '255px',
                    width: '38px',
                    height: '90px',
                    cursor: 'pointer',
                    border: `${selectedSwith === "ceaMotor" ? "2px solid red" : ""}`
                  }}
                >
                </div>

                <div
                  onClick={()=>setSelectedSwitch("azMotor2")}
                  style={{
                    position: 'absolute',
                    left: '355px',
                    top: '245px',
                    width: '67px',
                    height: '100px',
                    cursor: 'pointer',
                    border: `${selectedSwith === "azMotor2" ? "2px solid red" : ""}`
                  }}
                >
                </div>

                <div
                  style={{
                    color: 'white',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '40%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '0%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '100%',
                      }}
                    ></div>
                    <p>{switches[selectedSwith]}</p>
                  </div>
      


                </div>
                

              </div>
            </div>
          </div>
        )}

        {selectedRack === "antennaControl" && (
          <div
            style={{
              display: 'flex', 
              position: 'fixed', 
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: '1',
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.9)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',
                width: '1280px',
                height: '720px'
              }}
            >
              <img src="/images/technology/server2.png" alt="" style={{width: '20%', height: '100%'}}/>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '50%',
                  height: '100%',
                  // background: 'red'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                    color: 'white',
                    gap: '20%'
                  }}
                >
                  <h1 style={{fontSize: 'x-large', fontWeight: 'bold'}}>Antenna Control Rack</h1>
                  <button
                    onClick={()=>setSelectedRack("")}
                    style={{background: 'transparent', cursor: 'pointer', borderRadius: '50%', padding: '1%'}}
                  >X</button>
                </div>

                <div
                  style={{
                    color: 'white',
                    width: '100%',
                    height: '100%',
                  }}
                >

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '12%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '10%',
                        background: 'white',
                      }}
                    ></div>
                    <p>Power Supply</p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '0%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '10%',
                        background: 'white',
                      }}
                    ></div>
                    <p>Polarization Adjustment Block</p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '-5%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '10%',
                        background: 'white',
                      }}
                    ></div>
                    <p>Block of Analyzers</p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '0%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '10%',
                        background: 'white',
                      }}
                    ></div>
                    <p>Local Control Unit</p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '-3%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '10%',
                        background: 'white',
                      }}
                    ></div>
                    <p>Processing Module</p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '0%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '10%',
                        background: 'white',
                      }}
                    ></div>
                    <p>Duplicate Processing Module</p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '-4%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '10%',
                        background: 'white',
                      }}
                    ></div>
                    <p>Switching Module</p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '-3%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '10%',
                        background: 'white',
                      }}
                    ></div>
                    <p>Duplicate Switchinging Module</p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '-2%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '10%',
                        background: 'white',
                      }}
                    ></div>
                    <p>Auto Tracking Block</p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '0%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '10%',
                        background: 'white',
                      }}
                    ></div>
                    <p>Dehydrator</p>
                  </div>
      

                </div>
                

              </div>
            </div>
          </div>
        )}

        {selectedRack === "receiving" && (
          <div
            style={{
              display: 'flex', 
              position: 'fixed', 
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: '1',
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.9)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',
                width: '1280px',
                height: '720px'
              }}
            >
              <img src="/images/technology/server3.png" alt="" style={{width: '20%', height: '100%'}}/>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '50%',
                  height: '100%',
                  // background: 'red'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                    color: 'white',
                    gap: '20%'
                  }}
                >
                  <h1 style={{fontSize: 'x-large', fontWeight: 'bold'}}>Receiving Server Rack</h1>
                  <button
                    onClick={()=>setSelectedRack("")}
                    style={{background: 'transparent', cursor: 'pointer', borderRadius: '50%', padding: '1%'}}
                  >X</button>
                </div>

                <div
                  style={{
                    color: 'white',
                    width: '100%',
                    height: '100%',
                  }}
                >

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '0%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '10%',
                        background: 'white',
                      }}
                    ></div>
                    <p>Interface Converter</p>
                  </div>
      
                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '0%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '100%',
                        background: 'white',
                        clipPath: 'polygon(0 0, 100% 50%, 0 100%, 0 90%, 90% 50%, 0 10%)'
                      }}
                    ></div>
                    <p>Intermediate Frequency Amplifier</p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '0%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '10%',
                        background: 'white',
                      }}
                    ></div>
                    <p>Demodulator</p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '0%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '10%',
                        background: 'white',
                      }}
                    ></div>
                    <p>Modulator</p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '0%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '100%',
                        background: 'white',
                        clipPath: 'polygon(0 0, 100% 50%, 0 100%, 0 90%, 90% 50%, 0 10%)',
                        
                      }}
                    ></div>
                    <p>Testing Block</p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '0%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '10%',
                        background: 'white',
                      }}
                    ></div>
                    <p>Console</p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '0%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '100%',
                        background: 'white',
                        clipPath: 'polygon(0 0, 100% 50%, 0 100%, 0 90%, 90% 50%, 0 10%)',
                        
                      }}
                    ></div>
                    <p>Receiving Station System</p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '10%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '100%',
                        background: 'white',
                        clipPath: 'polygon(0 0, 100% 50%, 0 100%, 0 90%, 90% 50%, 0 10%)',
                      }}
                    ></div>
                    <p>Power Supply Stystem</p>
                  </div>


                </div>
                

              </div>
            </div>
          </div>
        )}

        {selectedRack === "processing" && (
          <div
            style={{
              display: 'flex', 
              position: 'fixed', 
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: '1',
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.9)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',
                width: '1280px',
                height: '720px'
              }}
            >
              <img src="/images/technology/server4.png" alt="" style={{width: '20%', height: '100%'}}/>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '50%',
                  height: '100%',
                  // background: 'red'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                    color: 'white',
                    gap: '20%'
                  }}
                >
                  <h1 style={{fontSize: 'x-large', fontWeight: 'bold'}}>Processing Server Rack</h1>
                  <button
                    onClick={()=>setSelectedRack("")}
                    style={{background: 'transparent', cursor: 'pointer', borderRadius: '50%', padding: '1%'}}
                  >X</button>
                </div>

                <div
                  style={{
                    color: 'white',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  {/* <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '10%',
                        background: 'white'
                      }}
                    ></div>
                    <p>Switching and Routing Devices</p>
                  </div> */}

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '5%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '100%',
                        background: 'white',
                        clipPath: 'polygon(0 0, 100% 50%, 0 100%, 0 90%, 90% 50%, 0 10%)'
                      }}
                    ></div>
                    <p>Processing Servers</p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '8%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '10%',
                        background: 'white',
                      }}
                    ></div>
                    <p>Technological Console</p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '5%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '100%',
                        background: 'white',
                        clipPath: 'polygon(0 0, 100% 50%, 0 100%, 0 90%, 90% 50%, 0 10%)',
                        
                      }}
                    ></div>
                    <p>Virtualization Failover Cluster</p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '15%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '100%',
                        background: 'white',
                        clipPath: 'polygon(0 0, 100% 50%, 0 100%, 0 90%, 90% 50%, 0 10%)',
                        
                      }}
                    ></div>
                    <p>Data Storage System</p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1%',
                      marginTop: '10%'
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '100%',
                        background: 'white',
                        clipPath: 'polygon(0 0, 100% 50%, 0 100%, 0 90%, 90% 50%, 0 10%)',
                      }}
                    ></div>
                    <p>Power Supply Stystem</p>
                  </div>


                </div>
                

              </div>
            </div>
          </div>
        )}

        <div className="flex" style={{width: '100%', justifyContent: 'end', paddingRight: '10%', marginTop: '1%', color: 'white'}}>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="border px-2 py-1 rounded"
            // style={{background: 'rgb(125, 230, 230)'}}
          >

            <option value="All" style={{background: '#0b0b2b'}}>All Years</option>
            <option value="2024" style={{background: '#0b0b2b'}}>2024</option>
            <option value="2025" style={{background: '#0b0b2b'}}>2025</option>

          </select>
        </div>

        <div className="w-full flex mt-6" style={{width: '95%', height: '100%', justifyContent: 'center', alignItems: 'center', gap: '1%'}}>

            <div className='flex flex-col items-center' style={{gap: '20px', width: '100%', height: '100%'}}>

              <h3 className='text-xl font-bold' style={{color: 'white'}}>ဂြိုဟ်တုဓာတ်ပုံဖမ်းယူရရှိမှုအချိန်စုစုပေါင်း (စက္ကန့်)</h3>

              <div className='flex' style={{gap: '20px', width: '100%', justifyContent: 'space-around'}}>
                <div style={{ width: '100%', height: '100%', overflowX: 'auto', fontSize: '0.8rem'}}>
                  <table className="table-auto border border-gray-400 text-xs" style={{borderCollapse: 'collapse',  border: '1px solid black', width: '100%'}}>
                    <thead style={{background: "rgb(125, 230, 230)", position: 'sticky', top: '0.1px', border: '1px solid black'}}>
                      <tr>
                        <th className="border border-gray-400 px-2 py-1 text-center">လ</th>
                        {chartData.durationDatasets.map((ds) => (
                          <th key={ds.label} className="border border-gray-400 px-2 py-1 text-right">
                            {ds.label.replace(" Seconds", "")}
                          </th>
                        ))}
                        <th className="border border-gray-400 px-2 py-1 text-right">စုစုပေါင်း</th>
                      </tr>
                    </thead>
                    <tbody className='bg-gray-50'>
                      {chartData.labels.map((month: string, idx: number) => {
                        const rowTotal = chartData.durationDatasets.reduce((sum, ds) => sum + (Number(ds.data[idx]) || 0), 0);
                        return (
                          <tr key={idx}>
                            <td className="border border-gray-400 px-2 py-1 text-left">{month}</td>
                            {chartData.durationDatasets.map((ds) => (<td key={ds.label + idx} className="border border-gray-400 px-2 py-1 text-right">{Number(ds.data[idx] ?? 0)}</td>))}
                            <td className="border border-gray-400 px-2 py-1 text-right font-semibold">{rowTotal}</td> 
                          </tr>
                        );
                      })}

                      {/* total row at bottom */}
                      <tr className="bg-blue-100 font-semibold">
                        <td className="border border-gray-400 px-2 py-1 text-center" colSpan={1}>စုစုပေါင်း</td>
                        {chartData.durationDatasets.map((ds) => {
                          const colTotal = ds.data.reduce((sum, val) => sum + (Number(val) || 0), 0);
                          return (
                            <td key={'total-' + ds.label} className="border border-gray-400 px-2 py-1 text-right">
                              {colTotal}
                            </td>
                          );
                        })}
                        {/* total of all data (sum of all months' totals OR all names' totals) */}
                        <td className="border border-gray-400 px-2 py-1 text-right">
                          {
                            chartData.durationDatasets.reduce((grandTotal, ds) =>
                              grandTotal + ds.data.reduce((sum, val) => sum + (Number(val) || 0), 0), 0)
                          }
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ width: '100%', height: '100%', background: 'rgba(255, 255, 255, 1)', borderRadius: '10px' }}>
                    <canvas ref={chartRef}></canvas>
                </div>
              </div>

            </div>

            {/* Sensing Count */}
            <div className='flex flex-col items-center' style={{gap: '20px', width: '100%', height: '100%'}}>

              <h3 className='text-xl font-bold' style={{color: 'white'}}>ဂြိုဟ်တုဓာတ်ပုံဖမ်းယူရရှိမှုအကြိမ်အရေအတွက်</h3>

              <div className='flex' style={{gap: '20px', width: '100%', justifyContent: 'space-around'}}>
                <div style={{ width: '100%', height: '100%', overflowX: 'auto', fontSize: '0.8rem'}}>
                  <table className="table-auto border border-gray-400 text-xs" style={{borderCollapse: 'collapse',  border: '1px solid black', width: '100%'}}>
                    <thead style={{background: "rgb(125, 230, 230)", position: 'sticky', top: '0.1px', border: '1px solid black'}}>
                      <tr>
                        <th className="border border-gray-400 px-2 py-1 text-center">လ</th>
                        {chartData.countDatasets.map((ds) => (
                          <th key={ds.label} className="border border-gray-400 px-2 py-1 text-right">
                            {ds.label.replace(" Seconds", "")}
                          </th>
                        ))}
                        <th className="border border-gray-400 px-2 py-1 text-right">စုစုပေါင်း</th>
                      </tr>
                    </thead>
                    <tbody className='bg-gray-50'>
                      {chartData.labels.map((month: string, idx: number) => {
                        const rowTotal = chartData.countDatasets.reduce((sum, ds) => sum + (Number(ds.data[idx]) || 0), 0);
                        return (
                          <tr key={idx}>
                            <td className="border border-gray-400 px-2 py-1 text-left">{month}</td>
                            {chartData.countDatasets.map((ds) => (<td key={ds.label + idx} className="border border-gray-400 px-2 py-1 text-right">{Number(ds.data[idx] ?? 0)}</td>))}
                            <td className="border border-gray-400 px-2 py-1 text-right font-semibold">{rowTotal}</td> 
                          </tr>
                        );
                      })}

                      {/* total row at bottom */}
                      <tr className="bg-blue-100 font-semibold">
                        <td className="border border-gray-400 px-2 py-1 text-center" colSpan={1}>စုစုပေါင်း</td>
                        {chartData.countDatasets.map((ds) => {
                          const colTotal = ds.data.reduce((sum, val) => sum + (Number(val) || 0), 0);
                          return (
                            <td key={'total-' + ds.label} className="border border-gray-400 px-2 py-1 text-right">
                              {colTotal}
                            </td>
                          );
                        })}
                        {/* total of all data (sum of all months' totals OR all names' totals) */}
                        <td className="border border-gray-400 px-2 py-1 text-right">
                          {
                            chartData.countDatasets.reduce((grandTotal, ds) =>
                              grandTotal + ds.data.reduce((sum, val) => sum + (Number(val) || 0), 0), 0)
                          }
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ width: '100%', height: '100%', background: 'rgba(255, 255, 255, 1)', borderRadius: '10px' }}>
                    <canvas ref={countChartRef}></canvas>
                </div>
              </div>

            </div>

            

            
        </div>
    </div>

  )
}
