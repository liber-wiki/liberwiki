# Generated by Django 5.1 on 2024-10-26 17:22

import uuid

import django.db.models.deletion
import django.utils.timezone
import django_lifecycle.mixins
import pgtrigger.compiler
import pgtrigger.migrations
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0011_rename_voteevent_entryvoteevent_entryvote_and_more"),
        ("pghistory", "0006_delete_aggregateevent"),
    ]

    operations = [
        migrations.CreateModel(
            name="TitleBookmark",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="Unique identifier for this object",
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(
                        db_index=True,
                        default=django.utils.timezone.now,
                        editable=False,
                        help_text="Date and time this object was created",
                    ),
                ),
                (
                    "updated_at",
                    models.DateTimeField(
                        auto_now=True, db_index=True, help_text="Date and time this object was last updated"
                    ),
                ),
                (
                    "title",
                    models.ForeignKey(
                        help_text="Title that was bookmarked.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="title_bookmark",
                        to="core.title",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        help_text="User who bookmarked.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="title_bookmarks",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "Title Bookmark",
                "verbose_name_plural": "Title Bookmarks",
            },
            bases=(django_lifecycle.mixins.LifecycleModelMixin, models.Model),
        ),
        migrations.CreateModel(
            name="TitleBookmarkEvent",
            fields=[
                ("pgh_id", models.AutoField(primary_key=True, serialize=False)),
                ("pgh_created_at", models.DateTimeField(auto_now_add=True)),
                ("pgh_label", models.TextField(help_text="The event label.")),
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="Unique identifier for this object",
                        serialize=False,
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(
                        default=django.utils.timezone.now,
                        editable=False,
                        help_text="Date and time this object was created",
                    ),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True, help_text="Date and time this object was last updated"),
                ),
                (
                    "pgh_context",
                    models.ForeignKey(
                        db_constraint=False,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        to="pghistory.context",
                    ),
                ),
                (
                    "pgh_obj",
                    models.ForeignKey(
                        db_constraint=False,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="events",
                        to="core.titlebookmark",
                    ),
                ),
                (
                    "title",
                    models.ForeignKey(
                        db_constraint=False,
                        help_text="Title that was bookmarked.",
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        related_query_name="+",
                        to="core.title",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        db_constraint=False,
                        help_text="User who bookmarked.",
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        related_query_name="+",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.AddConstraint(
            model_name="titlebookmark",
            constraint=models.UniqueConstraint(fields=("user", "title"), name="unique_user_title_bookmark"),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="titlebookmark",
            trigger=pgtrigger.compiler.Trigger(
                name="insert_insert",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    func='INSERT INTO "core_titlebookmarkevent" ("created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "title_id", "updated_at", "user_id") VALUES (NEW."created_at", NEW."id", _pgh_attach_context(), NOW(), \'insert\', NEW."id", NEW."title_id", NEW."updated_at", NEW."user_id"); RETURN NULL;',
                    hash="61f5a36c0ecf4d41fb166195078a3112ec359e4c",
                    operation="INSERT",
                    pgid="pgtrigger_insert_insert_d0925",
                    table="core_titlebookmark",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="titlebookmark",
            trigger=pgtrigger.compiler.Trigger(
                name="update_update",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    condition="WHEN (OLD.* IS DISTINCT FROM NEW.*)",
                    func='INSERT INTO "core_titlebookmarkevent" ("created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "title_id", "updated_at", "user_id") VALUES (NEW."created_at", NEW."id", _pgh_attach_context(), NOW(), \'update\', NEW."id", NEW."title_id", NEW."updated_at", NEW."user_id"); RETURN NULL;',
                    hash="c1345fc0ee711214c1fabaa858dfa4f303dadfc4",
                    operation="UPDATE",
                    pgid="pgtrigger_update_update_884d3",
                    table="core_titlebookmark",
                    when="AFTER",
                ),
            ),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name="titlebookmark",
            trigger=pgtrigger.compiler.Trigger(
                name="delete_delete",
                sql=pgtrigger.compiler.UpsertTriggerSql(
                    func='INSERT INTO "core_titlebookmarkevent" ("created_at", "id", "pgh_context_id", "pgh_created_at", "pgh_label", "pgh_obj_id", "title_id", "updated_at", "user_id") VALUES (OLD."created_at", OLD."id", _pgh_attach_context(), NOW(), \'delete\', OLD."id", OLD."title_id", OLD."updated_at", OLD."user_id"); RETURN NULL;',
                    hash="3b1dd2bc05c6ae8573ed547438eb7eeea62c6116",
                    operation="DELETE",
                    pgid="pgtrigger_delete_delete_c0a10",
                    table="core_titlebookmark",
                    when="AFTER",
                ),
            ),
        ),
    ]