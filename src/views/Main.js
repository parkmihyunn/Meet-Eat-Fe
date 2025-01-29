import React from "react";
import { useEffect, useState, useMemo } from "react";
import { Map as KakaoMap, MapMarker, Circle } from "react-kakao-maps-sdk";
import { ReactComponent as IconMyLocation } from "../assets/acc-icon.svg";
import { debounce } from "lodash";

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

  return (
    <div className="relative w-full h-full">
      <KakaoMap // 지도를 표시할 Container
        className="w-full h-full"
        id="map"
        center={center}
        level={3} // 지도의 확대 레벨
        onCenterChanged={updateCenterWhenMapMoved}
      >
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
          strokeWeight={0} // 선의 두께입니다
          strokeOpacity={0}
          fillColor={"#b2e39d"} // 채우기 색깔입니다
          fillOpacity={0.5} // 채우기 불투명도 입니다
        />
      </KakaoMap>
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
