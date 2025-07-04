from django.db import models

class Umfrage(models.Model):
    name = models.CharField(max_length=255)
    end_date = models.DateField()