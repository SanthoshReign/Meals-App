document.addEventListener('load', () => {
    updation();
}); 



let searchbar = document.getElementById('search-bar');
let dataBasefavList = "favouritesList";



if(localStorage.getItem(dataBasefavList) == null){
    localStorage.setItem(dataBasefavList, JSON.stringify([]));
}

function updation(){
    const favCount = document.getElementById('favCount');
    const dataBase = JSON.parse(localStorage.getItem(dataBasefavList));
    if(favCount.innerHTML != null){
        favCount.innerHTML = dataBase.length;
    }
}


                   /*fetching meals from API */
async function fetchMealsFromApi(url, value) {
    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}


                    /* show Meals based on search result */


function mealsList(){
    let favList = JSON.parse(localStorage.getItem(dataBasefavList));


    let searchInput = document.getElementById('search-input').value;
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let meals = fetchMealsFromApi(url, searchInput);
    let html ='';
    

    meals.then(data => {
        if(data.meals){
            data.meals.forEach(element => {
                let isFav = false;
                for(let i = 0; i < favList.length; i++){
                    if(favList[i] == element.idMeal){
                        isFav = true;
                    }
                }
                if(isFav == true){
                    html += `
                            
                            <div class="special-food" >
                                <img src="${element.strMealThumb}">
                                
                                <h3>${element.strMeal}</h3>
                                    
                                <div class="details">
                                    <div class="more-details">
                                        <a href="#details"><button type="submit" onclick= "showMealDetails(${element.idMeal})"> Details </button></a>
                                    </div>
                                    <div class="favorite">
                                        <i class="fa-solid fa-heart" style="color:red;" id="resultMeals${element.idMeal}" onclick="addRemoveFavList(${element.idMeal})"></i>
                                    </div>
                                </div>    
                            </div>        
                    `;
                }else{
                    html += `
                            
                            <div class="special-food" >
                                <img src="${element.strMealThumb}">
                                
                                <h3>${element.strMeal}</h3>
                                    
                                <div class="details">
                                    <div class="more-details">
                                        <a href="#details"><button type="submit" onclick= "showMealDetails(${element.idMeal})"> Details </button></a>
                                    </div>
                                    <div class="favorite">
                                        <i class="fa-solid fa-heart id="resultMeals${element.idMeal}" onclick="addRemoveFavList(${element.idMeal})"></i>
                                    </div>
                                </div>    
                            </div>        
                    `;
                }
                    
            });
 
        } else{
            html += `
                <div class="no-dish"> Sorry, Meals you are searching for is not present</div>
            `;
        }   
        document.getElementById('resultMeals').innerHTML = html;
    });
}
    
        // add or remove favorite meals from favorite list

function addRemoveFavList(foodID){
    
    
    let dataBase = JSON.parse(localStorage.getItem("favouritesList"));
    let isMealsExist = false;

    
            //traversing over items in database 
    for (let i = 0; i < dataBase.length; i++) {
        if (foodID == dataBase[i]) {
            isMealsExist = true;
        }
    } 

           //adding or removing item in favorite list
    if (isMealsExist) {
        dataBase.splice(dataBase.indexOf(foodID), 1);
        alert("Item removed from favorite list");
        
            window.location.reload();
        
        

    } else {
        dataBase.push(foodID);
        alert("Item added in favorite list");
    }
    
                //save data in local storage
    localStorage.setItem("favouritesList", JSON.stringify(dataBase));
    mealsList();
    showFavMealList();
    updation();

}



                //show favorite meals in favorite html page
async function showFavMealList() {
    // console.log('showFavMealList');
    let favList = JSON.parse(localStorage.getItem(dataBasefavList));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    if (favList.length == 0) {
        html += `<div class="no-items"> 
                    <h1> Nothing To Show.....No items in favorite list</h1> 
                </div>`;
                        
    } else {
        for (let i = 0; i < favList.length; i++) {
            await fetchMealsFromApi(url, favList[i]).then(data => {
                console.log(favList[i]);
                html += `
                    <div class="foodTab">
                        <img src="${data.meals[0].strMealThumb}">
                        <div class="food-name">
                            <h3>${data.meals[0].strMeal}</h3>
                        </div>
                        <div class="details">
                            <a href="#dd"><button type="submit" onclick="showMealDetails(${data.meals[0].idMeal})">Details</button></a>
                            <i class="fa-solid fa-heart" style="color:red;" id="resultMeals${data.meals[0].idMeal}" onclick="addRemoveFavList(${data.meals[0].idMeal})"></i>
                        </div>
                    </div>
                `;
            });
        }
    }

   document.getElementById('fav').innerHTML = html;
}
updation();
showFavMealList();



//  shows meals details in details.html page

async function showMealDetails(id) {
   
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html="";
   
    const mealdetails = await fetchMealsFromApi(url, id);

    console.log(mealdetails);
    if(mealdetails.meals){
        html += `
                <header class="food-heading">${mealdetails.meals[0].strMeal}</header>
                <div class="food-container">
                    <div class="food-image">
                        <img src="${mealdetails.meals[0].strMealThumb}">
                    </div>                  
                    <div class="food-details">
                        <h3>${mealdetails.meals[0].strMeal}</h3>
                        <p>Category : ${mealdetails.meals[0].strCategory}</p>
                        <p>Area : ${mealdetails.meals[0].strArea}</p>
                    </div>
                </div>    
                <div class="instruction">    
                    
                    <h5>Instruction :</h5>
                    <p>&emsp;&emsp; ${mealdetails.meals[0].strInstructions}</p>
                    
                </div>    
                
            `; 
    }
            
        
        
        document.querySelector("#details, #dd").innerHTML=html;
        
        
     
}




   
