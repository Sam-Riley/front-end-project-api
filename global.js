//Global variable to capture input value
var input = document.getElementById('textFieldInput')

//Adding an even listener to input variable. This tells my code to fire off my function "pressEnter" after a keypress (which key to use is handled below).
input.addEventListener('keypress', pressEnter)

//This function will take the value we saved with the input var, and run it against the API
function pressEnter(event){
    var searchInput = input.value
    var api = 'http://localhost:8080/api/'
    //If the key entered was "Enter" then fetch the API route
    if (event.key === 'Enter') {
        fetch(api + 'ls/:id', {
            // body: JSON.stringify(searchInput),
            method: 'GET',
            url: api
        })
        .then(response => response.json())
        // .then(response => {console.log('Here here!')})
        .then(handleResponse)
    console.log(searchInput)
    }
}

function handleResponse(data){
    console.log(data)
}


// GET /ln/?:id - returns a filename if the resource is a file.    
// GET /cat/:id - returns the content of the file as a string.    
// GET /autocomplete/:folder/:text - returns a list of files / folders that match the supplied search string. If no string is specified, all resources will be returned.


// function handle(e) {
//     var input = document.getElementById('textFieldInput')
//     //input variable captures the input value to run against the API
//     if (e.key === 'Enter') {
//         console.log(input)
//     }
//         // console.log(input)
// }
