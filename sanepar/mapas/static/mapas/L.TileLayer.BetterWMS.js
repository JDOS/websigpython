L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({
  
    onAdd: function (map) {
      // Triggered when the layer is added to a map.
      //   Register a click listener, then do all the upstream WMS things
     //   console.log(this.options.title); // se você passou title nas options
      L.TileLayer.WMS.prototype.onAdd.call(this, map);
      map.on('click', this.getFeatureInfo, this);
      //map.on('dblclick', this.zoomRegionGetFeatureInfo, this);
      console.log(this);
    },
    
    onRemove: function (map) {
      // Triggered when the layer is removed from a map.
      //   Unregister a click listener, then do all the upstream WMS things
      L.TileLayer.WMS.prototype.onRemove.call(this, map);
      map.off('click', this.getFeatureInfo, this);
    },
    
    getFeatureInfo: function (evt) {
      // Make an AJAX request to the server and hope for the best
      var url = this.getFeatureInfoUrl(evt.latlng),
          showResults = L.Util.bind(this.showGetFeatureInfo, this);
          console.log(url);
      $.ajax({
        url: url,
        success: function (data, status, xhr) {
          //var err = typeof data === 'string' ? null : data;
          var err = typeof data === 'object' ? null : data;
          showResults(err, evt.latlng, data);
        },
        error: function (xhr, status, error) {
          showResults(error);  
        }
      });
    },
    
    getFeatureInfoUrl: function (latlng) {
      // Construct a GetFeatureInfo request URL given a point
      var point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
          size = this._map.getSize(),
          bounds = this._map.getBounds(),
      version = this.wmsParams.version,
      crsParam = version === '1.3.0' ? 'crs' : 'srs',
      bbox = bounds.toBBoxString();

  // For WMS 1.3.0 and EPSG:4326, swap bbox order
  if (version === '1.3.0' && this.wmsParams[crsParam] === 'EPSG:4326') {
    var sw = bounds.getSouthWest();
    var ne = bounds.getNorthEast();
    bbox = [sw.lat, sw.lng, ne.lat, ne.lng].join(',');
  }
          params = {
            request: 'GetFeatureInfo',
            service: 'WMS',
            srs: 'EPSG:4326',
            styles: this.wmsParams.styles,
            transparent: this.wmsParams.transparent,
            version: this.wmsParams.version,      
            format: this.wmsParams.format,
            bbox: this._map.getBounds().toBBoxString(),
            height: size.y,
            width: size.x,
            layers: this.wmsParams.layers,
            query_layers: this.wmsParams.layers,
            //info_format: 'text/html'
            info_format: 'application/json'
          };
      
      params[params.version === '1.3.0' ? 'i' : 'x'] = Math.round(point.x);
      params[params.version === '1.3.0' ? 'j' : 'y'] =Math.round(point.y);
      
      // return this._url + L.Util.getParamString(params, this._url, true);
      
      var url = this._url + L.Util.getParamString(params, this._url, true);
        
        
        /**
         * CORS workaround (using a basic php proxy)
         * 
         * Added 2 new options:
         *  - proxy
         *  - proxyParamName
         * 
         */
         
        // check if "proxy" option is defined (PS: path and file name)
        if(typeof this.wmsParams.proxy !== "undefined") {
            
            // check if proxyParamName is defined (instead, use default value)
            if(typeof this.wmsParams.proxyParamName !== "undefined")
                this.wmsParams.proxyParamName = 'url';
            
            // build proxy (es: "proxy.php?url=" )
            _proxy = this.wmsParams.proxy + '?' + this.wmsParams.proxyParamName + '=';
            
            url = _proxy + encodeURIComponent(url);
            
        } 
        
        return url;
      
    },
    
    showGetFeatureInfo: function (err, latlng, content) {
      // var infoDiv = document.getElementById('info');
      // if (err) { 
      //   console.log(err);
      //   infoDiv.innerHTML = '<i style="color: red;">Erro ao obter informações</i>';

      //    return;
      //    }


      //    if (!content || !content.features || content.features.length === 0) {
      //   infoDiv.innerHTML = '<i>[Nenhuma informação encontrada]</i>';
      //   return;
      //    } 

        console.log(content); 
    // do nothing if there's an error
         //console.log(content);
        // console.log(content);
         // Remover as tags <style> e seu conteúdo do texto
       // var cleanedHtmlString = content.replace(/<style[^>]*>.*?<\/style>/gs, "<style>tr { display: block; float: left; } th, td { display: block; border: 1px solid white; } tr>*:not(:first-child) { border-top: 0; } tr:not(:first-child)>* { border-left:0; }</style>");
        var graphicUrl = 'https://sistemas.itti.org.br/geoserver/ows?service=WMS&version=1.1.0&request=GetLegendGraphic&layer='+this.options.layers+'&format=image/png';
        // const img = document.getElementById('legend');
        // img.src = graphicUrl;

       let text = "";
      
        if (this.options.layers) {
        text += "<h4 style='font-size:18px;'><b>" + this.title + "</b></h4>";
         }

        for (let i = 0; i<content.features.length; i++){
           // console.log(content.features[i].id.split('.')[0]);
           //antigo modo de por titulo
            // let titulo = content.features[i].id.split('.')[0];
            // if (titulo !=''){
            //     text+="<h4>"+this.options.title+"</h4>";
            // }
            for (const x in content.features[i].properties) {
                let valor = content.features[i].properties[x];

                if(x.toUpperCase()=="ÁREA_M²" || x.toUpperCase()=="AREAM2" ){
                  console.log("converter:",valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                  valor =valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }

                if(x.toUpperCase()=="SHAPE_LENG" || x.toUpperCase()=="SHAPE_LE_1" || x.toUpperCase()=="SHAPE_AREA" ){
                  console.log("converter:",valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                  valor =valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }

                if (valor!=null || valor != '' || valor!='null') {
                    text += "<b>"+x.toUpperCase()+"</b>" +":"+ valor + "<br>";
                }
            }
         }
   

    if (text==''){
        return
    }

  //  infoDiv.innerHTML = text;
   //   Otherwise show the content in a popup, or something.
      // L.popup({ minWidth:300, maxWidth: 800, maxHeight: 500})
      //   .setLatLng(latlng)
      //   .setContent(text)
      //   .openOn(this._map);
    
     },

    zoomRegionGetFeatureInfo: function (evt) {
      var layerName = this.options.layers;
      console.log(layerName);
$.ajax({
  url: "https://sistemas.itti.org.br/geoserver/wms?service=WMS&version=1.3.0&request=GetCapabilities",
  type: "GET",
  dataType: "xml",
  success: function(xml) {
    // Procura todos os elementos <Layer>
    $(xml).find("Layer").each(function() {
      var name = $(this).children("Name").text();
      if (name === layerName) {
        // Procura o BoundingBox (pode ser CRS ou SRS)
        var bboxEl = $(this).children("BoundingBox[CRS='EPSG:4326'], BoundingBox[SRS='EPSG:4326']");
        if (bboxEl.length > 0) {
          var minx = parseFloat(bboxEl.attr("minx"));
          var miny = parseFloat(bboxEl.attr("miny"));
          var maxx = parseFloat(bboxEl.attr("maxx"));
          var maxy = parseFloat(bboxEl.attr("maxy"));
          // Formato para o Leaflet
          var bbox = [
            [miny, minx], // canto sudoeste
            [maxy, maxx]  // canto nordeste
          ];
          // Faz o zoom no mapa
          map.fitBounds(bbox, { maxZoom: 16 });
          console.log("BBOX:", bbox);
        } else {
          // Alternativamente, pega do EX_GeographicBoundingBox
          var exBBox = $(this).children("EX_GeographicBoundingBox");
          if (exBBox.length > 0) {
            var west = parseFloat(exBBox.find("westBoundLongitude").text());
            var east = parseFloat(exBBox.find("eastBoundLongitude").text());
            var south = parseFloat(exBBox.find("southBoundLatitude").text());
            var north = parseFloat(exBBox.find("northBoundLatitude").text());
            var bbox = [
              [south, west],
              [north, east]
            ];
            map.fitBounds(bbox, { maxZoom: 16 });
            console.log("EX_GeographicBoundingBox:", bbox);
          } else {
            console.log("BoundingBox não encontrado para o layer.");
          }
        }
      }
    });
  },
  error: function(xhr, status, error) {
    console.error("Erro ao buscar GetCapabilities:", error);
  }
});
    }
  });
  
  L.tileLayer.betterWms = function (url, options, title) {
    console.log("Titulo layer",title);
    return new L.TileLayer.BetterWMS(url, options, title);  
  };