from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse

from django.shortcuts import render, redirect 
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm 
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from owslib.wms import WebMapService
import json

URL = "https://sistemas.itti.org.br/geoserver/Sanepar/ows?service=WMS&version=1.1.1&request=GetCapabilities"
WORKSPACE = "Sanepar"

URL2 = "https://www.reservashidricasiguacu.com.br/geoserver/sanepar/ows?service=WMS&version=1.1.1&request=GetCapabilities"
WORKSPACE2 = "sanepar"

def index(request):
    context = {}
    return render(request, "mapas/index.html", context)

# @login_required
# def websig(request):
#     context = {}
#     return render(request, "mapas/websig.html", context)

@login_required
def websig(request):
    wms = WebMapService(URL)
    list_produts = {}
    for name in wms.contents:
        layer = wms[name]
        if hasattr(layer, 'children') and layer.children:
            nomelayer=str(name).replace(" ","_")
            nomelayer=nomelayer.replace("-", "")
            list_produts[nomelayer]=[]
            #print(nomelayer)
            for sub in layer.children:
                name=WORKSPACE+":"+sub.name
                tupla=(name,sub.title)
                list_produts[nomelayer].append(tupla)

    layers = list_produts

    wms = WebMapService(URL2)
    list_produts = {}
    for name in wms.contents:
        layer = wms[name]
        if hasattr(layer, 'children') and layer.children:
            nomelayer=str(name).replace(" ","_")
            nomelayer=nomelayer.replace("-", "")
            list_produts[nomelayer]=[]
            #print(nomelayer)
            for sub in layer.children:
                name=WORKSPACE2+":"+sub.name
                tupla=(name,sub.title)
                list_produts[nomelayer].append(tupla)

    layers2 = list_produts
    layers2_json = {k: [list(t) for t in v] for k, v in layers2.items()}
    novo_geoserver_json = json.dumps(layers2_json, ensure_ascii=False, indent=2)
    #print(layers2)

   # print(layers)
    wms_link_download = "https://sistemas.itti.org.br/geoserver/Sanepar/ows?service=WFS&version=1.1.1&request=GetFeature&typeName="
    wms_link="https://sistemas.itti.org.br/geoserver/Sanepar/wms?"
    wms_link2="https://www.reservashidricasiguacu.com.br/geoserver/sanepar/wms?"


    return render(request, "mapas/websig3.html", {"layers":layers,"wms":wms_link,"link_download":wms_link_download,"layers2":layers2,"wms_link2":wms_link2, "novo_geoserver_json":novo_geoserver_json})

def streetview(request):
    context = {}
    return render(request, "mapas/streetview.html", context)


def panorama(request):
    context = {}
    return render(request, "mapas/panorama.html", context)

def view3601(request):
    context = {}
    return render(request, "mapas/view3601.html", context)


def view3602(request):
    context = {}
    return render(request, "mapas/view3602.html", context)

# Create your views here.
# def register_view(request):
#     if request.method == "POST": 
#         form = UserCreationForm(request.POST) 
#         if form.is_valid(): 
#             login(request, form.save())
#             return redirect("posts:list")
#     else:
#         form = UserCreationForm()
#     return render(request, "mapas/register.html", { "form": form })

# def login_view(request): 
#     if request.method == "POST": 
#         form = AuthenticationForm(data=request.POST)
#         if form.is_valid(): 
#             login(request, form.get_user())
#             context = {}
#             return render(request, "mapas/websig.html", context)
#     else: 
#         form = AuthenticationForm()
#     return render(request, "mapas/login.html", { "form": form })