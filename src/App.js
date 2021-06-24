import './App.css';
import * as ReactDOM from "@testing-library/react";
import React from "react";

function App() {
    let request = new XMLHttpRequest();
    let results = {};

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            let payload = JSON.parse(request.responseText);

            payload.data.forEach((data) => {
                if (data.relationships.route.data.id.startsWith("CR-") && data.attributes.arrival_time) {
                    let destination = data.relationships.route.data.id.split("-")[1];
                    let routeId = data.relationships.route.data.id;
                    let arrivalTime = Date.parse(data.attributes.arrival_time);

                    if(!results[routeId] || results[routeId] < arrivalTime) {
                        results[routeId] = {
                            destination: destination,
                            route_id: data.relationships.route.data.id,
                            arrival_time: data.attributes.arrival_time
                        };
                    }
                }
            });

            for (const property in results) {
                const element = <div>
                    <div>destination: {results[property].destination}</div>
                    <div>arrival time: {results[property].arrival_time}</div>
                </div>;

                ReactDOM.render(element, document.getElementById("arrivals"));
            }
        }
    };

    request.open("GET", " https://api-v3.mbta.com/schedules?filter[stop]=place-north");
    request.send();

    return (
        <div className="App">
            <div id="arrivals"></div>
        </div>
    );
}

export default App;
