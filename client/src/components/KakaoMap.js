// src/components/KakaoMap.js
import React, { useEffect } from 'react';

const KakaoMap = () => {
  useEffect(() => {
    const existingScript = document.getElementById('kakao-map-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'kakao-map-script';
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=9d4b026f1d1ee43003937064e3b1e8ed&autoload=false`; // autoload=false!
      script.async = true;
      script.onload = () => {
        // ✅ 여기서 확실히 로드된 후 loadMap 실행
        window.kakao.maps.load(() => {
          loadMap();
        });
      };
      document.head.appendChild(script);
    } else {
      // ✅ 이미 있으면 바로 loadMap
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          loadMap();
        });
      }
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
