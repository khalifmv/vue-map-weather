<script setup>
import { ref, provide } from "vue";

const props = defineProps({
    defaultValue: { type: String, required: false }
});

const activeTab = ref(props.defaultValue || null);
const tabs = ref([]);

function registerTab(tab) {
    if (!tabs.value.find((t) => t.value === tab.value)) {
        tabs.value.push(tab);
        if (!activeTab.value) activeTab.value = tab.value;
    }
}

provide("tabsContext", {
    activeTab,
    registerTab
});
</script>

<template>
    <div class="w-full">

        <div class="p-4 mt-4 rounded-md bg-white shadow">
            <slot />
        </div>
        <div class="relative right-0">
            <ul class="relative flex flex-wrap px-1.5 py-1.5 list-none rounded-md bg-slate-100" role="list">
                <li v-for="tab in tabs" :key="tab.value" class="z-30 flex-auto text-center min-h-[40px]">
                    <button
                        class="z-30 flex items-center justify-center w-full px-0 py-2 text-sm mb-0 transition-all ease-in-out rounded-md cursor-pointer"
                        :class="activeTab === tab.value
                            ? 'bg-white text-slate-900 shadow'
                            : 'text-slate-600 hover:bg-slate-200'" @click="activeTab = tab.value">
                        {{ tab.title }}
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>