import React from "react";
import { useEffect, useState, useMemo } from "react";
import { Map, MapMarker, Circle } from "react-kakao-maps-sdk";
import { ReactComponent as IconMyLocation } from "../../assets/acc-icon.svg";
import { debounce } from "lodash";
import SearchBar from "./SearchBar";
import axios from "axios";

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

  // 2000m이내 키워드 검색
  const { kakao } = window;
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    axios
      .get(`https://dapi.kakao.com/v2/local/search/keyword?`, {
        params: {
          x: position.lng,
          y: position.lat,
          radius: 200,
          category_group_code: "FD6",
          query: "총각네 부추곱창",
        },
        headers: {
          Authorization: `KakaoAK ${process.env.REACT_APP_RESTAPI_KEY}`,
        },
      })
      .then((res) => {
        let markers = [];
        for (let i = 0; i < res.data.documents.length; i++) {
          markers.push({
            position: {
              lat: res.data.documents[i].y,
              lng: res.data.documents[i].x,
            },
            place_name: res.data.documents[i].place_name,
            category_name: res.data.documents[i].category_name,
            id: res.data.documents[i].id,
            phone: res.data.documents[i].phone,
            place_url: res.data.documents[i].place_url,
            road_address_name: res.data.documents[i].road_address_name,
          });
        }
        setMarkers(markers);
      });
  }, [position]);

  return (
    <div className="relative">
      <div className="relative w-full h-full">
        <Map
          className="w-full h-full"
          id="map"
          center={center}
          level={5}
          onCenterChanged={updateCenterWhenMapMoved}
        >
          {markers.map((marker) => (
            <MapMarker
              key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
              position={marker.position}
              onClick={() => setInfo(marker)}
              image={{
                src: require("../../assets/map-marker.svg").default,
                size: { width: 30, height: 30 },
              }}
            >
              {info && info.place_name === marker.place_name && (
                <div>{marker.place_name}</div>
              )}
            </MapMarker>
          ))}
          <MapMarker
            image={{
              src: require("../../assets/map-pin.svg").default,
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

        {/* 현위치로 지도도 이동 버튼 */}
        <div className="flex flex-col gap-[10px] absolute z-[1] top-0 right-0 p-[10px]">
          <button
            className="flex justify-center items-center cursor-pointer rounded-full w-[45px] h-[45px] bg-white shadow-[0_0_8px_#00000025]"
            onClick={setCenterToMyPosition}
          >
            <IconMyLocation width="25px" />
          </button>
        </div>
        <SearchBar />
      </div>
    </div>
  );
}
