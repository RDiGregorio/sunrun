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

                    if (!results[routeId] || results[routeId] < arrivalTime) {
                        results[routeId] = {
                            destination: destination,
                            route_id: routeId,
                            arrival_time: arrivalTime
                        };
                    }
                }
            });

            for (const property in results) {
                let time = new Date(results[property].arrival_time);

                const element = <div className="row">
                    <span >{results[property].destination}</span>
                    <span>{time.getHours()}:{time.getMinutes()}</span>
                </div>;

                ReactDOM.render(element, document.getElementById("arrivals"));
            }
        }
    };

    request.open("GET", " https://api-v3.mbta.com/schedules?filter[stop]=place-north");
    request.send();

    return (
        <div className="App">
            <div className="header">
                <span>Destination</span>
                <span>Arrival Time</span>
            </div>
            <div id="arrivals"></div>
        </div>
    );
}

export default App;
