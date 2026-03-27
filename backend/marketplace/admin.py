from django.contrib import admin
from .models import Company, Job, Bid


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'company_type', 'user_email', 'jobs_or_bids_count', 'created_at']
    list_filter = ['company_type', 'created_at']
    search_fields = ['name', 'user__email', 'user__username']
    readonly_fields = ['created_at', 'updated_at']

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email'

    def jobs_or_bids_count(self, obj):
        if obj.is_client:
            count = obj.posted_jobs.count()
            return f'{count} job(s)'
        count = obj.submitted_bids.count()
        return f'{count} bid(s)'
    jobs_or_bids_count.short_description = 'Activity'


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'client', 'category', 'budget', 'deadline', 'status', 'bid_count', 'created_at']
    list_filter = ['status', 'category', 'deadline', 'created_at']
    search_fields = ['title', 'client__name']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    list_editable = ['status']

    def bid_count(self, obj):
        return obj.bids.count()
    bid_count.short_description = 'Bids'


@admin.register(Bid)
class BidAdmin(admin.ModelAdmin):
    list_display = ['vendor', 'job', 'amount', 'delivery_days', 'is_awarded', 'created_at']
    list_filter = ['is_awarded', 'created_at']
    search_fields = ['vendor__name', 'job__title']
    readonly_fields = ['created_at', 'updated_at']
