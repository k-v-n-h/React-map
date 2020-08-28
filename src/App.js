import React, { useState } from 'react';
// import _ from "lodash";
// import { compose, withProps } from "recompose";
// import logo from './logo.svg';
import './App.css';
import { 
  GoogleMap, 
  withScriptjs, 
  withGoogleMap, 
  Marker, 
  InfoWindow } from "react-google-maps";
// import { render } from '@testing-library/react';
import * as storeData from "./store-data.json";
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import usePlacesAutoComplete, {getGeocode,
  getLatLng,} from "use-places-autocomplete";



function Map() {
  const mapRef = React.useRef();
  const [selectedStore, setSelectedStore] = useState(null);
  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  return (

    <GoogleMap
      defaultZoom={12}
      defaultCenter={{ 
        lat: 34.063380, 
        lng: -118.358080
       }}
    >
      {storeData.stores.map((store) => (
        <Marker key={store.id}
          position={{
            lat: store.coordinates.latitude,
            lng: store.coordinates.longitude
          }}
          onClick={() => {
            setSelectedStore(store)
          }}

        />
      ))}

      <Search panTo={panTo}/>

      {selectedStore && (
        <InfoWindow position={{
          lat: selectedStore.coordinates.latitude,
          lng: selectedStore.coordinates.longitude
        }}

          onCloseClick={() => { setSelectedStore(null); }}>

          <div class="store-container">
            <h2>{selectedStore.name}</h2>
            <div class="store-container-background">
              <div class="store-info-container">
                <div class="store-address">
                  <span>{selectedStore.addressLines}</span>
                  <span>{selectedStore.address.city}</span>
                </div>
                <div class="store-phone-number">{selectedStore.phoneNumber}</div>
              </div>
              <div class="store-number-container">
                <div class="store-number">{}</div>
              </div>
            </div>
          </div>
        </InfoWindow>
      )}

      {/* // <Marker */}
      {/* //   position={{ lat: 40.666893, lng: -111.887993 }} */}
      {/* // /> */}
    </GoogleMap>
  )
}

function Search({panTo}) {
  const {ready, 
    value, 
    suggestions: {status, data}, 
    setValue, 
    clearSuggestions,
    } = usePlacesAutoComplete({
    requestOptions: {
      location: {
        lat: () => 34.063380, 
        lng: () => -118.358080 },
        radius: 200 * 1000, //radius in kilometers convert to meters
    },
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };
  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
  <div class="search-container"> 
    <div class='search'>
  
      <Combobox onSelect={async (address) => {
        setValue(address, false);
        clearSuggestions();
        try{
          const results = await getGeocode({address});
          const { lat,lng } = await getLatLng(results[0]);
          panTo({lat, lng});
        } catch(error) {
          console.log("error");
        }}}
        >
        <ComboboxInput 
          value={value} 
          onChange={handleSelect}
          disabled={!ready}
          placeholder="Enter search"
          />
        {/* <ComboboxPopover> */}
          <ComboboxList>
            {status === 'OK' && data.map(({id, description}) =>(
              <ComboboxOption key={id} value={description} />
            ))}
          </ComboboxList>
        {/* </ComboboxPopover> */}
      </Combobox>
    </div>
  </div>
)}

  

const MapWithAMarker = withScriptjs(withGoogleMap(Map));


export default function App() {
  return (
    <div>
    <MapWithAMarker
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_KEY}&callback=initMap`}
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `100vh` }} />}
      mapElement={<div style={{ height: `100%` }} />}
    />
    </div>
  );
}







/* <WrappedMap googleMapURL = {'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places'} */
/* <WrappedMap googleMapURL = {`https://maps.googleapis.com/maps/api/js?key=${}&v=3.exp&libraries=geometry,drawing,places`} */