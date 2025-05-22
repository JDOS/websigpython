from owslib.wms import WebMapService

# Substitua pela URL do seu WMS
url = "https://sistemas.itti.org.br/geoserver/Sanepar/ows?service=WMS&version=1.1.1&request=GetCapabilities"


wms = WebMapService(url)

print("Layers com sublayers:")
list_produts = {}
for name in wms.contents:
    layer = wms[name]
    if hasattr(layer, 'children') and layer.children:
        print(f"{name} ({layer.title})")
        print("  Sublayers:")
        nomelayer=str(layer.title)
        list_produts[nomelayer]=[]
        for sub in layer.children:
            print(f"    - {sub.name} ({sub.title})")
            list_produts[nomelayer].append("Sanepar:"+sub.title)

for k,v in list_produts.items():
    print(k,v)