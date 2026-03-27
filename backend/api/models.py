from django.db import models


class Cliente(models.Model):
    nombre = models.CharField(max_length=200)
    logo = models.ImageField(upload_to='logos/', null=True, blank=True)
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-creado']

    def __str__(self):
        return self.nombre


class Mockup(models.Model):
    PRODUCTOS = [
        ('tshirt', 'Camiseta'),
        ('mug', 'Taza'),
        ('cap', 'Gorra'),
        ('tote', 'Tote Bag'),
        ('pen', 'Bolígrafo'),
        ('notebook', 'Libreta'),
        ('hoodie', 'Sudadera'),
        ('usb', 'USB'),
    ]

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='mockups')
    producto = models.CharField(max_length=20, choices=PRODUCTOS)
    color_producto = models.CharField(max_length=7, default='#1a1a1a')
    logo_escala = models.FloatField(default=1.0)
    logo_opacidad = models.FloatField(default=1.0)
    imagen_generada = models.ImageField(upload_to='mockups/', null=True, blank=True)
    creado = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-creado']

    def __str__(self):
        return f'{self.cliente.nombre} - {self.get_producto_display()}'
