#! /usr/bin/env node
var https = require('https')
var querystring = require('querystring')

var arguments = process.argv.splice(2, process.argv.length -1).join(' ')
var search    = querystring.stringify({ address: arguments })

https
  .get('https://maps.googleapis.com/maps/api/geocode/json?' + search, function(res){
    var data = ''

    res.on('data', function(newData){
      data += newData
    });

    res.on('end', function(){
      var location = JSON.parse(data).results[0].geometry.location
      var key = ''
      var options = querystring.stringify({ units: 'si', lang: 'pt' })
      https
        .get('https://api.forecast.io/forecast/'+ key +'/' + location.lat +',' + location.lng + '?' + options, function(resForecast){
          var data = ''

          resForecast.on('data', function(newData){
            data += newData
          });

          resForecast.on('end', function(){
            var json = JSON.parse(data)
            console.log('Temperatura Atual: ' + json.currently.temperature + ' ºC')
            console.log('Sensação Térmica: ' + json.currently.apparentTemperature + ' ºC')
            console.log(json.daily.summary)
          })
        })
    })
  })
