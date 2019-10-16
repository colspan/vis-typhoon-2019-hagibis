import colormap from 'colormap'
import neatCsv from 'neat-csv'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './style.css'

/* NOTE: This code is needed to properly load the images in the Leaflet CSS */
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})
L.Control.Title = L.Control.extend({
  onAdd: function (map) {
    var div = L.DomUtil.create('div');
    var title = '<h1>2019年 台風19号 各河川水位可視化</h1>';
    div.className = 'map-title';
    div.innerHTML = title;
    return div;
  },
  onRemove: function (map) {
    // Nothing to do here
  }
});
L.control.title = function (opts) {
  return new L.Control.Title(opts);
}

L.Control.Indicator = L.Control.extend({
  onAdd: function (map) {
    var div = L.DomUtil.create('div');
    div.className = 'map-indicator';
    return div;
  },
  onRemove: function (map) {
    // Nothing to do here
  }
});
L.control.indicator = function (opts) {
  return new L.Control.Indicator(opts);
}



const defaultCenter = [35.758771, 139.794158]
const defaultZoom = 11
const map = L.map('map', {
  zoom: defaultZoom,
  center: defaultCenter,
  zoomControl: false,
})
const attribution = [
  'Tiles &copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',
  'Data &copy; <a href="http://www1.river.go.jp/">国土交通省 水文水質データベース</a>',
  'Visualization &copy: <a href="https://github.com/colspan">@colspan</a>'
].join(' | ')
const basemap = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', { attribution })
basemap.addTo(map)
const titleControl = L.control.title({ position: 'topleft' }).addTo(map)
L.control.zoom({ position: 'bottomright' }).addTo(map);


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

    // state variables
    let logIndex = 0
    const levelColor = colormap({
      colormap: 'portland',
      nshades: 30,
      format: 'hex',
      alpha: 1,
    })

    // markers
    const siteInfoMarkers = riverSiteInfo.map(d => {
      const marker = L.circleMarker(d.coordinate, {
        weight: 1,
      }).addTo(map)
      const text = `${d.site_name}`
      marker.bindTooltip(text)
      marker.site_id = d.site_id
      return marker
    })
    // update markers
    function updateMarkers() {
      siteInfoMarkers.forEach((d, i) => {
        let value = riverLog[logIndex][d.site_id]
        const [max, min] = riverSiteMaxMin[i]
        const color = levelColor[parseInt((value - min) / (max - min) * (levelColor.length - 1), 10)]
        if (!isNaN(value)) {
          d.setRadius((value - min / 2) * 10)
          d.setStyle({
            color,
            fillColor: color,
          })
        }
      })
    }

    // datetime
    const mapIndicator = L.control.indicator({ position: 'bottomleft' })
    const mapIndicatorContainer = mapIndicator.addTo(map)
    function updateDateTime() {
      const indicatorHtml = `<div class="datetime">${riverLog[logIndex].datetime}</div>`
      mapIndicatorContainer.getContainer().innerHTML = indicatorHtml
    }

    // start animation
    // updateMarkers()
    setInterval(() => {
      logIndex += 1
      if (riverLog.length <= logIndex) logIndex = 0
      updateMarkers()
      updateDateTime()
    }, 100)

  })
  .catch(console.error)

// const marker = L.marker(defaultCenter)
// marker.addTo(map)