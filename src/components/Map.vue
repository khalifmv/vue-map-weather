<template>
    <div style="height:100vh; width:100vw">
        <l-map ref="mapRef" v-model:zoom="zoom" :center="center">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
                name="OpenStreetMap">
            </l-tile-layer>
        </l-map>
    </div>
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import { ref, onMounted, nextTick, watch } from "vue";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
import { getUserLocation } from "../helper/GetUserLocation";

const zoom = ref(5);
const center = ref([-7.2575, 112.7521]);
const mapRef = ref(null);

onMounted(async () => {
    const userLocation = await getUserLocation();
    if (userLocation) {
        center.value = [userLocation.latitude, userLocation.longitude];

        await nextTick();
        zoom.value = 12;
        const checkMap = setInterval(() => {
            if (mapRef.value?.leafletObject) {
                const map = mapRef.value.leafletObject;
                console.log("Leaflet map instance:", map);

                map.doubleClickZoom.disable();

                // Add custom double-click event
                map.on("dblclick", (e) => {
                    console.log("User double clicked at:", e.latlng);
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