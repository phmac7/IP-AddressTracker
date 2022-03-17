const form = document.querySelector('.tracker__form')
const input = document.querySelector('.tracker__input')
const btn = document.querySelector('#tracker__btn')
const wait = document.querySelector('.tracker__wait')

const ipText = document.querySelector('.tracker__info--ip')
const locationText = document.querySelector('.tracker__info--location')
const timezoneText = document.querySelector('.tracker__info--timezone')
const ispText = document.querySelector('.tracker__info--isp')

let ip = ''
let domain = ''
let data = {}

//validating text input
const validator = (input) => {
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\s*$/.test(input)) { //checking if its an IP address
        ip = input
        input = ''
        return (ip)
    } else if (/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/.test(input) || /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(input)) {
        domain = input
        input = ''
        return (domain)
    } else {
        input = ''
        alert('No valid input: displaying your IP data')
    }
}

//getting data from geo.ipfy
const getData = async () => {
    try {
        let res = await axios.get('https://geo.ipify.org/api/v2/country,city', {
            params: {
                apiKey: 'at_8KbpGEpfhR1DZbNB1WvzRul9MjazC',
                ipAddress: `${ip}`,
                domain: `${domain}`
            }
        })
        data = res.data
        return (data)
    } catch (e) {
        return (e)
    }
}


//creating map
const latlng = [51.5, -0.09]
const map = L.map('map').setView(latlng, 13);
const genMap = () => {
    map.setView(latlng)
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGVkcm9rc3oiLCJhIjoiY2wwdWNzZ2ZsMDVqOTNpbnowamYzaXI5OCJ9.yPibbo_i33bc5W-Y3WtlZA', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);

    const myIcon = L.icon({
        iconUrl: 'images/icon-location.svg',
        iconSize: [30, 40]
    });
    const marker = L.marker(latlng, { icon: myIcon }).addTo(map);
}
genMap()



//
form.addEventListener('submit', async (e) => {
    e.preventDefault()
    validator(input.value)

    btn.setAttribute('disabled', 'disabled')
    wait.style.display = 'block'

    setTimeout(() => {
        btn.removeAttribute('disabled')
        wait.style.display = 'none'
    }, 7000)

    await getData()
    ipText.innerHTML = data.ip
    locationText.innerHTML = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`
    timezoneText.innerHTML = `UTC ${data.location.timezone}`
    ispText.innerHTML = data.isp
    latlng.splice(0, 2, data.location.lat, data.location.lng)
    genMap()
})

