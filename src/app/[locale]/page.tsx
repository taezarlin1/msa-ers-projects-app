"use client"

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import { appCategories } from '@/data/data';
import { useState, useRef, useEffect } from 'react';
import { ShootingStars } from '../components/ui/shooting-stars';
import { StarsBackground } from '../components/ui/stars-background';
 
export default function HomePage() {
  const t = useTranslations();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAtCategories, setIsAtCategories] = useState<boolean>(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const handleClick = () => {
    if (isAtCategories) {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Scroll to categories
      categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtCategories(entry.isIntersecting);
      },
      { threshold: 0.6 } //  adjust threshold
    );

    const el = categoriesRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <>
      <StarsBackground />
      <ShootingStars />
      <main className="flex-grow px-15 text-gray-100" style={{ fontFamily: 'Pyidaungsu', paddingBottom: '10%' }}>
        <header>
          <div className='flex justify-center w-full' style={{width: '100%', alignItems: 'center', justifyContent: 'space-around', padding: '10px'}}>
            <div className='flex flex-col' style={{width: '100%', transform: 'skew(-40deg)'}}>

                <div className='flex items-center justify-center' style={{width: '100%', height: '100px'}}>
                  <div className='flex items-center justify-center gap-5' style={{width: '100%', background: 'rgba(0, 0, 255, 0.1)', padding: '10px'}}>
                    <div style={{transform: 'skew(40deg)'}}>
                      <img src="/mstc.png" alt="" className='h-20' loading='lazy' />
                    </div>
                    <div style={{transform: 'skew(40deg)'}}>
                      <h1 className=" text-center font-bold text-white" style={{fontSize: '3.5rem', lineHeight: '3.5rem'}}>{t('PAGE.home')}</h1>
                    </div>
                  </div>
                  <div className='flex' style={{width: '10px', height: '100%', background: 'rgb(37,58,149)'}}></div>
                </div>

                <div className='flex' style={{ width: '100%', height: '10px', background: 'rgb(37,58,149)'}}>
                </div>
                
            </div>
            <div className='flex items-center justify-around' style={{width: '100%', justifyContent: 'space-around', color: 'navy', fontSize: '2rem'}}>
              
              <a 
                style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: 'rgb(37,58,149)', 
                  color: 'white',
                  width: '25%', height: '50px', 
                  transform: 'skew(-40deg)'}} 
                className='hover:scale-105'
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(190, 255, 255, 1)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'white')} 
                href="/"
              >
                <span style={{ transform: 'skew(40deg)' }}>
                  {t('FOOTER.home')}
                </span>
              </a>
              <a 
                style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: 'rgb(37,58,149)', 
                  color: 'white',
                  width: '35%', height: '50px', 
                  transform: 'skew(-40deg)'
                }} 
                className='hover:scale-105'
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(190, 255, 255, 1)')} 
                onMouseLeave={(e) => (e.currentTarget.style.color = 'white')} 
                href="/terms"
              >
                <span style={{ transform: 'skew(40deg)' }}>
                  {t('FOOTER.terms')}
                </span>
              </a>
              <a 
                style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: 'rgb(37,58,149)', 
                  color: 'white',
                  width: '25%', height: '50px', 
                  transform: 'skew(-40deg)'}} 
                className='hover:scale-105'
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(190, 255, 255, 1)')} 
                onMouseLeave={(e) => (e.currentTarget.style.color = 'white')} 
                href="/about"
              >
                <span style={{ transform: 'skew(40deg)' }}>
                  {t('FOOTER.about')}
                </span>
              </a>
            </div>
          </div>
        </header>

        <div className='flex flex-col' style={{width: '100%', height: '80vh'}}>
            <div style={{height: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <div className='flex flex-col' style={{width: '20%', height: '100%', justifyContent: 'space-between'}}>
                <img src="/images/home/1.gif" alt="" style={{rotate: '-10deg', width: '30%'}} loading='lazy'/>
                <img src="/images/home/shuttle2.gif" alt="" style={{}} loading='lazy'/>
              </div>
              <div className='flex flex-col' style={{height: '100%', width: '40%', justifyContent: 'end'}}>
                <img src="/images/home/hoffice.gif" alt="" style={{borderTopLeftRadius: '10%', borderTopRightRadius: '10%'}} loading='lazy'/>
              </div>
              <div className='flex flex-col' style={{width: '20%', height: '100%', justifyContent: 'space-between'}}>
                <img src="/images/home/3.gif" alt="" style={{rotate: '30deg', width: '30%'}} loading='lazy'/>
                <div className='flex flex-col' style={{marginLeft: '50%', justifyContent: 'end', alignItems: 'start', width: '80%', height: '80%', backgroundImage: "url(/images/home/astronaut.png)", backgroundPosition: 'center', backgroundSize: 'cover'}}>
                  <img src="/images/home/astronaut2.gif" alt="" style={{width: '40%'}} loading='lazy'/>
                </div>
              </div>
            </div>
            <div style={{height: '10%', background: 'rgb(37,58,149)', clipPath: 'polygon(100% 90%, 61.6% 90%, 59.3% 44%, 40.3% 44%, 38% 89%, 0 90%, 0 100%, 38.3% 100%, 40.5% 54%, 59% 54%, 61.3% 100%, 100% 100%)'}}>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'rgb(37,58,149)', fontSize: '5rem', fontWeight: 'bold'}}>
              <a onClick={handleClick}  className='cursor-pointer' style={{margin: '-50px'}}>{isAtCategories ? '˄' : '˅'}</a>
            </div>
        </div>

        <div id='categories' ref={categoriesRef} style={{height: '80vh', width: '100%'}}>
          <div className={`flex justify-start ${selectedCategory ? 'cursor-pointer' : ''}`} style={{margin: "50px", fontSize: '2rem', zIndex: '100'}} onClick={()=>{setSelectedCategory(null)}}>
            <button className={`font-semibold text-white`} >{t('PAGE.categories')} {selectedCategory ? '⤴' : ''}</button>
          </div>

          <div className='animate-fade-in grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6' style={{width: '100%'}}>
            
            {/* Categories Grid */}
            {!selectedCategory &&
              appCategories.map((cat, index) => (
                <div
                  key={cat.id}
                  className={`block p-6 rounded-xl shadow shadow-blue-200 hover:shadow-md transition transform hover:scale-105 hover:z-10 delay-150 cursor-pointer`}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{ background: 'rgba(0, 0, 255, 0.1)' }}
                >
                  <div className="flex justify-center mb-4">
                    <img
                      src={cat.image}
                      alt={`${cat.id} preview`}
                      loading="lazy"
                      style={{ width: '380px', height: '260px' }}
                    />
                    <div className='flex flex-col' style={{width: '100%'}}>
                      <h1 className="text-xl font-semibold text-center" style={{ width: '100%', color: 'white'}}>
                      {cat.name}
                      </h1>
                      <p style={{padding: '50px', textAlign: 'justify', color: 'grey'}}>{t(`CATEGORIES.${cat.id}`)}</p>
                    </div>
                  </div>
                  
                </div>
              ))}


            
          </div>

          {/* Apps Grid */}
          {(selectedCategory && appCategories.find(cat => cat.id === selectedCategory)?.apps.length < 4 ) && (
            <div style={{overflowX: 'scroll'}}>
              <div className="animate-fade-in gap-6 transition duration-500" style={{display: 'grid', gridAutoFlow: 'column', gridAutoColumns: '20%'}}>
                {appCategories
                  .find((cat) => cat.id === selectedCategory)
                  ?.apps.map((app, index) => (
                    <Link
                      key={app.id}
                      href={app.url}
                      target="_blank"
                      className={`block p-6 rounded-xl shadow shadow-blue-200 hover:shadow-md transition transform hover:scale-105 hover:z-10`}
                      style={{background: "rgba(0, 0, 255, 0.1)"}}
                    >
                      <div className="mb-4 h-40 flex items-center justify-center overflow-hidden">
                        <img
                          src={app.image}
                          alt={`${app.id} preview`}
                          // className="w-[160px] max-w-full max-h-full object-contain"
                          loading="lazy"
                          style={{width: "320px", height: "160px"}}
                        />

                      </div>
                      <h2 className="text-xl font-semibold" style={{color: "white"}}>{t(`APPS.${app.id}.name`)}</h2>
                      <p className="mt-2 text-sm" style={{color: 'grey'}}>{t(`APPS.${app.id}.description`)}</p>
                    </Link>
                  ))}
              </div>
            </div>
          )}

          {/* Apps number greater than 4 */}
          {(selectedCategory && appCategories.find(cat => cat.id === selectedCategory)?.apps.length > 4 ) && (
            <div className="animate-fade-in gap-6 transition duration-500" style={{display: 'grid', gridTemplateColumns: '24% 24% 24% 24%'}}>
              {appCategories
                .find((cat) => cat.id === selectedCategory)
                ?.apps.map((app, index) => (
                  <Link
                    key={app.id}
                    href={app.url}
                    target="_blank"
                    className={`block p-6 rounded-xl shadow shadow-blue-200 hover:shadow-md transition transform hover:scale-105 hover:z-10`}
                    style={{background: "rgba(0, 0, 255, 0.1)"}}
                  >
                    <div className="mb-4 h-40 flex items-center justify-center overflow-hidden">
                      <img
                        src={app.image}
                        alt={`${app.id} preview`}
                        // className="w-[160px] max-w-full max-h-full object-contain"
                        loading="lazy"
                        style={{width: "320px", height: "160px"}}
                      />

                    </div>
                    <h2 className="text-xl font-semibold" style={{color: "white"}}>{t(`APPS.${app.id}.name`)}</h2>
                    <p className="mt-2 text-sm" style={{color: 'grey'}}>{t(`APPS.${app.id}.description`)}</p>
                  </Link>
                ))}
            </div>
          )}
        </div>
        
      </main>

      <footer className="border-t border-gray-500 p-4 text-center text-sm text-gray-500" style={{background: "rgba(0, 0, 255, 0.1)", fontFamily: 'Pyidaungsu', borderColor: 'rgba(0, 20, 255, 1)'}}>
          <div className='flex flex-col items-center justify-center'>
              {/* <div className="flex gap-4">
                <a href="/terms" className="text-blue-800 hover:text-gray-800 transition">{t('FOOTER.terms')}</a>
                <a href="/about" className="text-blue-800 hover:text-gray-800 transition">{t('FOOTER.about')}</a>
                <a href="/contact" className="text-blue-800 hover:text-gray-800 transition">{t('FOOTER.contact')}</a>
              </div> */}
              <p className="mt-2">MSA &copy; {new Date().getFullYear()} All Rights Reserved</p>
            </div>
      </footer>
    </>
  );
}