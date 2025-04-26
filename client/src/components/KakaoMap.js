// src/components/KakaoMap.js
import React, { useEffect } from 'react';

const KakaoMap = () => {
  useEffect(() => {
    const existingScript = document.getElementById('kakao-map-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'kakao-map-script';
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=67695b4f0cc321dc89daa86034682e80&autoload=true`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        loadMap();
      };
    } else {
      loadMap();
    }
  }, []);

  const loadMap = () => {
    if (!window.kakao || !window.kakao.maps) {
      console.error('Kakao Maps SDK not loaded!');
      return;
    }

    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780),
      level: 5,
    };
    const map = new window.kakao.maps.Map(container, options);

    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(37.5665, 126.9780),
    });
    marker.setMap(map);
  };

  return (
    <div>
      <h3>🗺️ 지도 예시</h3>
      <div
        id="map"
        style={{
          width: '100%',
          height: '300px',
          marginTop: '20px',
          borderRadius: '10px',
          border: '1px solid #ccc',
        }}
      ></div>
    </div>
  );
};

export default KakaoMap;
