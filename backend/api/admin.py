from django.contrib import admin
from .models import Cliente, Mockup


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'total_mockups', 'creado']
    search_fields = ['nombre']

    def total_mockups(self, obj):
        return obj.mockups.count()
    total_mockups.short_description = 'Mockups'


@admin.register(Mockup)
class MockupAdmin(admin.ModelAdmin):
    list_display = ['cliente', 'producto', 'color_producto', 'creado']
    list_filter = ['producto']
    search_fields = ['cliente__nombre']
