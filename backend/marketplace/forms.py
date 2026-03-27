from django import forms
from django.contrib.auth.models import User
from django.db import transaction
from .models import Company, Job, Bid


class CompanyRegistrationForm(forms.Form):
    username = forms.CharField(
        max_length=150,
        widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Username'})
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'class': 'form-input', 'placeholder': 'email@company.com'})
    )
    password1 = forms.CharField(
        label='Password',
        widget=forms.PasswordInput(attrs={'class': 'form-input', 'placeholder': '••••••••'})
    )
    password2 = forms.CharField(
        label='Confirm Password',
        widget=forms.PasswordInput(attrs={'class': 'form-input', 'placeholder': '••••••••'})
    )
    company_name = forms.CharField(
        max_length=200,
        widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Your Company Name'})
    )
    company_type = forms.ChoiceField(
        choices=Company.COMPANY_TYPE_CHOICES,
        widget=forms.RadioSelect()
    )
    description = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={'class': 'form-input', 'rows': 3, 'placeholder': 'Brief description of your company...'})
    )
    phone = forms.CharField(
        max_length=30, required=False,
        widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': '+1 (555) 000-0000'})
    )
    website = forms.URLField(
        required=False,
        widget=forms.URLInput(attrs={'class': 'form-input', 'placeholder': 'https://yourcompany.com'})
    )

    def clean_username(self):
        username = self.cleaned_data['username']
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError('This username is already taken.')
        return username

    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError('An account with this email already exists.')
        return email

    def clean(self):
        cleaned_data = super().clean()
        p1 = cleaned_data.get('password1')
        p2 = cleaned_data.get('password2')
        if p1 and p2 and p1 != p2:
            raise forms.ValidationError('Passwords do not match.')
        return cleaned_data

    @transaction.atomic
    def save(self):
        data = self.cleaned_data
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password1'],
        )
        Company.objects.create(
            user=user,
            name=data['company_name'],
            company_type=data['company_type'],
            description=data.get('description', ''),
            phone=data.get('phone', ''),
            website=data.get('website', ''),
        )
        return user


class JobForm(forms.ModelForm):
    class Meta:
        model = Job
        fields = ['title', 'category', 'description', 'requirements', 'budget', 'deadline']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'e.g. 500 Custom T-Shirts for Trade Show'}),
            'category': forms.Select(attrs={'class': 'form-input'}),
            'description': forms.Textarea(attrs={'class': 'form-input', 'rows': 5, 'placeholder': 'Describe the work in detail...'}),
            'requirements': forms.Textarea(attrs={'class': 'form-input', 'rows': 4, 'placeholder': 'Colors, sizes, materials, file formats, quantity...'}),
            'budget': forms.NumberInput(attrs={'class': 'form-input', 'placeholder': '0.00', 'step': '0.01', 'min': '0'}),
            'deadline': forms.DateInput(attrs={'class': 'form-input', 'type': 'date'}),
        }


class BidForm(forms.ModelForm):
    class Meta:
        model = Bid
        fields = ['amount', 'delivery_days', 'notes']
        widgets = {
            'amount': forms.NumberInput(attrs={'class': 'form-input', 'placeholder': '0.00', 'step': '0.01', 'min': '0'}),
            'delivery_days': forms.NumberInput(attrs={'class': 'form-input', 'placeholder': 'e.g. 10', 'min': '1'}),
            'notes': forms.Textarea(attrs={'class': 'form-input', 'rows': 5, 'placeholder': 'Describe your approach, qualifications, and any relevant experience...'}),
        }
