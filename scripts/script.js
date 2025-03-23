// console.log('video.js loaded');

/**
 * step 1 : Fetch, load and show categories on html
 */

// create categories
const loadCategories = () => {

    // fetch categories
    fetch('https://openapi.programming-hero.com/api/peddy/categories')
        .then(res => res.json())
        .then(data => displayCategories(data.categories))
        .catch((error) => console.log(error))
}
// display categories
const displayCategories = (categories) => {

    const categoryContainer = document.getElementById('categories');

    categories.forEach((item) => {
        // console.log(item)


        // create a div like button

        const div = document.createElement('div');
        div.innerHTML = `
            <button 
            id="${item.category}"

            onclick="loadCategoryCards('${item.category}')"  
            class="btn btn-outline lg:px-25 md:px-13 md:py-7 px-4 py-3  lg:py-10 border-2 border-[#0E7A81]  lg:rounded-xl rounded-md cursor-pointer md:text-base lg:text-2xl font-extrabold text-black  category-btn">

                <img class="lg:w-9 md:w-7 w-5" src="${item.category_icon}" alt="${item.category_icon}"/> ${item.category}     
            
            </button>
        `;

        // add button to category container
        categoryContainer.append(div);

    })
}


// load pet cards
const loadCards = () => {
    // fetch cards
    fetch("https://openapi.programming-hero.com/api/peddy/pets")
        .then(res => res.json())
        .then(data => displayCards(data.pets))
        .catch((error) => console.log(error))
}


// load cards based on category
const loadCategoryCards = (category) => {

    // showing the spinner
    document.getElementById('spinner').classList.remove('hidden');
    document.getElementById('shop').classList.add('hidden');

    fetch(`https://openapi.programming-hero.com/api/peddy/category/${category}`)
        .then(res => res.json())
        .then(data => {

            // hide the spinner after 3 seconds
            setTimeout(() => {
                document.getElementById('spinner').classList.add('hidden');
                document.getElementById('shop').classList.remove('hidden')
            }, 1500)

            // remove active class from all buttons
            removeActiveClass();

            // add active class to the clicked button
            const activeBtn = document.getElementById(category);
            activeBtn.classList.add('active');

            // sort category pets
            currentCategoryPets = data.data;
            displayCards(data.data);
        })
        .catch((error) => {
            console.log(error);
            // Hide the spinner in case of error
            document.getElementById('spinner').classList.add('hidden');
            document.getElementById('shop').classList.remove('hidden');
        });
}


//display the pet cards
const displayCards = (pets) => {

    const petsContainer = document.getElementById('pet-cards');
    petsContainer.innerHTML = '';

    if (pets.length === 0) {
        petsContainer.classList.remove('grid');
        petsContainer.classList.add('bg-gray-50');
        petsContainer.classList.add('rounded-lg');
        petsContainer.innerHTML = `
        <div class="min-h-screen flex flex-col gap-5 items-center justify-center">
            <img src="./assets/error.webp" alt="No Data" class="" />
            <h1 class="text-3xl font-bold text-black">No Information Available</h1>
            <p class="text-xl text-[#5a5a5a]">Sorry, no information available for this category.</p>

        </div>
        `
        return;
        ;
    }
    else {
        petsContainer.classList.add('grid');
        petsContainer.classList.remove('bg-gray-50');
    }

    pets.forEach((pet) => {

        // console.log(pet);
        const card = document.createElement('div');

        card.innerHTML = `
        <div class="card border rounded-xl  border-gray-300">
            <div class="p-4 space-y-3">
                <figure class="h-52 lg:h-40 md:h-40  ">
                    <img
                    src=${pet.image}
                    alt="Pet Image"
                    class="rounded-lg w-full h-full object-cover" />
                </figure>
                <div class="space-y-2">
                    <h2 class="text-xl font-extrabold ">${pet.pet_name}</h2>
                    <div>
                        <div class="flex items-center space-x-2">
                            <img src="./assets/breed.png">
                            <h5 
                                class="lg:text-lg md:text-sm text-[#5a5a5a]">
                                <b>Breed</b> : ${pet.breed ? pet.breed : "Not Available"}
                            </h5>
                        </div>
                        <div class="flex items-center space-x-2">
                            <img src="./assets/date.png">
                            <h5 
                                class="lg:text-lg md:text-sm text-[#5a5a5a]">
                                <b>Birth</b> : ${pet.date_of_birth ? pet.date_of_birth : "Not Available"}
                            </h5>
                        </div>

                        <div class="flex items-center space-x-2">
                            <img src="./assets/gender.png">
                            <h5 
                                class="lg:text-lg md:text-sm text-[#5a5a5a]">
                                <b>Gender</b> : ${pet.gender ? pet.gender : "Not Available"}
                            </h5>
                        </div>
                        <div class="flex items-center space-x-2">
                            <img src="./assets/price.png">
                            <h5 
                                class="lg:text-lg md:text-sm text-[#5a5a5a]">
                                <b>Price</b> : ${pet.price ? pet.price : "Not Available"}
                            </h5>
                        </div>
                    </div>
                    

                    <div class="flex justify-between items-center border-t border-gray-300 pt-4">

                        <button
                            onclick="choiceList(${pet.petId})" 
                            class="btn text-base lg:text-sm lg:px-5 md:text-xs md:px-3 btn-deepGreen">
                            <i class="fa-solid fa-thumbs-up" style="color: #0E7A81;"></i>
                            Like
                        </button>                    
                        <button 
                            onclick="handleAdoptClick()" 
                            class="btn text-base lg:text-sm lg:px-5 md:text-xs md:px-3 btn-outline btn-deepGreen">
                            Adopt
                        </button>
                        <button 
                            onclick="loadPetDetails(${pet.petId})" 
                            class="btn text-base lg:text-sm lg:px-5 md:text-xs md:px-3 btn-outline btn-deepGreen">
                            Details
                        </button>

                    </div>
                </div>
            </div>
        </div>
        `;
        petsContainer.append(card);
    })
}



