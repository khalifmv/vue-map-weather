<script setup>
import "leaflet/dist/leaflet.css";
import { ref, onMounted, nextTick, watch } from "vue";
import {L, latLng} from 'leaflet'
import { LMap, LTileLayer, LMarker, LCircle } from "@vue-leaflet/vue-leaflet";
import { getUserLocation } from "../helper/GetUserLocation";
import { useUserInfoStore } from '../stores/User';

const userInfo = useUserInfoStore()

const zoom = ref(5);
const center = ref([-7.2575, 112.7521]);
const mapRef = ref(null);
const markerLatLng = ref([0,0])
const circle = ref({
    center: latLng(0,0),
    radius: 40
})
let activeMarker = null;

async function fetchWeather({ lat, long }) {
    const url = `https://openapi.de4a.space/api/weather/forecast?lat=${lat}&long=${long}`;
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error("Failed to fetch weather");
    }
    return res.json();
}

onMounted(async () => {
    const userLocation = await getUserLocation();
    if (userLocation) {
        const arrLatLong = [userLocation.latitude, userLocation.longitude];
        center.value = arrLatLong;
        userInfo.updateCoor(arrLatLong);
        await nextTick();
        zoom.value = 12;
        circle.value = {
            center: latLng(arrLatLong[0], arrLatLong[1]),
            radius: 2000,
        };
        const checkMap = setInterval(() => {
            if (mapRef.value?.leafletObject) {
                const map = mapRef.value.leafletObject;
                console.log("Leaflet map instance:", map);

                map.doubleClickZoom.disable();
                map.on("dblclick", async (e) => {
                    console.log("User double clicked at:", e.latlng);
                    markerLatLng.value = [e.latlng.lat, e.latlng.lng];
                    try {
                        userInfo.setLoadingOfGetLocation(true)
                        const weather = await fetchWeather({
                            lat: e.latlng.lat,
                            long: e.latlng.lng,
                        });
                        console.log("Weather data:", weather);
                        userInfo.setLoadingOfGetLocation(false)
                        userInfo.addLocationHistory(weather.data[0]);
                    } catch (error) {
                        userInfo.setLoadingOfGetLocation(false)
                        console.error("Error fetching weather:", error);
                    }
                });

                map.flyTo(center.value, zoom.value);
                clearInterval(checkMap);
            }
        }, 100);
    }
});

watch(mapRef, () => {
});
</script>

<template>
    <div style="height:100vh; width:100vw">
        <l-map ref="mapRef" v-model:zoom="zoom" :center="center">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
                name="OpenStreetMap">
            </l-tile-layer>
            <l-marker :lat-lng="markerLatLng" ></l-marker>
            <l-circle
                :lat-lng="circle.center"
                :radius="circle.radius"
            />
        </l-map>
    </div>
</template>