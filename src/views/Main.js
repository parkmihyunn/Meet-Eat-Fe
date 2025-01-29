import React from "react";
import { useEffect, useState, useMemo } from "react";
import { Map, MapMarker, Circle } from "react-kakao-maps-sdk";
import { ReactComponent as IconMyLocation } from "../assets/acc-icon.svg";
import { debounce } from "lodash";

const { kakao } = window;

export default function Main() {
  // 지도의 중심좌표

  const [center, setCenter] = useState({
    lat: 37.503081,
    lng: 127.04158,
  });

  // 현재 위치
  const [position, setPosition] = useState({
    lat: 37.503081,
    lng: 127.04158,
  });

  // 지도의 중심을 유저의 현재 위치로 변경
  const setCenterToMyPosition = () => {
    console.log("클릭");
    setCenter(position);
  };

  // 지도 중심좌표 이동 감지 시 지도의 중심좌표를 이동된 중심좌표로 설정
  const updateCenterWhenMapMoved = useMemo(
    () =>
      debounce((map) => {
        setCenter({
          lat: map.getCenter().getLat(),
          lng: map.getCenter().getLng(),
        });
      }, 100),
    []
  );

  // 지도가 처음 렌더링되면 중심좌표를 현위치로 설정하고 위치 변화 감지
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });

    navigator.geolocation.watchPosition((pos) => {
      setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, []);

  // 키워드 검색
  const { kakao } = window;
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState();

  useEffect(() => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch("금천구 맛집", (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        let markers = [];

        for (var i = 0; i < data.length; i++) {
          // @ts-ignore
          markers.push({
            position: {
              lat: data[i].y,
              lng: data[i].x,
            },
            content: data[i].place_name,
          });
        }
        setMarkers(markers);
      }
    });
  }, [map]);

  return (
    <div className="relative w-full h-full">
      <Map
        className="w-full h-full"
        id="map"
        center={center}
        level={3}
        onCenterChanged={updateCenterWhenMapMoved}
        onCreate={setMap}
      >
        {markers.map((marker) => (
          <MapMarker
            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
            position={marker.position}
            onClick={() => setInfo(marker)}
            image={{
              src: require("../assets/map-marker.svg").default,
              size: { width: 30, height: 30 },
            }}
          >
            {info && info.content === marker.content && (
              <div style={{ color: "#000" }}>{marker.content}</div>
            )}
          </MapMarker>
        ))}
        <MapMarker
          image={{
            src: require("../assets/map-pin.svg").default,
            size: { width: 30, height: 30 },
          }}
          position={position}
        />
        <Circle
          center={position}
          radius={2000}
          strokeWeight={0}
          strokeOpacity={0}
          fillColor={"#b2e39d"}
          fillOpacity={0.5}
        />
      </Map>

      {/* 현위치 이동 버튼 */}
      <div className="flex flex-col gap-[10px] absolute z-[1] top-0 right-0 p-[10px]">
        <button
          className="flex justify-center items-center cursor-pointer rounded-full w-[45px] h-[45px] bg-white shadow-[0_0_8px_#00000025]"
          onClick={setCenterToMyPosition}
        >
          <IconMyLocation width="25px" />
        </button>
      </div>
    </div>
  );
}
