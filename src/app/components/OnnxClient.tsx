'use client'

import React, { useState } from 'react';

export default function YoloONNX() {

  const BASE_URL = process.env.BASE_URL;
  const [beforeImage, setBeforeImage] = useState("")
  const [previewImage, setPreviewImage] = useState("");
  const [buildingCount, setBuildingCount] = useState("")

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${BASE_URL}:5000/predict`, {
      method: 'POST',
      body: formData,
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setPreviewImage(url);

    const objectCount = res.headers.get('X-Object-Count');
    // console.log('Detected objects:', objectCount);
    setBuildingCount(objectCount);

  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBeforeImage(imageUrl); // set the object URL instead of the file object
      handleUpload(file);
    }
  };

  return (
    <div className="flex flex-col" style={{alignItems: 'center', width: '1000px', height:'100%', gap: '10px'}}>
      {previewImage ? (
        <div className='flex' style={{alignItems: 'center', justifyContent: 'center', width: '100%', height:'100%'}}>
            <img
              src={beforeImage}
              alt="Before"
              style={{ width: '400px', border: '2px solid #ccc', borderRadius: '8px' }}
              />
            <div className='flex flex-col' style={{ width: '100%', height: '100%', margin: '3%', textAlign: 'center', alignItems: 'center', justifyContent: 'center', color: 'white'}}>
              MSTC AI model
              <img src="/images/building/ai.png" alt="" style={{width: '100%'}}/>
              <div style={{width: '50px', height: '20px', background: 'white', clipPath: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)', margin: '5%'}}></div>
            </div>
            <img
              src={previewImage}
              alt="Predicted result"
              style={{ width: '400px', border: '2px solid #ccc', borderRadius: '8px' }}
            />
        </div>
      ) : (
        <div className='flex' style={{alignItems: 'center', width: '100%', height:'100%'}}>
          <img
              src={'/images/building/before.png'}
              alt="Before"
              style={{ width: '400px', border: '2px solid #ccc', borderRadius: '8px' }}
              />
            <div className='flex flex-col' style={{ width: '100%', height: '100%', margin: '3%', textAlign: 'center', alignItems: 'center', justifyContent: 'center', color: 'white'}}>
              MSTC AI model
              <img src="/images/building/ai.png" alt="" style={{width: '100%'}}/>
              <div style={{width: '50px', height: '20px', background: 'white', clipPath: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)', margin: '5%'}}></div>
            </div>
            <img
              src={'/images/building/after.jpg'}
              alt="Predicted result"
              style={{ width: '400px', border: '2px solid #ccc', borderRadius: '8px' }}
            />
        </div>
      )}

      <div className='flex' style={{width: '100%', justifyContent: 'space-between', color: 'white'}}>
        <label htmlFor="file-upload" style={{ cursor: 'pointer', backgroundColor: '#007bff', borderRadius: '4px' }}>
          Upload Image
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <p style={{width: '40%'}}>Predicted number of buildings: {buildingCount ? buildingCount : "488"}</p>
      </div>
    </div>
  );
}
