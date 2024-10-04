import React, { useEffect } from 'react';

function GoogleMapsAutocomplete() {
    useEffect(() => {
        const loadMapScript = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=API_KEY&libraries=places`;
            script.onload = initAutocomplete;
            document.head.appendChild(script);
        };

        const initAutocomplete = () => {
            const map = new window.google.maps.Map(document.getElementById("map"), {
                center: { lat: 19.076090, lng: 72.877426 },
                zoom: 12,
                mapTypeId: "roadmap",
            });
            const input = document.getElementById("pac-input");
            const searchBox = new window.google.maps.places.SearchBox(input);

            map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);
            map.addListener("bounds_changed", () => {
                searchBox.setBounds(map.getBounds());
            });

            let markers = [];

            searchBox.addListener("places_changed", () => {
                const places = searchBox.getPlaces();

                if (places.length === 0) {
                    return;
                }

                markers.forEach((marker) => {
                    marker.setMap(null);
                });
                markers = [];

                const bounds = new window.google.maps.LatLngBounds();

                places.forEach((place) => {
                    if (!place.geometry || !place.geometry.location) {
                        console.log("Returned place contains no geometry");
                        return;
                    }

                    const icon = {
                        url: place.icon,
                        size: new window.google.maps.Size(71, 71),
                        origin: new window.google.maps.Point(0, 0),
                        anchor: new window.google.maps.Point(17, 34),
                        scaledSize: new window.google.maps.Size(25, 25),
                    };

                    markers.push(
                        new window.google.maps.Marker({
                            map,
                            icon,
                            title: place.name,
                            position: place.geometry.location,
                        }),
                    );
                    if (place.geometry.viewport) {
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });
                map.fitBounds(bounds);
            });
        };

        loadMapScript();

        return () => {
            // Cleanup script tag
            const scriptTags = document.head.getElementsByTagName('script');
            for (let i = 0; i < scriptTags.length; i++) {
                if (scriptTags[i].src.includes('maps.googleapis.com')) {
                    document.head.removeChild(scriptTags[i]);
                    break;
                }
            }
        };
    }, []);

    return (
        <div>
            <input id="pac-input" type="text" className='w-[21rem] h-[3rem] text-sm' placeholder="Enter a location" />
            <div id="map" style={{ width: '100%', height: '85vh' }}></div>
        </div>
    );
}

export default GoogleMapsAutocomplete;



