export const appCategories  = [

    {
        name: "ERS Technology",
        id: "technology",
        image: '/images/home/hoffice.gif',
        apps: [
            {
                id: "ersTechnology",
                url: '/ers-technology',
                image: '/images/home/erstechnology.gif'
            }
           
        ]
    },

    {
        name: "Surveillance",
        id: "surveillance",
        image: '/images/home/osis.gif',
        apps: [
            {
                id: "osis",
                // url: '/osis',
                url: 'https://osis.ersmm.org/space-objects',
                image: '/images/home/osis.gif'
            },
            {
                id: "passPrediction",
                // url: '/track-satellite',
                url: 'https://pass.ersmm.org/',
                image: 'images/home/pass.gif'
            },
            // {
            //     id: "reports",
            //     url: '/reports',
            //     image: 'images/home/pass.gif'
            // },
        ]
    },

    {
        name: "Maps",
        id: "maps",
        image: '/images/home/recieve.gif',
        apps: [
            {
                id: "recieveMap",
                url: '/recieved-map',
                // url: 'https://earth.google.com/earth/d/1wHhU9XWSD8V3CdKIHWJA2mjhj5z0IVC8?usp=sharing',
                image: '/images/home/recieve.gif'
            },
            {
                id: "satMap",
                url: 'https://satellitemap.ersmm.org/',
                image: '/images/home/ers.gif'
            },
        ]
    },

    {
        name: "ERS Applied Projects",
        id: "applied",
        image: '/images/home/application.gif',
        apps: [
            {
                id: "agriculture",
                url: '/soil',
                image: 'images/home/soil.png'
            },
            {
                id: "forest",
                url: '/forest',
                image: 'images/home/forest1.gif'
            },
            {
                id: "waterResource",
                url: '/water-resource',
                image: 'images/home/water.gif'
            },
            {
                id: "building",
                url: '/building',
                image: 'images/home/building.gif'
            },
            {
                id: "river",
                url: '/river',
                image: 'images/home/river.gif'
            },
            {
                id: "earthquake",
                url: '/earthquake',
                image: 'images/earthquake/afterEq.gif'
            },
            {
                id: "minerals",
                url: '/minerals',
                image: 'images/home/mineral.png'
            },
            {
                id: "fire",
                url: '/fire',
                image: 'images/fire/fire.gif'
            },
            // {
            //     id: "weather",
            //     url: '/weather',
            //     image: 'images/weather/weather.gif'
            // },
        ]
    }
];

export const apps = [
  {
    id: "recieveMap",
    // url: '/recieved-map',
    url: 'https://earth.google.com/earth/d/1wHhU9XWSD8V3CdKIHWJA2mjhj5z0IVC8?usp=sharing',
    image: '/images/recieve.gif'
  },
  {
    id: "satMap",
    url: 'https://satellitemap.ersmm.org/',
    image: '/images/ers.gif'
  },
  {
    id: "osis",
    url: 'https://osis.ersmm.org/space-objects',
    image: '/images/osis.gif'
  },
  {
    id: "passPrediction",
    url: 'https://pass.ersmm.org/',
    image: 'images/pass.gif'
  },
  {
    id: "agriculture",
    url: 'https://paingphyooo1992.maps.arcgis.com/apps/mapviewer/index.html?layers=11e6037b098247b2962fd606221d4cca',
    image: 'images/soil.png'
  },
  {
    id: "census",
    url: '/census',
    image: 'images/census.gif'
  },
  {
    id: "river",
    url: '/river',
    image: 'images/river.gif'
  },
];

export const censusData = [
    {
        id: "kachin",
        enu: 775273,
        nonEnu: 1422010,
        total: 2197283
    },
    {
        id: "kayah",
        enu: 38240,
        nonEnu: 258663,
        total: 296903
    },
    {
        id: "kayin",
        enu: 772609,
        nonEnu: 718359,
        total: 1490968
    },
    {
        id: "chin",
        enu: 29234,
        nonEnu: 343790,
        total: 373024
    },
    {
        id: "sagaing",
        enu: 802344,
        nonEnu: 5213246,
        total: 6015590
    },
    {
        id: "tanintharyi",
        enu: 773249,
        nonEnu: 607318,
        total: 1380567
    },
    {
        id: "bago",
        enu: 3881164,
        nonEnu: 572527,
        total: 4453691
    },
    {
        id: "magway",
        enu: 2032042,
        nonEnu: 2046462,
        total: 4078504
    },
    {
        id: "mandalay",
        enu: 4465598,
        nonEnu: 1818065,
        total: 6283663
    },
    {
        id: "mon",
        enu: 1286073,
        nonEnu: 431093,
        total: 1717166
    },
    {
        id: "rakhine",
        enu: 345431,
        nonEnu: 2120954,
        total: 2466385
    },
    {
        id: "yangon",
        enu: 7370010,
        nonEnu: 0,
        total: 7370010
    },
    {
        id: "shan",
        enu: 2944515,
        nonEnu: 3572862,
        total: 6517377
    },
    {
        id: "irrawaddy",
        enu: 5546281,
        nonEnu: 0,
        total: 5546281
    },
    {
        id: "naypyitaw",
        enu: 1129344,
        nonEnu: 0,
        total: 1129344
    },
    {
        id: "union",
        enu: 32191407,
        nonEnu: 19125349,
        total: 51316756
    },
];

