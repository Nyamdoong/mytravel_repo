import React, { useEffect } from 'react';

const KakaoMap = () => {
  const JS_KEY = process.env.REACT_APP_KAKAO_JS_KEY;

  useEffect(() => {
    const existingScript = document.getElementById('kakao-map-script');
    console.log('✅ JS_KEY:', process.env.REACT_APP_KAKAO_JS_KEY);
    console.log('JS_KEY:', JS_KEY);

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'kakao-map-script';
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${JS_KEY}&autoload=false`; // ✅ env에서 키 가져옴
      script.async = true;
      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            loadMap();
          });
        } else {
          console.error('❌ Kakao Maps SDK 로딩 실패');
        }
      };
      document.head.appendChild(script);
    } else {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          loadMap();
        });
      }
    }
  }, [JS_KEY]);

  const loadMap = () => {
    if (!window.kakao || !window.kakao.maps) {
      console.error('❌ Kakao Maps SDK 미로드 상태');
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
