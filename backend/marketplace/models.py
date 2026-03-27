from django.db import models
from django.contrib.auth.models import User


class Company(models.Model):
    COMPANY_TYPE_CHOICES = [
        ('client', 'Client'),
        ('vendor', 'Vendor'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='company')
    name = models.CharField(max_length=200)
    company_type = models.CharField(max_length=10, choices=COMPANY_TYPE_CHOICES)
    description = models.TextField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    website = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Companies'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} ({self.get_company_type_display()})'

    @property
    def is_client(self):
        return self.company_type == 'client'

    @property
    def is_vendor(self):
        return self.company_type == 'vendor'


class Job(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('awarded', 'Awarded'),
    ]
    CATEGORY_CHOICES = [
        ('merchandising', 'Merchandising'),
        ('printing', 'Printing'),
    ]

    client = models.ForeignKey(
        Company, on_delete=models.CASCADE,
        related_name='posted_jobs',
        limit_choices_to={'company_type': 'client'}
    )
    title = models.CharField(max_length=300)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField()
    requirements = models.TextField(blank=True, help_text='Specific technical requirements or specs')
    budget = models.DecimalField(max_digits=12, decimal_places=2)
    deadline = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    awarded_to = models.ForeignKey(
        Company, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='awarded_jobs',
        limit_choices_to={'company_type': 'vendor'}
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} - {self.client.name}'

    def get_absolute_url(self):
        from django.urls import reverse
        return reverse('marketplace:job_detail', kwargs={'pk': self.pk})

    @property
    def is_open(self):
        return self.status == 'open'

    @property
    def bid_count(self):
        return self.bids.count()


class Bid(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='bids')
    vendor = models.ForeignKey(
        Company, on_delete=models.CASCADE,
        related_name='submitted_bids',
        limit_choices_to={'company_type': 'vendor'}
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    notes = models.TextField(help_text='Describe your approach, timeline, and qualifications')
    delivery_days = models.PositiveIntegerField(help_text='Estimated delivery in business days')
    is_awarded = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['amount']
        unique_together = [('job', 'vendor')]

    def __str__(self):
        return f'{self.vendor.name} on {self.job.title} - ${self.amount}'
