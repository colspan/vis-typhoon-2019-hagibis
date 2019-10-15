import neatCsv from 'neat-csv'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

/* NOTE: This code is needed to properly load the images in the Leaflet CSS */
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

const map = L.map('map')
const defaultCenter = [35.758771, 139.794158]
const defaultZoom = 11
const basemap = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
  attribution: 'Tiles &copy <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
})

map.setView(defaultCenter, defaultZoom)
basemap.addTo(map)

function getSiteInfo() {
  const siteInfoCSV = './siteinfo.csv'
  return new Promise((resolve, reject) => {
    fetch(siteInfoCSV)
      .then(res => res.text())
      .then(data => neatCsv(data, {
        mapValues: ({ header, index, value }) => {
          if (header === 'coordinate') {
            function parseLonLat(x) {
              const reg = new RegExp("[度分秒]")
              const values = x.split(reg)
              return +values[0] + (+values[1]) / 60 + (+values[2]) / 60 / 60
            }
            const splitValue = value.split(" ")
            const lat = parseLonLat(splitValue[1])
            const lon = parseLonLat(splitValue[3])
            return [lat, lon]
          }
          else return value
        }
      }))
      .then(resolve)
      .catch(reject)
  })
}

function getRiverLog() {
  const siteInfoCSV = './riverlog_201910.csv'
  return new Promise((resolve, reject) => {
    fetch(siteInfoCSV)
      .then(res => res.text())
      .then(data => neatCsv(data, {
        mapValues: ({ header, index, value }) => {
          if (header === 'datetime') return value
          else if (value === "") return NaN
          else return +value
        }
      }))
      .then(resolve)
      .catch(reject)
  })
}

Promise.all([getSiteInfo(), getRiverLog()])
  .then(result => {
    const [siteInfo, riverLog] = result
    console.log(siteInfo, riverLog)

    const riverSiteInfo = siteInfo.filter(d => d.site_id.length === 16)
    const damSiteInfo = siteInfo.filter(d => d.site_id.length < 16)

    // calc max, min
    const riverSiteMaxMin = riverSiteInfo.map(d => {
      const siteLog = riverLog.map(x => x[d.site_id]).filter(x => !isNaN(x))
      const max = siteLog.reduce((a, b) => a > b ? a : b)
      const min = siteLog.reduce((a, b) => a < b ? a : b)
      siteLog.forEach((d, i) => {
        if (isNaN(d)) riverLog[i][d.site_id] = min
      })
      return [max, min]
    })

    // add markers
    const siteInfoMarkers = riverSiteInfo.map(d => {
      const marker = L.circleMarker(d.coordinate).addTo(map)
      const text = `${d.site_name}`
      marker.bindTooltip(text)
      marker.site_id = d.site_id
      return marker
    })

    // update markers
    let logIndex = 0
    function updateMarkers() {
      siteInfoMarkers.forEach((d, i) => {
        let value = riverLog[logIndex][d.site_id]
        const [max, min] = riverSiteMaxMin[i]
        if (!isNaN(value)) d.setRadius((value - min / 2) * 20)
      })
    }

    function updateTitle() {
      console.log(riverLog[logIndex].datetime)
    }

    // start animation
    // updateMarkers()
    setInterval(() => {
      logIndex += 1
      if (riverLog.length <= logIndex) logIndex = 0
      updateMarkers()
      updateTitle()
    }, 100)

  })
  .catch(console.error)

// const marker = L.marker(defaultCenter)
// marker.addTo(map)