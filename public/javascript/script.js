const socket = io();

const markers={}

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log(longitude,latitude)
      socket.emit("sendLocation", { latitude, longitude });
    },
    (error) => {
      console.error(error);
      alert("Unable to fetch location.");
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}


const map = L.map("map").setView([0, 0], 10); //([location basically longitude and latitude],zoom_size)

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

socket.on('recievedLocation',(data)=>{
    const {id,longitude,latitude}=data
    console.log(`${id} ${longitude} ${latitude}`)
    map.setView([latitude,longitude],16)
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);
    }
})


socket.on('userDisconnected', ({id}) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id]
    }
});