'use client'

import { useTranslations } from 'next-intl'
import {  useEffect, useRef, useState } from 'react'
import '@/app/[locale]/globals.css'
import './styles.css'

export default function OsisClient() {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center" style={{ fontFamily: 'Pyidaungsu', height: '100vh', background: 'radial-gradient(circle_at_center,_#0b0b2b,_#1b2735,_#090a0f)'}}>
        <h2 className='text-5xl font-bold top-20' style={{
            marginBottom: "0px",
            color: 'white'
        }}>Outer Space Intelligence System </h2>
        {/* <p className='text-xl' style={{
            marginBottom: "50px",
            textIndent: "50px",
            lineHeight: "2"
        }}>{t('RIVER.about')}</p> */}
        
        <div className='flex' style={{width: '100%', height: '100%', gap: '0%', marginTop: '10px'}}>
          

            {/* <div className='flex' style={{width: '60%', height: '100%', alignItems: 'center', justifyContent: 'center', background: 'red'}}> */}
                {/* <iframe src="/html/Rare_Earth/Perfect_Rare_Earth.html" style={{width: '100%', height: '100%'}}></iframe> */}
                {/* <iframe src="/html/osis.html" style={{width: '100%', height: '100%'}}></iframe> */}
                {/* <img src="/images/earthquake/damaged.png" alt="" style={{width: '100%'}}/> */}
            {/* </div> */}
            <div className='flex' style={{width: '50%', height: '100%'}}>
              <iframe src='https://osisdashboard.ersmm.org/d/cdst5rmru1ypse/mstc-osis?orgId=1&from=now-24h&to=now&timezone=browser&var-category=ROCKET%20BODY&var-category=ACTIVE%20SATELLITE&var-category=INACTIVE%20SATELLITE&var-category=DEBRIS&var-category=CUBESAT&var-category=UNKNOWN&var-country=ABS%20Global%20Ltd&var-country=ALGERIA&var-country=ARAB%20SATELLITE%20COMMUNICATIONS%20ORGANIZATION&var-country=ARGENTINA&var-country=ASIASAT%20CORP&var-country=AUSTRALIA&var-country=AUSTRIA&var-country=AZERBAIJAN&var-country=Bahrain&var-country=BELARUS&var-country=BELGIUM&var-country=BOLIVIA&var-country=Botswana&var-country=BRAZIL&var-country=CANADA&var-country=CHILE&var-country=COLOMBIA&var-country=COMMONWEALTH%20OF%20INDEPENDENT%20STATES&var-country=Croatia&var-country=Czechia&var-country=CZECHOSLOVAKIA&var-country=DENMARK&var-country=Djibouti&var-country=ECUADOR&var-country=EGYPT&var-country=ESTONIA&var-country=EUROPEAN%20ORGANIZATION%20FOR%20THE%20EXPLOITATION%20OF%20METEOROLOGICAL%20SATELLITES&var-country=EUROPEAN%20SPACE%20AGENCY&var-country=EUROPEAN%20TELECOMMUNICATIONS%20SATELLITE%20ORGANIZATION%20%28EUTELSAT%29&var-country=FINLAND&var-country=FRANCE&var-country=FRANCE%2FGERMANY&var-country=FRANCE%2FITALY&var-country=GERMANY&var-country=GLOBALSTAR&var-country=GREECE&var-country=HASHEMITE%20KINGDOM%20OF%20JORDAN&var-country=HUNGARY&var-country=INDIA&var-country=INDONESIA&var-country=INTERNATIONAL%20MARITIME%20SATELLITE%20ORGANIZATION%20%28INMARSAT%29&var-country=INTERNATIONAL%20SPACE%20STATION&var-country=INTERNATIONAL%20TELECOMMUNICATIONS%20SATELLITE%20ORGANIZATION%20%28INTELSAT%29&var-country=IRAN&var-country=IRAQ&var-country=ISRAEL&var-country=ITALY&var-country=JAPAN&var-country=KAZAKHSTAN&var-country=Kuwait&var-country=LAOS&var-country=LITHUANIA&var-country=LUXEMBOURG&var-country=MALAYSIA&var-country=MEXICO&var-country=Monaco&var-country=MOROCCO&var-country=NETHERLANDS&var-country=NEW%20ICO&var-country=NIGERIA&var-country=NORTH%20ATLANTIC%20TREATY%20ORGANIZATION&var-country=NORTH%20KOREA&var-country=NORWAY&var-country=O3B%20NETWORKS&var-country=ORBITAL%20TELECOMMUNICATIONS%20SATELLITE%20%28GLOBALSTAR%29&var-country=PAKISTAN&var-country=PEOPLES%20REPUBLIC%20OF%20BANGLADESH&var-country=PEOPLE%27S%20REPUBLIC%20OF%20CHINA&var-country=PEOPLES%20REPUBLIC%20OF%20CHINA%2FBRAZIL&var-country=PERU&var-country=POLAND&var-country=PORTUGAL&var-country=REGIONAL%20AFRICAN%20SATELLITE%20COMMUNICATIONS%20ORG&var-country=REPUBLIC%20OF%20ANGOLA&var-country=REPUBLIC%20OF%20BULGARIA&var-country=REPUBLIC%20OF%20KENYA&var-country=REPUBLIC%20OF%20PHILIPPINES&var-country=REPUBLIC%20OF%20RWANDA&var-country=REPUBLIC%20OF%20SLOVENIA&var-country=REPUBLIC%20OF%20TUNISIA&var-country=SAUDI%20ARABIA&var-country=SEA%20LAUNCH%20DEMO&var-country=SINGAPORE&var-country=SINGAPORE%2FTAIWAN&var-country=SOCI%C3%89T%C3%89%20EUROP%C3%89ENNE%20DES%20SATELLITES&var-country=SOUTH%20AFRICA&var-country=SOUTH%20KOREA&var-country=SPAIN&var-country=STATE%20OF%20QATAR&var-country=SWEDEN&var-country=SWITZERLAND&var-country=TAIWAN&var-country=THAILAND&var-country=TO%20BE%20DETERMINED%2FUNKNOWN&var-country=TURKEY&var-country=TURKMENISTAN%2FMONACO&var-country=UKRAINE&var-country=UNITED%20ARAB%20EMIRATES&var-country=UNITED%20KINGDOM&var-country=UNITED%20STATES%2FBRAZIL&var-country=UNITED%20STATES%20OF%20AMERICA&var-country=Unknown&var-country=URUGUAY&var-country=VENEZUELA&var-country=VIETNAM&var-norad_id=60089&var-vari_t=hour' style={{width: '100%', height: '100%'}} frameBorder="0"></iframe>
              {/* <iframe src='https://osisdashboard.ersmm.org/dashboards' style={{width: '100%', height: '100%'}} frameBorder="0"></iframe> */}
            </div>

            <div className='flex' style={{width: '50%', height: '100%'}}>
              <iframe src="/html/osis.html" style={{width: '100%', height: '100%'}} frameBorder="0"></iframe>
            </div>


        </div>
    </div>

  )
}
