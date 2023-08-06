import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-8d95d-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const groceriesInDB = ref(database, "groceries")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(groceriesInDB, inputValue)

    clearInputFieldEl()

})

onValue(groceriesInDB, function(snapshot) {

    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())

        clearShoppingListEl()
    
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }
    } else {
        shoppingListEl.innerHTML ="No items here... yet"
    }


})

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")

    newEl.textContent = itemValue

    shoppingListEl.append(newEl)

    newEl.addEventListener("dblclick", function() {
        let exactLocationOfGroceryInDB = ref(database, `groceries/${itemID}`)
        
        remove(exactLocationOfGroceryInDB)
    })

}

