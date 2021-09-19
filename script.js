
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

document.getElementById("select_state").onchange = populateCountyDropdown;

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

// Call populateDateDropdowns when the year is clicked on
document.getElementById("select_year").addEventListener("mousedown", populateDateDropdowns);

// Fill the dropdowns with all possible years and months
function populateDateDropdowns() {

    for(let i = 0; i <= 40; i++) {

        var year = 1980 + i;

        document.getElementById('select_year').innerHTML += `<option class="dropdown-item">${year.toString()}</option>\r\n`;
    }

    for(let i = 0; i < 12; i++) {

        var month = i + 1;

        if(month < 10) {

            document.getElementById('select_month').innerHTML += `<option class="dropdown-item">0${month.toString()}</option>\r\n`;
        }
        else {

            document.getElementById('select_month').innerHTML += `<option class="dropdown-item">${month.toString()}</option>\r\n`;
        }
    }

    document.getElementById("select_year").removeEventListener("mousedown", populateDateDropdowns);   
}

document.getElementById("select_month").onchange = populateDayDropdown;

function populateDayDropdown() {

    // Clear the dropdown list
    document.getElementById("select_day").options.length=0;

    var selected_month = document.getElementById('select_month');
    var month = selected_month.options[selected_month.selectedIndex].text;

    if(month == "2") {

        for(let i = 0; i < 28; i++) {

            var day = i + 1;
    
            if(day < 10) {

                document.getElementById('select_day').innerHTML += `<option class="dropdown-item">0${day.toString()}</option>\r\n`;
            }
            else {

                document.getElementById('select_day').innerHTML += `<option class="dropdown-item">${day.toString()}</option>\r\n`;
            }
        }
    }
    else if (month == "4" || month == "6" || month == "9" || month == "11") {

        for(let i = 0; i < 30; i++) {

            var day = i + 1;
    
            if(day < 10) {

                document.getElementById('select_day').innerHTML += `<option class="dropdown-item">0${day.toString()}</option>\r\n`;
            }
            else {

                document.getElementById('select_day').innerHTML += `<option class="dropdown-item">${day.toString()}</option>\r\n`;
            }        }
    }
    else {
        
        for(let i = 0; i < 31; i++) {

            var day = i + 1;
    
            if(day < 10) {

                document.getElementById('select_day').innerHTML += `<option class="dropdown-item">0${day.toString()}</option>\r\n`;
            }
            else {

                document.getElementById('select_day').innerHTML += `<option class="dropdown-item">${day.toString()}</option>\r\n`;
            }        }
    }
}

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

document.getElementById("select_day").onchange = getAPIData;

function getAPIData() {

    // Get selected state and county divs
    var selected_state = document.getElementById('select_state');
    var selected_county = document.getElementById('select_county');
    var selected_year = document.getElementById('select_year');
    var selected_month = document.getElementById('select_month');
    var selected_day = document.getElementById('select_day');
    // Get the value from above
    var state = selected_state.options[selected_state.selectedIndex].text;
    var county = selected_county.options[selected_county.selectedIndex].text;
    var year = selected_year.options[selected_year.selectedIndex].text;
    var month = selected_month.options[selected_month.selectedIndex].text;
    var day = selected_day.options[selected_day.selectedIndex].text;

    var state_code;
    // Base url that needs to be added onto with state and county
    var url = "https://aqs.epa.gov/data/api/annualData/byCounty?email=rachel.peterson.5683@gmail.com&key=tealheron74&param=44201";

    url += "&bdate=" + year + month + day + "&edate=" + year + month + day;

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
                    if (elem.pollutant_standard == "Ozone 8-hour 2015"){
                        return elem.site_number;
                    }
                    if (elem.pollutant_standard == "PM 25 24-hour 2012"){
                        return elem.site_number;
                    }
                    });
                     console.log(st)
                    var code = data.Data.map(function(elem){
                    if (elem.pollutant_standard == "Ozone 8-hour 2015"){
                        return elem.arithmetic_mean;
                    }
                    });
                    var pm = data.Data.map(function(elem){
                    if (elem.pollutant_standard == "PM 25 24-hour 2012"){
                        return elem.arithmetic_mean;
                    }
                    });

                    

    const ctx = document.getElementById('canvas').getContext('2d');
    const chart = new Chart(ctx, {
    type: 'bar',
                data: {
                labels: st,
                datasets: [{
                    label: ["Ozone"],
                    data: code,
                    backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'],
                    hoverBackgroundColor: "rgba(232,105,90,0.8)",
                    borderColor: 'rgb(0, 0, 0)',
                    borderWidth: 0.5
                },
                {
                    label: ["PM 25 "],
                    data: pm,
                    backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    ],
                    hoverBackgroundColor: "rgba(232,105,90,0.8)",
                    borderColor: 'rgb(0, 0, 0)',
                    borderWidth: 0.5
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
 


 
