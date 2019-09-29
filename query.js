function populateList(dataset){
    list = document.getElementById("parkList");

    list.innerHTML = "";

    for (const park of dataset) {
        //https://www.google.com/maps/search/?api=1&query=<lat>,<lng>

        var item = document.createElement("li");
        var wrapper = document.createElement('div');
        var header = document.createElement('header');
        var address = document.createElement('p');
        var area = document.createElement('p');
        var link = document.createElement('a');

        parkName = document.createTextNode(park.park_name);
        parkAddress = document.createTextNode("Location: " + park.location_description);
        parkArea = document.createTextNode("Total Area (hectares): " + Math.round(park.area_in_hectares*100)/100);
        parkLink = document.createTextNode("Find on Google Maps...")

        longitude = park.location.longitude; 
        latitude = park.location.latitude; 
        
        header.appendChild(parkName);
        header.setAttribute("class", "parkName");

        address.appendChild(parkAddress);
        address.setAttribute("class", "parkAddress");

        area.appendChild(parkArea);
        area.setAttribute("class", "parkArea");

        link.appendChild(parkLink);
        link.setAttribute("class", "parkLink");
        link.setAttribute("href", "https://www.google.com/maps/search/?api=1&query=" + latitude + "+," + longitude + "");

        wrapper.appendChild(header);
        wrapper.appendChild(address);
        wrapper.appendChild(area);
        wrapper.appendChild(link);
        wrapper.setAttribute("class", "park")

        item.appendChild(wrapper);
        list.appendChild(item);
    }
}

function populateNeighbourhood(dataset) 
{
    const neighSelect = document.querySelector('select#neighbourhood');

    var optn = document.createElement("option");
    optn.text = "Please Select a Neighbourhood...";
    optn.value = -1;
    neighSelect.appendChild(optn);

    let neighbourhoods = [];

    for (const park of dataset) {
        if(!neighbourhoods.includes(park.neighbourhood)){
            neighbourhoods.push(park.neighbourhood)
        }
    }

    for (const neigh of neighbourhoods) {
        var optn = document.createElement("option");
        optn.text = neigh;
        optn.value = neigh;
        neighSelect.appendChild(optn);
    }

}
function listParks(index){
    fetch("https://data.winnipeg.ca/resource/tx3d-pfxq.json?neighbourhood=" + index + "&$order=park_name ASC")
    .then(function(result) {
        return result.json(); // Promise for parsed JSON.
    })
    .then(function(dataset) {
        populateList(dataset);
    });
}

function listNeighbourhoods(){
    fetch("https://data.winnipeg.ca/resource/tx3d-pfxq.json?$order=neighbourhood ASC&$limit=2000")
    .then(function(result) {
        return result.json(); // Promise for parsed JSON.
    })
    .then(function(dataset) {
        populateNeighbourhood(dataset);
    });
}

function bindEventListeners() {
    listNeighbourhoods();
    
    const neighSelect = document.querySelector('select#neighbourhood');
  
    neighSelect.addEventListener('change', () => {
      const selectedIndex = neighSelect.selectedIndex;
      const selectedProvinceId = neighSelect.options[selectedIndex].value;
      
      if (selectedProvinceId !== -1) {
        listParks(selectedProvinceId);
      }
  
    });
  }
  
  // The only function invoked when the HTML document loads.
  document.addEventListener('DOMContentLoaded', bindEventListeners);

