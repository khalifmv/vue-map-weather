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
    <div class="p-2 bg-blue-100 rounded-lg min-w-[150px] min-h-[100px] flex flex-col gap-1">
        
        <div class="flex justify-evenly items-center my-4 gap-2">
            <img :src="props.weather.image" class="w-12 h-12" />
            <div class="flex flex-col items-start">
                <p class="text-xs">{{ formatDate(props.weather.local_datetime) }}</p>
                <p class="font-bold text-xl">{{ props.weather.t }} ℃</p>
                <div class="flex flex-col items-start mb-4 gap-0">
                    <p class="">{{ props.weather.weather_desc }}</p>
                    <p class="font-light text-xs">{{ props.weather.weather_desc_en }}</p>
                </div>
                
            </div>
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