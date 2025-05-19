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
        const seoulMatch = data.documents.find(doc =>
          doc.address_name.includes('서울')
        );
        const selected = seoulMatch || data.documents[0];

        const result = {
          name: keyword,
          lat: parseFloat(selected.y),
          lng: parseFloat(selected.x),
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

  // ✅ 최종 개선 + 정제 버전
  const getPlaceNameFromLine = (line) => {
    const parts = line.split(':');
    let name = parts[parts.length - 1].trim();

    if (name.includes('+')) name = name.split('+')[0].trim();
    if (name.includes('(')) name = name.split('(')[0].trim();

    const removeWords = [
      '산책로', '산책길', '산책', '걷기', '둘레길', '탐방로', '산림욕',
      '일반 캠핑존', '바베큐존', '스테이션', '게스트하우스',
      '정원', '정원카페', '루프탑카페', '감성카페', '브런치카페',
      '골목산책', '투어', '스파', 
      // '카페', 👈❌ 이거만 삭제
      '레스토랑', '베이커리', '한정식', '한옥스테이',
      '스테이', '라운지', '옥상', '테라스', '00', '30'
    ];
    
    
    removeWords.forEach(word => {
      name = name.replace(word, '').trim();
    });

    return name;
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

      // ✅ 마커 찍기
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

      // ✅ 경로 선 긋기
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