// load pet details
const loadPetDetails = async (petId) => {
    // console.log(petId);
    const url = `https://openapi.programming-hero.com/api/peddy/pet/${petId}`
    const res = await fetch(url);
    const data = await res.json();
    // console.log(data);
    displayDetails(data.petData);
}


// display Details
const displayDetails = (petData) => {
    console.log(petData);

    const detailsContainer = document.getElementById('modal-content');
    detailsContainer.innerHTML = `
        <div class="space-y-2">
            <div class="h-60 w-full">
                <img src="${petData.image}" alt="Pet Image" class="w-full h-full object-cover rounded-lg">
            </div>
            <div class="space-y-4">
                <h2 class="text-2xl font-extrabold">${petData.pet_name}</h2>
                    <div class="grid grid-cols-2 gap-2">
                            <div class="flex items-center space-x-2">
                                <img src="./assets/breed.png">
                                <h5 class="text-base text-[#5a5a5a]"><b>Breed</b> : ${petData.breed ? petData.breed : "Not Available"}</h5>
                            </div>
                            <div class="flex items-center space-x-2">
                                <img src="./assets/date.png">
                                <h5 class="text-base text-[#5a5a5a]"><b>Birth</b> : ${petData.date_of_birth ? petData.date_of_birth : "Not Available"}</h5>
                            </div>

                            <div class="flex items-center space-x-2">
                                <img src="./assets/gender.png">
                                <h5 class="text-base text-[#5a5a5a]"><b>Gender</b> : ${petData.gender ? petData.gender : "Not Available"}</h5>
                            </div>
                            <div class="flex items-center space-x-2">
                                <img src="./assets/price.png">
                                <h5 class="text-base text-[#5a5a5a]"><b>Price</b> : ${petData.price ? petData.price : "Not Available"}</h5>
                            </div>
                            <div class="flex items-center space-x-2 col-span-2">
                                <img src="./assets/price.png">
                                <h5 class="text-base text-[#5a5a5a]"><b>Vaccinated Status</b> : ${petData.vaccinated_status}</h5>
                            </div>
                    </div>
                    <div class="divider"></div>
                    <div class="">
                        <h4 class="text-base font-semibold text-black">Details Information :</h4>
                        <p class="text-base text-[#5a5a5a]">${petData.pet_details}
                        </p>
                    </div>
            </div>
        </div>
    `
    document.getElementById('petModal').showModal();
}



// remove active class from all buttons
const removeActiveClass = () => {
    const buttons = document.getElementsByClassName('category-btn');
    for (let btn of buttons) {
        btn.classList.remove('active');
    }
}



// choice list
const choiceList = async (petId) => {
    // console.log(petId);
    const url = `https://openapi.programming-hero.com/api/peddy/pet/${petId}`
    const res = await fetch(url);
    const data = await res.json();
    // console.log(data);
    displayLikedImage(data.petData);

}

// display liked image
const displayLikedImage = (petData) => {
    console.log(petData)
    const imageContainer = document.getElementById('choice-list');


    const image = document.createElement('div');
    image.classList = "h-40 rounded-lg place-self-start";
    image.innerHTML = `
        <img src="${petData.image}" alt="Pet Image" class="w-full h-full object-cover rounded-lg">
    `;

    imageContainer.append(image);

}

// sort category pets
let currentCategoryPets = [];
const sortCategoryPets = () => {
    currentCategoryPets.sort((a, b) => b.price - a.price);
    displayCards(currentCategoryPets);
}

// Function to handle adopt button click
const handleAdoptClick = () => {
    const adoptModal = document.getElementById('adoptModal');
    adoptModal.showModal();

    let countdown = 3;
    const countdownElement = document.getElementById('countdown');
    countdownElement.innerText = countdown;

    const interval = setInterval(() => {
        countdown -= 1;
        countdownElement.innerText = countdown;

        if (countdown === 0) {
            clearInterval(interval);
            adoptModal.close();
        }
    }, 1000);
}

loadCategories();
loadCards();