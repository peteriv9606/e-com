from functools import partial
from django.contrib.auth.models import User
from django.shortcuts import get_list_or_404
from django.template.defaultfilters import urlize, urlizetrunc
from rest_framework import serializers
from core import settings
from .models import *

class FullUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ['id', 'username', 'email', 'date_joined']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email', 'is_active']
        read_only_fields = ['id']
        lookup_field = 'username'

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class SmallUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['image', 'product', 'is_main']
        extra_kwargs = {
            'product': {'required': False}
        }


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, required=False)
    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'images', 'price', 'quantity', 'active', 'slug', 'created_at', 'modified_at']
        read_only_fields = ['slug']
        #lookup_field = 'slug'


    def create(self, validated_data):        
        product = Product.objects.create(**validated_data)
        try:
            # try to get and save images (if any)
            images_data = dict((self.context['request'].FILES).lists()).get('images', None)
            for index, image in enumerate(images_data):
                if index == 0:
                    img = ProductImage.objects.create(product=product, image=image, is_main=True)
                else:
                    img = ProductImage.objects.create(product=product, image=image)
                img.save()
        except:
            # if no images are available - create using default image
            img = ProductImage.objects.create(product=product, is_main=True)
            img.save()

        return product

class SmallProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['title', 'price']
       
class OrderlineSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = Orderline
        fields = ['id', 'order', 'product', 'quantity', 'line_total']

class OrderSerializer(serializers.ModelSerializer):
    user = SmallUserSerializer()
    orderlines = OrderlineSerializer(many=True)    
    orderlines_count = serializers.SerializerMethodField()
    orderlines_price_total = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'modified_at', 'finished', 'orderlines', 'orderlines_count', 'orderlines_price_total']

    def get_orderlines_count(self, obj):
        return obj.orderlines.count()
    
    def get_orderlines_price_total(self, obj):
        orderlines = Orderline.objects.filter(order_id = obj.id)
        total = 0
        for line in orderlines:
            total = total + line.line_total
        return round(total, 2)