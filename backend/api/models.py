from django.db import models
from django.contrib.auth.models import User
from django.template.defaultfilters import slugify

def upload_to(instance, filename):
    return 'products/{filename}'.format(filename=filename)

class Product(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    price = models.FloatField()
    quantity = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=False)
    slug = models.SlugField(max_length=255, unique=True)
    

    def __str__(self):
        return self.slug

    def save(self, *args, **kwargs):
        if not self.id:
            try:
                last_id = Product.objects.all().last().id
            except:
                last_id = 0
            slugify_me = (self.title + " " + str(last_id + 1))
            self.slug = slugify(slugify_me)  

        super(Product, self).save(*args, **kwargs)

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='user', default=1)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    modified_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    finished = models.BooleanField(default=False, null=True, blank=True)

    def __str__(self):
        return f"Order of user {self.user.username} | {self.modified_at}"

class Orderline(models.Model):
    order = models.ForeignKey(Order, on_delete=models.PROTECT, related_name='orderlines')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.IntegerField(default=1)
    line_total = models.FloatField(null=True)

    def __str__(self):
        return str(self.id)

    def save(self, *args, **kwargs):
        if self.quantity is None:
            self.quantity = 1 
        self.line_total = round(Product.objects.get(slug = self.product).price * self.quantity, 2)
        super(Orderline, self).save(*args, **kwargs)

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField("Image", upload_to=upload_to, default='products/default.png')
    is_main = models.BooleanField(default=False)