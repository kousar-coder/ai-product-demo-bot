# Generated by Django 5.2.4 on 2025-07-12 15:54

import django.core.validators
import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DemoSession',
            fields=[
                ('session_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('started_at', models.DateTimeField(auto_now_add=True)),
                ('ended_at', models.DateTimeField(blank=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name': 'Demo Session',
                'verbose_name_plural': 'Demo Sessions',
                'ordering': ['-started_at'],
            },
        ),
        migrations.CreateModel(
            name='CommandLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('command_text', models.TextField(validators=[django.core.validators.MinLengthValidator(1, 'Command cannot be empty')])),
                ('response', models.TextField()),
                ('is_ai_response', models.BooleanField(default=False)),
                ('processing_time_ms', models.IntegerField(blank=True, null=True)),
                ('session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='commands', to='backend.demosession')),
            ],
            options={
                'verbose_name': 'Command Log',
                'verbose_name_plural': 'Command Logs',
                'ordering': ['timestamp'],
            },
        ),
    ]
