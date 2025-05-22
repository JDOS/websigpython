from owslib.wms import WebMapService

URL = "https://sistemas.itti.org.br/geoserver/Sanepar/ows?service=WMS&version=1.1.1&request=GetCapabilities"
WORKSPACE = "Sanepar"

#retorna dos os groups e sublayer em um dict {'nomegroup':['sub1','sub2']}
def get_layers_wms():

    wms = WebMapService(URL)
    print("Layers com sublayers:")
    list_produts = {}
    for name in wms.contents:
        layer = wms[name]
        if hasattr(layer, 'children') and layer.children:
           #print(f"{name} ({layer.title})")
            #print("  Sublayers:")
            nomelayer=str(name).replace(" ","_")
            nomelayer=nomelayer.replace("-", "")
            print(nomelayer)
            list_produts[nomelayer]=[]
            for sub in layer.children:
                #print(f"    - {sub.name} ({sub.title})")
                list_produts[nomelayer].append(WORKSPACE+":"+sub.title)

    # for k,v in list_produts.items():
    #     print(k,v)

    return list_produts
