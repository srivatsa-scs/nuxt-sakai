<template>
    <template v-if="loading">
        <div class="card" v-for="recipe in 10">
            <div class="rounded border border-surface-200 dark:border-surface-700 p-6 bg-surface-0 dark:bg-surface-900">
                <div class="flex mb-4">
                    <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                    <div>
                        <Skeleton width="10rem" class="mb-2"></Skeleton>
                        <Skeleton width="5rem" class="mb-2"></Skeleton>
                        <Skeleton height=".5rem"></Skeleton>
                    </div>
                </div>
                <Skeleton width="100%" height="150px"></Skeleton>
                <div class="flex justify-between mt-4">
                    <Skeleton width="4rem" height="2rem"></Skeleton>
                    <Skeleton width="4rem" height="2rem"></Skeleton>
                </div>
            </div>
        </div>
    </template>
    <div class="feed-container" v-else>
        <div class="feed-posts">
            <Card v-for="recipe in recipes" :key="recipe.id" class="my-4">
                <template #header>
                    <div class="flex align-items-center m-2">
                        <Avatar :image="recipe.image" size="large" shape="circle" class="m-1" />
                        <div class="ml-3">
                            <h3 class="m-0">{{ recipe.name }}</h3>
                            <div class="flex justify-content-between gap-3">
                                <Button icon="pi pi-tag" v-for="tag in recipe.tags" variant="text"
                                    :label="tag"></Button>
                            </div>
                        </div>
                    </div>
                </template>

                <template #content>
                    <p>{{ recipe.body }}</p>
                    <NuxtImg v-if="recipe.image" :src="recipe.image" :alt="recipe.name" class="w-full" />
                </template>

                <template #footer>
                    <div class="flex justify-content-between gap-3">
                        <Button icon="pi pi-clock" variant="text" :label="recipe.cookTimeMinutes"></Button>
                        <Button icon="pi pi-users" variant="text" :label="recipe.servings"></Button>
                        <Button icon="pi pi-star" severity="warn" variant="text" :label="recipe.rating"></Button>
                    </div>
                </template>
            </Card>

            <div ref="loadMoreTrigger" class="load-more-trigger">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent"
                    animationDuration=".5s" aria-label="Custom ProgressSpinner" v-if="loading" />
            </div>

            <div v-if="noMoreRecipes" class="text-center p-4 text-gray-500">
                You've reached the end!
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { Avatar, Button, Card, ProgressSpinner } from 'primevue';

const props = defineProps({
    pageSize: {
        type: Number,
        default: 10
    }
})

// State
const recipes = ref([])
const loading = ref(false)
const page = ref(1)
const noMoreRecipes = ref(false)
const feedContainer = ref(null)
const loadMoreTrigger = ref(null)
// Composables

// Methods
const fetchPosts = async () => {
    if (loading.value || noMoreRecipes.value) return

    loading.value = true
    try {
        const { data, error, status, refresh } = await useFetch(`https://dummyjson.com/recipes?skip=${page.value}&limit=${props.pageSize}&delay=1000`, { lazy: true })

        const newRecipes = data.value.recipes;
        if (newRecipes.length < props.pageSize) {
            noMoreRecipes.value = true
        }

        recipes.value = [...recipes.value, ...newRecipes]
        page.value++
    } catch (error) {
        console.error('Error fetching posts:', error)
    } finally {
        loading.value = false
    }
}

const toggleLike = async (post) => {
    // Implement logic
}

const openComments = (post) => {
    // Implement comments dialog/modal logic
}


// Intersection Observer for infinite scroll
const { stop } = useIntersectionObserver(
    loadMoreTrigger,
    ([{ isIntersecting }]) => {
        if (isIntersecting && !loading.value && !noMoreRecipes.value) {
            fetchPosts()
        }
    },
    {
        threshold: 0.1,
        rootMargin: '100px'
    }
)

// Lifecycle
onMounted(() => {
    fetchPosts()
})

onUnmounted(() => {
    stop()
})
</script>

<style scoped>
.feed-container {
    max-width: 680px;
    margin: 0 auto;
    padding: 1rem;
}

.load-more-trigger {
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
}
</style>