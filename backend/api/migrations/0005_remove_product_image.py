# Generated by Django 3.2.7 on 2021-10-13 20:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_product_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='image',
        ),
    ]
