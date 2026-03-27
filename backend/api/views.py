import base64
from django.core.files.base import ContentFile
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Cliente, Mockup
from .serializers import ClienteSerializer, ClienteDetalleSerializer, MockupSerializer


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ClienteDetalleSerializer
        return ClienteSerializer

    def get_serializer_context(self):
        return {'request': self.request}

    @action(detail=True, methods=['post'], url_path='upload-logo')
    def upload_logo(self, request, pk=None):
        cliente = self.get_object()
        logo_data = request.data.get('logo_base64')
        if not logo_data:
            return Response({'error': 'No se proporcionó imagen'}, status=status.HTTP_400_BAD_REQUEST)

        if ',' in logo_data:
            logo_data = logo_data.split(',')[1]

        ext = request.data.get('ext', 'png')
        image_data = base64.b64decode(logo_data)
        cliente.logo.save(f'logo_{cliente.id}.{ext}', ContentFile(image_data), save=True)

        serializer = ClienteSerializer(cliente, context={'request': request})
        return Response(serializer.data)


class MockupViewSet(viewsets.ModelViewSet):
    queryset = Mockup.objects.select_related('cliente').all()
    serializer_class = MockupSerializer

    def get_serializer_context(self):
        return {'request': self.request}

    def create(self, request, *args, **kwargs):
        cliente_id = request.data.get('cliente_id')
        if not cliente_id:
            return Response({'error': 'cliente_id es requerido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cliente = Cliente.objects.get(pk=cliente_id)
        except Cliente.DoesNotExist:
            return Response({'error': 'Cliente no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        mockup = Mockup.objects.create(
            cliente=cliente,
            producto=request.data.get('producto', 'tshirt'),
            color_producto=request.data.get('color_producto', '#1a1a1a'),
            logo_escala=float(request.data.get('logo_escala', 1.0)),
            logo_opacidad=float(request.data.get('logo_opacidad', 1.0)),
        )

        imagen_base64 = request.data.get('imagen_base64')
        if imagen_base64:
            if ',' in imagen_base64:
                imagen_base64 = imagen_base64.split(',')[1]
            image_data = base64.b64decode(imagen_base64)
            filename = f'mockup_{mockup.id}_{mockup.producto}.png'
            mockup.imagen_generada.save(filename, ContentFile(image_data), save=True)

        serializer = MockupSerializer(mockup, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
