
// TO DO: Drop down menus for the year range? 
    // Populate based on the API data (from our own JSON file)

// Populate the state dropdown from our JSON, the id of each state will be the FIPS code (used in the API for data retrieval)

document.addEventListener('DOMContentLoaded', function () {

    fetch('states.json')
    .then((res) => res.text())
    .then((data) => { 
        data = JSON.parse(data);
        let output = '';
        
        // Create a button for each state
        data.forEach(function(states) {
            output += `<option class="dropdown-item selected_state" id="${states.state_code}">${states.state_name}</option>\r\n`;            
        });
        document.getElementById('select_state').innerHTML += output;

    }) 
    .catch((err) => console.log(err));


})


// If the user has selected a state, populate the counties for that state (the id for the counties are the FIPS codes)

document.getElementById("select_state").onchange = populateCountyDropdown ;

function populateCountyDropdown() {

    // Clear the dropdown list
    document.getElementById("select_county").options.length=0;

    var selected_state = document.getElementById('select_state');
    var value = selected_state.options[selected_state.selectedIndex].id;

    fetch('state_county_data.json')
    .then((res) => res.text())
    .then((data) => { 
        data = JSON.parse(data);
        let output = '';
        // Create a button for each county in selected state
        data.forEach(function(state_county_data) {
            if (value == state_county_data.state_code) {
                output += `<option class="dropdown-item" id="${state_county_data.county_code}">${state_county_data.county_name}</option>\r\n`;   
            }         
        });
        document.getElementById('select_county').innerHTML += output;
    }) 
    .catch((err) => console.log(err));
}


// Once the user has filled out both the year range and county/city data, call the API (using Fetch?)

// Analyze that data 

// Generate charts based on the data pulled (using what tools?)

// Push the charts to html



