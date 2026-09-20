<script setup>
import "leaflet/dist/leaflet.css";
import { ref, onMounted, onUnmounted, watch } from "vue";
import { latLng } from 'leaflet'
import { LMap, LTileLayer, LMarker, LCircle } from "@vue-leaflet/vue-leaflet";
import { useUserInfoStore } from '../stores/User';
import { useLocation } from '../composables/useLocation';
import { fetchWeather } from "../api/weather";

const userInfo = useUserInfoStore()
const { initLocation } = useLocation()

const DEFAULT_CENTER = [-7.2575, 112.7521];
const DEFAULT_ZOOM = 5;

// A city level estimate deserves a wider circle than a real fix.
const PRECISE_VIEW = { zoom: 12, radius: 2000 };
const ESTIMATED_VIEW = { zoom: 10, radius: 15000 };

const zoom = ref(DEFAULT_ZOOM);
const center = ref(DEFAULT_CENTER);
const mapRef = ref(null);
const mapInstance = ref(null);
const markerLatLng = ref(null);
const circle = ref(null);

let checkMap = null;

function setupMap() {
    checkMap = setInterval(() => {
        if (!mapRef.value?.leafletObject) return;
        clearInterval(checkMap);
        checkMap = null;

        const map = mapRef.value.leafletObject;
        mapInstance.value = map;

        map.doubleClickZoom.disable();
        map.on("dblclick", async (e) => {
            markerLatLng.value = [e.latlng.lat, e.latlng.lng];
            try {
                userInfo.setLoadingOfGetLocation(true)
                const weather = await fetchWeather({
                    lat: e.latlng.lat,
                    long: e.latlng.lng,
                });
                userInfo.setLoadingOfGetLocation(false)
                userInfo.addLocationHistory(weather.data[0]);
            } catch (error) {
                userInfo.setLoadingOfGetLocation(false)
                console.error("Error fetching weather:", error);
            }
        });

        map.flyTo(center.value, zoom.value);
    }, 100);
}

// Fires for the IP estimate first and again if a precise fix lands later.
watch(() => userInfo.coor, (coor) => {
    if (typeof coor[0] !== "number" || typeof coor[1] !== "number") return;

    const view = userInfo.locationSource === "gps" ? PRECISE_VIEW : ESTIMATED_VIEW;
    center.value = [coor[0], coor[1]];
    zoom.value = view.zoom;
    circle.value = {
        center: latLng(coor[0], coor[1]),
        radius: view.radius,
    };
    mapInstance.value?.flyTo(center.value, zoom.value);
}, { deep: true });

onMounted(() => {
    // The map is set up regardless of whether we ever learn where the user is,
    // double click to pick a point always works.
    setupMap();
    initLocation();
});

onUnmounted(() => {
    if (checkMap) clearInterval(checkMap);
});
</script>

<template>
    <div style="height:100vh; width:100vw">
        <l-map ref="mapRef" v-model:zoom="zoom" :center="center">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
                name="OpenStreetMap"
                attribution="&copy; Kontributor OpenStreetMap">
            </l-tile-layer>
            <l-marker v-if="markerLatLng" :lat-lng="markerLatLng"></l-marker>
            <l-circle
                v-if="circle"
                :lat-lng="circle.center"
                :radius="circle.radius"
            />
        </l-map>
    </div>
</template>
