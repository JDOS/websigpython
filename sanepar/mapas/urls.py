from django.urls import path

from django.contrib.auth import views as auth_views
from . import views

app_name = "mapas"

urlpatterns = [
    path("", views.index, name="index"),
    path("websig/", views.websig, name="websig"),
    path("websig2/", views.websig2, name="websig2"),
    path("streetview/", views.streetview, name="streetview"),
    path("panorama/", views.panorama, name="panorama"),
    path("panorama/view3601", views.view3601, name="view3601"),
    path("panorama/view3602", views.view3602, name="view3602"),
 #   path('register/', views.register_view, name="register"),
 #   path('login/', views.login_view, name="login"),
	path('login/', auth_views.LoginView.as_view(), name='login'),
	#path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('logout/', auth_views.LogoutView.as_view(template_name='registration/logged_out.html',next_page='None', http_method_names = ['get', 'post', 'options']), name='logout'),


]