// Eun Young Park
// May 21, 2024

const URL = 'https://picsum.photos/seed/picsum/200/300'
const KEY = 'IMG-CACHE-9022'
let responseURL

const getImageAndSave = document.getElementById('getImage')
const readCache = document.getElementById('readCache')


async function fetchAndCacheImage(url) {
    fetch(url)
    .then((response) => {
        console.log(response)
        if(!response) throw new Error(response.state)
        return response.blob()
    })
    .then(async (blob) => {
        console.log(blob)

        const cache = await caches.open(KEY)
        try {
            console.log(cache)
            const expiredDate = new Date()
            expiredDate.setDate(expiredDate.getDate() + 7)
            console.log(expiredDate)
            
            const headers = new Headers()
            headers.append('Content-Type', blob.type)
            headers.append('Expiration-Time', expiredDate.toString())
            const response = new Response(blob, { headers })
            await cache.put(responseURL, response)
        }
        catch (error) {
        console.log(error)
        }
    })
    .catch((err) => {
        console.warn(err)
    })
}

async function getImage(url) {
    const cache = await caches.open(KEY)

    fetch(url)
    .then(async (response) => {
        console.log(response)
        if(!response) throw new Error(response.state)
        responseURL = response.url
        return response.blob()
    })
    .then(async (blob) => {
        console.log(blob)
        const resCache = await cache.match(responseURL)

        if (resCache) {
            console.log(resCache);
            console.log("Already existed in cache")
        } else {
            fetchAndCacheImage(responseURL)
            console.log("Saved to cache")
        }
        return blob
    })
    .catch((err) => {
        console.warn(err)
    })
}

async function displayCachedImages() {
    const cache = await caches.open(KEY)
    const keys = await cache.keys()
    .then((response) => {
        console.log(response)
        if(!response) throw new Error("fail to get image from cache")
        return response
    })
    .then((request) => {
        console.log(request)
        if(request.length === 0) return

        request.forEach(({url}) => {
            const result = document.getElementById('results')
            result.innerHTML = ""

            let card = document.createElement('img')
            card.src = url
            result.append(card)
        })
    })
    .catch((err) => console.log(err))
}

getImageAndSave.addEventListener('click', getImage(URL))
readCache.addEventListener('click', displayCachedImages)