export const riverData = {
    y2024to2025: [
        {
            region: "bhamo",
            erosion: 18.82,
            accretion: 33.58
        },
        {
            region: "shweku",
            erosion: 21.58,
            accretion: 24.31
        },
        {
            region: "htigyaing",
            erosion: 18.18,	
            accretion: 25.73
        },
        {
            region: "maddaya",
            erosion: 17.29,
            accretion: 18.08
        },
        {
            region: "myingyan",
            erosion: 18.16,
            accretion: 21.47
        },
        {
            region: "sinphyugyun",
            erosion: 26.51,
            accretion: 25.07
        },
        {
            region: "pyay",
            erosion: 15.78,
            accretion: 14.97
        },
        {
            region: "moenyo",
            erosion: 24.97,
            accretion: 28.13
        },
        {
            region: "zalun",
            erosion: 10.46,
            accretion: 5.31
        },
        {
            region: "monywa",
            erosion: 31.10,
            accretion: 29.46
        },
        {
            region: "kani",
            erosion: 12.66,
            accretion: 16.46
        },
        {
            region: "mingin",
            erosion: 12.71,
            accretion: 13.04
        },
    ],
    y2022to2024: [
        {
            region: "bhamo",
            erosion: 36.63,
            accretion: 29.93
        },
        {
            region: "shweku",
            erosion: 34.19,
            accretion: 31.6
        },
        {
            region: "htigyaing",
            erosion: 35.16,	
            accretion: 33.62
        },
        {
            region: "maddaya",
            erosion: 25.34,
            accretion: 27.03
        },
        {
            region: "myingyan",
            erosion: 25.17,
            accretion: 25.94
        },
        {
            region: "sinphyugyun",
            erosion: 35.13,
            accretion: 34.61
        },
        {
            region: "pyay",
            erosion: 15.44,
            accretion: 21.25
        },
        {
            region: "moenyo",
            erosion: 32.43,
            accretion: 38.57
        },
        {
            region: "zalun",
            erosion: 9.58,
            accretion: 11.29
        },
        {
            region: "monywa",
            erosion: 30.81,
            accretion: 29.72
        },
        {
            region: "kani",
            erosion: 20.03,
            accretion: 13.37
        },
        {
            region: "mingin",
            erosion: 17.41,
            accretion: 16.04
        },
    ],
    y2020to2022: [
        {
            region: "bhamo",
            erosion: 32.12,
            accretion: 35.37
        },
        {
            region: "shweku",
            erosion: 28.73,
            accretion: 41.81
        },
        {
            region: "htigyaing",
            erosion: 31.1,	
            accretion: 34.59
        },
        {
            region: "maddaya",
            erosion: 28,
            accretion: 27.45
        },
        {
            region: "myingyan",
            erosion: 39.96,
            accretion: 37.23
        },
        {
            region: "sinphyugyun",
            erosion: 36.07,
            accretion: 31.97
        },
        {
            region: "pyay",
            erosion: 23.81,
            accretion: 22.7
        },
        {
            region: "moenyo",
            erosion: 36.38,
            accretion: 35.3
        },
        {
            region: "zalun",
            erosion: 11.42,
            accretion: 13.17
        },
        {
            region: "monywa",
            erosion: 35.26,
            accretion: 39.03
        },
        {
            region: "kani",
            erosion: 17.85,
            accretion: 18.6
        },
        {
            region: "mingin",
            erosion: 13.92,
            accretion: 14.14
        },
    ],
    y2018to2020: [
        {
            region: "bhamo",
            erosion: 41.79,
            accretion: 43.82
        },
        {
            region: "shweku",
            erosion: 36.69,
            accretion: 26.41
        },
        {
            region: "htigyaing",
            erosion: 34.21,	
            accretion: 32.64
        },
        {
            region: "maddaya",
            erosion: 28.13,
            accretion: 25.86
        },
        {
            region: "myingyan",
            erosion: 31.32,
            accretion: 36.55
        },
        {
            region: "sinphyugyun",
            erosion: 30.09,
            accretion: 35.64
        },
        {
            region: "pyay",
            erosion: 21.77,
            accretion: 24.18
        },
        {
            region: "moenyo",
            erosion: 34.53,
            accretion: 37.95
        },
        {
            region: "zalun",
            erosion: 12.02,
            accretion: 12.61
        },
        {
            region: "monywa",
            erosion: 23.8,
            accretion: 41.87
        },
        {
            region: "kani",
            erosion: 5.55,
            accretion: 38.87
        },
        {
            region: "mingin",
            erosion: 2.67,
            accretion: 38.97
        },
    ],
    y2016to2018: [
        {
            region: "bhamo",
            erosion: 39.21,
            accretion: 34.36
        },
        {
            region: "shweku",
            erosion: 42.02,
            accretion: 39.61
        },
        {
            region: "htigyaing",
            erosion: 36.17,	
            accretion: 38.32
        },
        {
            region: "maddaya",
            erosion: 29.02,
            accretion: 31.77
        },
        {
            region: "myingyan",
            erosion: 39,
            accretion: 34.25
        },
        {
            region: "sinphyugyun",
            erosion: 35,
            accretion: 36.13
        },
        {
            region: "pyay",
            erosion: 31.31,
            accretion: 25.73
        },
        {
            region: "moenyo",
            erosion: 49.32,
            accretion:46.2
        },
        {
            region: "zalun",
            erosion: 16,
            accretion: 14.56
        },
        {
            region: "monywa",
            erosion: 45.83,
            accretion: 30.5
        },
        {
            region: "kani",
            erosion: 36.18,
            accretion: 7.08
        },
        {
            region: "mingin",
            erosion: 25.55,
            accretion: 3.58
        },
    ],
    riverShape: [
        {
            type: "river",
            y16: 1610.25,
            y18: 1685.69,
            y20: 1560.75,
            y22: 1543.55,
            y24: 1559.05,
            y25: 1510.7
        },
        {
            type: "erosion",
            y16: 0,
            y18: 433.24,
            y20: 305,
            y22: 331.23,
            y24: 321.9,
            y25: 228.3
        },
        {
            type: "accretion",
            y16: 0,
            y18: 357.8,
            y20: 429.94,
            y22: 348.43,
            y24: 306.4,
            y25: 274.2
        },
        {
            type: "unchange",
            y16: 0,
            y18: 1252.45,
            y20: 1255.74,
            y22: 1212.33,
            y24: 1237.15,
            y25: 1282.45
        },
    ],
    riverByYear: [
        {
            year: 2018,
            erosion: 433.24,
            accretion: 357.8,
            unchange: 1252.45
        },
        {
            year: 2020,
            erosion: 305,
            accretion: 429.94,
            unchange: 1255.74
        },
        {
            year: 2022,
            erosion: 331.23,
            accretion: 348.43,
            unchange: 1212.33
        },
        {
            year: 2024,
            erosion: 321.9,
            accretion: 306.4,
            unchange: 1237.15
        },
        {
            year: 2025,
            erosion: 228.3,
            accretion: 274.2,
            unchange: 1282.45
        },
    ]
}

export const forestData = [
    {
        year: "2020",
        area: 19885.8
    },
    {
        year: "2021",
        area: 17169.4
    },
    {
        year: "2022",
        area: 16889.1
    },
    {
        year: "2023",
        area: 18495.5
    },
    {
        year: "2024",
        area: 21020.3
    },
]

export const soilData = [
    {
        year: 2020,
        clay: 602.28,
        stone: 8416.66,
        lateral: 10963,
        peat: 17770
    },
    {
        year: 2021,
        clay: 640.74,
        stone: 5661.79,
        lateral: 12713,
        peat: 18785.7
    },
    {
        year: 2022,
        clay: 938.76,
        stone: 4411.51,
        lateral: 22877,
        peat: 9856.61
    },
    {
        year: 2023,
        clay: 844.99,
        stone: 3702.18,
        lateral: 14540,
        peat: 18652.1
    },
    {
        year: 2024,
        clay: 598.62,
        stone: 4867.83,
        lateral: 13135.9,
        peat: 19140.6
    },
    
]



