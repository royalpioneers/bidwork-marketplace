from django.urls import path
from . import views

app_name = 'marketplace'

urlpatterns = [
    path('', views.HomeView.as_view(), name='home'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),

    # Jobs
    path('jobs/', views.JobListView.as_view(), name='job_list'),
    path('jobs/create/', views.JobCreateView.as_view(), name='job_create'),
    path('jobs/<int:pk>/', views.JobDetailView.as_view(), name='job_detail'),
    path('jobs/<int:pk>/close/', views.JobCloseView.as_view(), name='job_close'),
    path('jobs/<int:pk>/award/', views.AwardContractView.as_view(), name='award_contract'),
    path('my-jobs/', views.ClientJobsView.as_view(), name='client_jobs'),

    # Bids
    path('jobs/<int:job_pk>/bid/', views.BidCreateView.as_view(), name='bid_create'),
    path('my-bids/', views.MyBidsView.as_view(), name='my_bids'),
]
