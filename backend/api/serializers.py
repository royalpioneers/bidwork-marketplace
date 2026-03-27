from rest_framework import serializers
from .models import Cliente, Mockup


class MockupSerializer(serializers.ModelSerializer):
    producto_display = serializers.CharField(source='get_producto_display', read_only=True)
    imagen_generada_url = serializers.SerializerMethodField()

    class Meta:
        model = Mockup
        fields = [
            'id', 'producto', 'producto_display', 'color_producto',
            'logo_escala', 'logo_opacidad', 'imagen_generada_url', 'creado'
        ]

    def get_imagen_generada_url(self, obj):
        if obj.imagen_generada:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.imagen_generada.url)
        return None


class ClienteSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    total_mockups = serializers.IntegerField(source='mockups.count', read_only=True)

    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'logo', 'logo_url', 'total_mockups', 'creado']
        extra_kwargs = {'logo': {'write_only': True, 'required': False}}

    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo.url)
        return None


class ClienteDetalleSerializer(ClienteSerializer):
    mockups = MockupSerializer(many=True, read_only=True)

    class Meta(ClienteSerializer.Meta):
        fields = ClienteSerializer.Meta.fields + ['mockups']
