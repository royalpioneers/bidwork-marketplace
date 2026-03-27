from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.core.exceptions import PermissionDenied
from django.db import transaction, IntegrityError
from django.views import View
from django.views.generic import TemplateView, ListView, DetailView
from .models import Company, Job, Bid
from .forms import CompanyRegistrationForm, JobForm, BidForm


# --- Access Control Mixins ---

class ClientRequiredMixin(LoginRequiredMixin):
    def dispatch(self, request, *args, **kwargs):
        if not hasattr(request.user, 'company') or not request.user.company.is_client:
            raise PermissionDenied
        return super().dispatch(request, *args, **kwargs)


class VendorRequiredMixin(LoginRequiredMixin):
    def dispatch(self, request, *args, **kwargs):
        if not hasattr(request.user, 'company') or not request.user.company.is_vendor:
            raise PermissionDenied
        return super().dispatch(request, *args, **kwargs)


# --- Public Views ---

class HomeView(TemplateView):
    template_name = 'marketplace/home.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['open_jobs_count'] = Job.objects.filter(status='open').count()
        ctx['total_companies'] = Company.objects.count()
        ctx['total_bids'] = Bid.objects.count()
        ctx['recent_jobs'] = Job.objects.filter(status='open').select_related('client')[:6]
        return ctx


class RegisterView(View):
    template_name = 'marketplace/auth/register.html'

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('marketplace:dashboard')
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        return render(request, self.template_name, {'form': CompanyRegistrationForm()})

    def post(self, request):
        form = CompanyRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, f'Welcome, {user.company.name}! Your account has been created.')
            return redirect('marketplace:dashboard')
        return render(request, self.template_name, {'form': form})


# --- Dashboard ---

class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'marketplace/dashboard.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        user = self.request.user
        if not hasattr(user, 'company'):
            return ctx
        company = user.company
        ctx['company'] = company
        if company.is_client:
            ctx['open_jobs'] = Job.objects.filter(client=company, status='open').count()
            ctx['awarded_jobs'] = Job.objects.filter(client=company, status='awarded').count()
            ctx['recent_jobs'] = Job.objects.filter(client=company).order_by('-created_at')[:5]
        else:
            ctx['active_bids'] = Bid.objects.filter(vendor=company, is_awarded=False).count()
            ctx['won_contracts'] = Bid.objects.filter(vendor=company, is_awarded=True).count()
            ctx['recent_bids'] = Bid.objects.filter(vendor=company).select_related('job').order_by('-created_at')[:5]
        return ctx


# --- Job Views ---

class JobListView(LoginRequiredMixin, ListView):
    model = Job
    template_name = 'marketplace/jobs/list.html'
    context_object_name = 'jobs'
    paginate_by = 12

    def get_queryset(self):
        qs = Job.objects.filter(status='open').select_related('client')
        category = self.request.GET.get('category')
        if category in ('merchandising', 'printing'):
            qs = qs.filter(category=category)
        min_budget = self.request.GET.get('min_budget')
        max_budget = self.request.GET.get('max_budget')
        if min_budget:
            try:
                qs = qs.filter(budget__gte=float(min_budget))
            except ValueError:
                pass
        if max_budget:
            try:
                qs = qs.filter(budget__lte=float(max_budget))
            except ValueError:
                pass
        return qs

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['selected_category'] = self.request.GET.get('category', '')
        ctx['min_budget'] = self.request.GET.get('min_budget', '')
        ctx['max_budget'] = self.request.GET.get('max_budget', '')
        if hasattr(self.request.user, 'company'):
            ctx['company'] = self.request.user.company
        return ctx


class JobDetailView(LoginRequiredMixin, DetailView):
    model = Job
    template_name = 'marketplace/jobs/detail.html'
    context_object_name = 'job'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        user = self.request.user
        job = self.get_object()
        if hasattr(user, 'company'):
            company = user.company
            ctx['company'] = company
            if company.is_vendor:
                ctx['existing_bid'] = Bid.objects.filter(job=job, vendor=company).first()
            if company.is_client and company == job.client:
                ctx['bids'] = job.bids.select_related('vendor').order_by('amount')
                ctx['is_owner'] = True
        return ctx


class JobCreateView(ClientRequiredMixin, View):
    template_name = 'marketplace/jobs/create.html'

    def get(self, request):
        return render(request, self.template_name, {'form': JobForm()})

    def post(self, request):
        form = JobForm(request.POST)
        if form.is_valid():
            job = form.save(commit=False)
            job.client = request.user.company
            job.save()
            messages.success(request, 'Job posted successfully! Vendors can now submit bids.')
            return redirect('marketplace:job_detail', pk=job.pk)
        return render(request, self.template_name, {'form': form})


class JobCloseView(ClientRequiredMixin, View):
    def post(self, request, pk):
        job = get_object_or_404(Job, pk=pk)
        if job.client != request.user.company:
            raise PermissionDenied
        if job.status == 'open':
            job.status = 'closed'
            job.save()
            messages.success(request, 'Job closed. No more bids will be accepted.')
        return redirect('marketplace:job_detail', pk=pk)


class AwardContractView(ClientRequiredMixin, View):
    def post(self, request, pk):
        job = get_object_or_404(Job, pk=pk)
        if job.client != request.user.company:
            raise PermissionDenied
        bid_id = request.POST.get('bid_id')
        bid = get_object_or_404(Bid, pk=bid_id, job=job)
        with transaction.atomic():
            bid.is_awarded = True
            bid.save()
            job.awarded_to = bid.vendor
            job.status = 'awarded'
            job.save()
        messages.success(request, f'Contract awarded to {bid.vendor.name}!')
        return redirect('marketplace:job_detail', pk=pk)


# --- Bid Views ---

class BidCreateView(VendorRequiredMixin, View):
    template_name = 'marketplace/bids/submit.html'

    def get(self, request, job_pk):
        job = get_object_or_404(Job, pk=job_pk, status='open')
        existing = Bid.objects.filter(job=job, vendor=request.user.company).first()
        if existing:
            messages.info(request, 'You have already submitted a bid for this job.')
            return redirect('marketplace:job_detail', pk=job_pk)
        return render(request, self.template_name, {'form': BidForm(), 'job': job})

    def post(self, request, job_pk):
        job = get_object_or_404(Job, pk=job_pk, status='open')
        form = BidForm(request.POST)
        if form.is_valid():
            try:
                bid = form.save(commit=False)
                bid.job = job
                bid.vendor = request.user.company
                bid.save()
                messages.success(request, 'Your bid has been submitted successfully!')
                return redirect('marketplace:job_detail', pk=job_pk)
            except IntegrityError:
                messages.error(request, 'You have already submitted a bid for this job.')
                return redirect('marketplace:job_detail', pk=job_pk)
        return render(request, self.template_name, {'form': form, 'job': job})


class MyBidsView(VendorRequiredMixin, ListView):
    template_name = 'marketplace/bids/my_bids.html'
    context_object_name = 'bids'

    def get_queryset(self):
        return Bid.objects.filter(vendor=self.request.user.company).select_related('job', 'job__client').order_by('-created_at')

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['company'] = self.request.user.company
        return ctx


class ClientJobsView(ClientRequiredMixin, ListView):
    template_name = 'marketplace/jobs/my_jobs.html'
    context_object_name = 'jobs'

    def get_queryset(self):
        return Job.objects.filter(client=self.request.user.company).order_by('-created_at')

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['company'] = self.request.user.company
        return ctx
