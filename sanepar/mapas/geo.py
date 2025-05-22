from owslib.wms import WebMapService

URL = "https://sistemas.itti.org.br/geoserver/Sanepar/ows?service=WMS&version=1.1.1&request=GetCapabilities"
WORKSPACE = "Sanepar"

#retorna dos os groups e sublayer em um dict {'nomegroup':['sub1','sub2']}
def get_layers_wms():
    wms = WebMapService(URL)
    list_produts = {}
    for name in wms.contents:
        layer = wms[name]
        if hasattr(layer, 'children') and layer.children:
            nomelayer=str(name).replace(" ","_")
            nomelayer=nomelayer.replace("-", "")
            list_produts[nomelayer]=[]
            for sub in layer.children:
                name=WORKSPACE+":"+sub.name
                tupla=(name,sub.title)
                list_produts[nomelayer].append(tupla)


    return list_produts
