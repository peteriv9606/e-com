# Generated by Django 3.2.7 on 2021-10-14 11:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_productimage'),
    ]

    operations = [
        migrations.AddField(
            model_name='productimage',
            name='is_main',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]
