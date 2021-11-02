from django.contrib import admin

from api.models import *

class ProductImageAdmin(admin.StackedInline):
    model = ProductImage

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    #list_display = ('title', 'description', 'price', 'active', 'slug', 'images')
    prepopulated_fields = {'slug': ('title',),}
    inlines = [ProductImageAdmin]
    
    class Meta:
        model=Product
        
@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    pass

admin.site.register(Order)
admin.site.register(Orderline)

