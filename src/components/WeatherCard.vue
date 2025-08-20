<script setup lang="ts">
const props = defineProps({
    weather: {
        type: Object,
        required: true
    }
});

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
</script>

<template>
    <div class="p-2 bg-blue-100 rounded-lg min-w-[120px] min-h-[100px] flex flex-col gap-1">
        <p class="text-xs">{{ formatDate(props.weather.local_datetime) }}</p>
        <div class="flex flex-col justify-center items-center my-4">
            <img :src="props.weather.image" class="w-10 h-10" />
            <div class="flex flex-col items-center mb-4">
                <p class="font-bold">{{ props.weather.weather_desc }}</p>
                <p class="font-light text-xs">{{ props.weather.weather_desc_en }}</p>
            </div>
            <p class="font-bold text-xl">{{ props.weather.t }} ℃</p>
        </div>
        <div class="flex flex-col gap-0">
            <div class="text-[10px] flex gap-1">
                <img src="/wind.svg" class="h-3 w-3" />
                <p class="font-bold">{{ props.weather.ws }} km/j</p>
            </div>

            <div class="text-[10px] flex gap-1">
                <img src="/humidity.svg" class="h-3 w-3" />
                <p class="font-bold">{{ props.weather.hu }}</p>
            </div>
            <!-- <p class="text-[10px]">Kelembapan: {{ props.weather.hu }}</p> -->
        </div>

    </div>
</template>