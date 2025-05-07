import React, { useEffect } from 'react';

const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
const JS_API_KEY = process.env.REACT_APP_KAKAO_JS_KEY;

const MapView = ({ schedule }) => {
  const getCoordsByKeyword = async (keyword) => {
    try {
      console.log(`📍 키워드 검색 중: ${keyword}`);
      const res = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(keyword)}`,
        {
          headers: {
            Authorization: `KakaoAK ${REST_API_KEY}`,
          },
        }
      );
      const data = await res.json();
      console.log('📦 응답 받은 데이터:', data);

      if (data.documents.length > 0) {
        const result = {
          name: keyword,
          lat: parseFloat(data.documents[0].y),
          lng: parseFloat(data.documents[0].x),
        };
        console.log('✅ 좌표 변환 성공:', result);
        return result;
      } else {
        console.warn(`⚠️ '${keyword}'에 대한 검색 결과가 없습니다.`);
      }
    } catch (err) {
      console.error(`❌ '${keyword}' 좌표 가져오기 실패`, err);
    }
    return null;
  };

  const getPlaceNameFromLine = (line) => {
    const parts = line.split(':');
    if (parts.length >= 3) return parts.slice(2).join(':').trim();
    if (parts.length === 2) return parts[1].trim();
    return line;
  };

  useEffect(() => {
    const loadMap = async () => {
      if (!schedule || schedule.length === 0) return;

      const keywords = schedule.map(getPlaceNameFromLine);
      const results = await Promise.all(keywords.map(getCoordsByKeyword));
      const filtered = results.filter((r) => r !== null);

      if (!window.kakao || !window.kakao.maps || filtered.length === 0) {
        console.warn('❗ 지도 초기화 실패. 조건이 충족되지 않음');
        return;
      }

      const mapContainer = document.getElementById('map');
      const mapOption = {
        center: new window.kakao.maps.LatLng(filtered[0].lat, filtered[0].lng),
        level: 5,
      };
      const map = new window.kakao.maps.Map(mapContainer, mapOption);

      // 👉 마커 및 인포윈도우
      filtered.forEach((place) => {
        const marker = new window.kakao.maps.Marker({
          map,
          position: new window.kakao.maps.LatLng(place.lat, place.lng),
          title: place.name,
        });

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;">${place.name}</div>`,
        });

        window.kakao.maps.event.addListener(marker, 'mouseover', () =>
          infowindow.open(map, marker)
        );
        window.kakao.maps.event.addListener(marker, 'mouseout', () =>
          infowindow.close()
        );
      });

      // ✅ 마커 간 선(Polyline) 그리기
      const linePath = filtered.map(
        (place) => new window.kakao.maps.LatLng(place.lat, place.lng)
      );

      const polyline = new window.kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 4,
        strokeColor: '#FF5A5F',
        strokeOpacity: 0.8,
        strokeStyle: 'solid',
      });

      polyline.setMap(map);
    };

    // ✅ 스크립트 로드 또는 바로 실행
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(loadMap);
    } else {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${JS_API_KEY}&autoload=false&libraries=services`;
      script.async = true;
      script.onload = () => window.kakao.maps.load(loadMap);
      document.head.appendChild(script);
    }
  }, [schedule]);

  return (
    <div>
      <h2>🗺️ 여행 코스 지도</h2>
      <div id="map" style={{ width: '100%', height: '500px' }}></div>
    </div>
  );
};

export default MapView;
