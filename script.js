
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

document.getElementById("fetch_data_button").addEventListener("click", getAPIData); 

// Fetch states.json data
function fetchStates() {

    var jsondata;

    return fetch('states.json')
        .then(function(response) {
            return response.json();
    })  
        .then(function(json) {
            return json;
    });
}

// Fetch state.county_data.json data
function fetchState_County_Data() {

    var jsondata;

    return fetch('state_county_data.json')
        .then(function(response) {
            return response.json();
    })  
        .then(function(json) {
            return json;
    });
}

function getAPIData() {

    // Get selected state and county divs
    var selected_state = document.getElementById('select_state');
    var selected_county = document.getElementById('select_county');
    // Get the value from above
    var state = selected_state.options[selected_state.selectedIndex].text;
    var county = selected_county.options[selected_county.selectedIndex].text;
    var state_code;
    // Base url that needs to be added onto with state and county
    var url = "https://aqs.epa.gov/data/api/annualData/byCounty?email=rachel.peterson.5683@gmail.com&key=tealheron74&param=44201&bdate=20160101&edate=20160228";
    
    // Call function to get states data and compare to dropdown state
    fetchStates().then(function(data) {
        data.forEach(function(states) {
            if(state == states.state_name) {
                state_code = states.state_code;
                url += "&state=" + states.state_code;
            }         
        });
    });

    // Call function to get state_county_data and compare to dropdown county, also finally grab data with base url 
    //
    // ** Needs to be reworked **
    //
    fetchState_County_Data().then(function(data) {
        data.forEach(function(state_county_data) {
            if(county == state_county_data.county_name && state_code == state_county_data.state_code) {
                url += "&county=" + state_county_data.county_code;
                console.log(county);
                var xmlhttp = new XMLHttpRequest();
                fetch(url)
                    .then(response => response.json())
                    .then(data => console.log(data));
                    xmlhttp.open("GET", url, true);
                    xmlhttp.send();
                    xmlhttp.onreadystatechange = function(){
                    if (this.readyState == 4 && this.status == 200){
                        var data = JSON.parse(this.responseText);
                        var st = data.Data.map(function(elem){
                        return elem.observation_count;
                    });
                     console.log(st)
                    var code = data.Data.map(function(elem){
                        return elem.county_code;
                    });

    var ctx = document.getElementById('canvas').getContext('2d');
    var chart = new Chart(ctx, {
    type: 'bar',
                data: {
                labels: st,
                datasets: [{
                    label: "Observation Count",
                    data: code,
                    backgroundColor: 'rgb(200, 200, 200)',
                    borderColor: 'rgb(0, 150, 215)',
                }]
                },
                options: {
                responsive: 'true',
                stacked: true,
                }
            });

}         
}
};
})}

)}
 

// Once the user has filled out both the year range and county/city data, call the API (using Fetch?)

// Analyze that data 

// Generate charts based on the data pulled (using what tools?)



// Push the charts to html


 
