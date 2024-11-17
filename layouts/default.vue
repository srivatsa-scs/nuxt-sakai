<template>
    <div class="layout-wrapper" :class="containerClass">
        <NuxtLoadingIndicator height="5"></NuxtLoadingIndicator>
        <AppTopbar></AppTopbar>
        <AppSidebar></AppSidebar>
        <div class="layout-main-container">
            <div class="layout-main">
                <p>Shared Heading</p>
                <slot/>
            </div>
            <AppFooter></AppFooter>
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div>
    <Toast />
</template>

<script setup>
import { useLayout } from '~/composables/layout';
import { computed, ref, watch } from 'vue';
import AppTopbar from './AppTopbar.vue';
import AppSidebar from './AppSidebar.vue';
import AppFooter from './AppFooter.vue';
import { Toast } from 'primevue';

const { layoutConfig, layoutState, isSidebarActive, isDarkTheme, resetMenu } = useLayout();

const outsideClickListener = ref(null);

watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

const containerClass = computed(() => {
    return {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive
    };
});

function bindOutsideClickListener() {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                resetMenu();
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
}

function unbindOutsideClickListener() {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
}

function isOutsideClicked(event) {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
}
</script>