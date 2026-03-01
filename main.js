let timer
let deleteFirstPhotoDelay

async function start() {
    try {
        const response  = await fetch("https://dog.ceo/api/breeds/list/all")
        const data = await response.json()
        createBreedList(data.message)
    } catch (e) {
        console.log("There was a problem fetching the breed list.")
    }
}

start()

function createBreedList(breedList) {
    const selectHTML = `
    <select id="breedSelect">
    <option>Choose a Dog Breed</option>
    ${Object.keys(breedList).map(function (breed) {
        return `<option>${breed}</option>`
    }).join('')}
    </select>
    `
    document.getElementById("breed").innerHTML = selectHTML
    document.getElementById("breedSelect").addEventListener("change", function () {
        console.log("Breed selected: ", this.value)
        loadByBreed(this.value)
    })
}

async function loadByBreed(breed) {
    if (breed !== "Choose a Dog Breed") {
        try {
            console.log("Fetching images for:", breed)

            const response = await fetch(`https://dog.ceo/api/breed/${breed}/images`)
            const data = await response.json()

            console.log("Full API response:", data)

            if (data.status !== "success" || !Array.isArray(data.message)) {
                document.getElementById("slideshow").innerHTML =
                    "<p style='color:white;text-align:center;margin-top:20px;'>No images available for this breed.</p>"
                return
            }

            createSlideshow(data.message)

        } catch (error) {
            console.log("Error fetching images:", error)
        }
    }
}

function createSlideshow(images) {
    let currentPosition = 0
    clearInterval(timer)
    clearTimeout(deleteFirstPhotoDelay)

    if(!images || images.length == 0) {
        document.getElementById("slideshow").innerHTML = "<p> No images found for this breed. </p>"
        return
    }

    const slideshow = document.getElementById("slideshow")

    if (images.length > 1) {
        slideshow.innerHTML = `
            <div class="slide" style="background-image: url('${images[0]}')"></div>
            <div class="slide" style="background-image: url('${images[1]}')"></div>
        `
        currentPosition = 2
        if (images.length == 2) currentPosition=0
        timer=setInterval(nextSlide, 3000)
    } else {
        slideshow.innerHTML = `
            <div class="slide" style="background-image: url('${images[0]}')"></div>
        `
    }

    function nextSlide() {
        slideshow.insertAdjacentHTML(
            "beforeend",
            `<div class="slide" style="background-image: url('${images[currentPosition]}')"></div>`
        )
        deleteFirstPhotoDelay = setTimeout(function () {
            const firstSlide = document.querySelector(".slide")
            if (firstSlide) {
                firstSlide.remove()
            }
        }, 1000)
        if (currentPosition + 1 >= images.length) {
            currentPosition = 0
        } else {
            currentPosition++
        }
    }
}