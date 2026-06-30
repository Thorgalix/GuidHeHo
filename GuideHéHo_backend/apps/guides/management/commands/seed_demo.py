from datetime import timedelta
from decimal import Decimal

from django.contrib.admin.models import LogEntry
from django.contrib.auth import get_user_model
from django.contrib.sessions.models import Session
from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Avg
from django.utils import timezone
from rest_framework_simplejwt.token_blacklist.models import (
    BlacklistedToken,
    OutstandingToken,
)

from apps.accounts.models import EmailVerification
from apps.bookings.models import Booking
from apps.guides.models import Availability, Guide, Language, Theme
from apps.messaging.models import ContactMessage
from apps.reviews.models import Review


class Command(BaseCommand):
    help = (
        "Clean local app data, keep protected accounts, and load demo data for "
        "GuideHeHo."
    )

    protected_email = "lucaspodevin@sfr.fr"
    demo_password = "DemoGuidheho2026!"

    def add_arguments(self, parser):
        parser.add_argument(
            "--yes",
            action="store_true",
            help="Confirm destructive cleanup before seeding demo data.",
        )

    def handle(self, *args, **options):
        if not options["yes"]:
            self.stderr.write(
                "This command deletes most app data. Re-run with --yes to confirm."
            )
            return

        with transaction.atomic():
            kept_users = self._clean_database()
            users = self._create_users(kept_users)
            languages, themes = self._create_catalog()
            guides = self._create_guides(users, languages, themes)
            availabilities = self._create_availabilities(guides)
            bookings = self._create_bookings(users, guides, availabilities)
            self._create_reviews(users, guides, bookings)
            self._create_favorites(users, guides)
            self._create_messages(users, guides)
            self._create_verification_codes()
            self._refresh_ratings()

        self.stdout.write(self.style.SUCCESS("Demo database is ready."))
        self.stdout.write(
            f"Protected account kept: {self.protected_email} "
            f"(password unchanged if it already existed)."
        )
        self.stdout.write(
            f"Demo accounts password: {self.demo_password}"
        )

    def _clean_database(self):
        User = get_user_model()
        kept_users = list(
            User.objects.filter(is_superuser=True)
            | User.objects.filter(email__iexact=self.protected_email)
        )

        protected_ids = [user.id for user in kept_users]

        ContactMessage.objects.all().delete()
        Review.objects.all().delete()
        Booking.objects.all().delete()
        Availability.objects.all().delete()
        Guide.objects.all().delete()
        Theme.objects.all().delete()
        Language.objects.all().delete()
        EmailVerification.objects.exclude(user_id__in=protected_ids).delete()
        User.objects.exclude(id__in=protected_ids).delete()
        LogEntry.objects.all().delete()
        Session.objects.all().delete()
        BlacklistedToken.objects.all().delete()
        OutstandingToken.objects.all().delete()

        return {user.email.lower(): user for user in kept_users}

    def _create_users(self, kept_users):
        User = get_user_model()

        lucas = kept_users.get(self.protected_email.lower())
        if lucas is None:
            lucas = User.objects.create_user(
                email=self.protected_email,
                password=self.demo_password,
                first_name="Lucas",
                last_name="Podevin",
                role="traveler",
                is_verified=True,
            )
        else:
            updates = []
            if not lucas.first_name:
                lucas.first_name = "Lucas"
                updates.append("first_name")
            if not lucas.last_name:
                lucas.last_name = "Podevin"
                updates.append("last_name")
            if not lucas.is_verified:
                lucas.is_verified = True
                updates.append("is_verified")
            if updates:
                lucas.save(update_fields=updates)

        guide_users = [
            ("claire.martin", "Claire", "Martin"),
            ("mehdi.benali", "Mehdi", "Benali"),
            ("sofia.rossi", "Sofia", "Rossi"),
            ("antoine.bernard", "Antoine", "Bernard"),
            ("camille.petit", "Camille", "Petit"),
            ("youssef.amrani", "Youssef", "Amrani"),
            ("lea.garnier", "Lea", "Garnier"),
            ("hugo.moretti", "Hugo", "Moretti"),
            ("maria.santos", "Maria", "Santos"),
            ("julien.dubois", "Julien", "Dubois"),
            ("amina.diop", "Amina", "Diop"),
            ("paul.fournier", "Paul", "Fournier"),
            ("elena.petrov", "Elena", "Petrov"),
            ("maxime.laurent", "Maxime", "Laurent"),
            ("nora.mercier", "Nora", "Mercier"),
            ("thomas.rolland", "Thomas", "Rolland"),
            ("chloe.renard", "Chloe", "Renard"),
            ("samir.khaled", "Samir", "Khaled"),
            ("alice.brun", "Alice", "Brun"),
            ("victor.noel", "Victor", "Noel"),
            ("laura.costa", "Laura", "Costa"),
            ("quentin.robert", "Quentin", "Robert"),
            ("sarah.nguyen", "Sarah", "Nguyen"),
            ("enzo.martinez", "Enzo", "Martinez"),
            ("manon.leclerc", "Manon", "Leclerc"),
            ("gabriel.perrin", "Gabriel", "Perrin"),
            ("fatima.ait", "Fatima", "Ait"),
            ("adrien.morel", "Adrien", "Morel"),
            ("eva.schmitt", "Eva", "Schmitt"),
            ("romain.girard", "Romain", "Girard"),
        ]
        traveler_users = [
            ("emma.durand", "Emma", "Durand"),
            ("nathan.moreau", "Nathan", "Moreau"),
            ("ines.leroy", "Ines", "Leroy"),
            ("jade.picard", "Jade", "Picard"),
            ("mathis.colin", "Mathis", "Colin"),
            ("lina.roy", "Lina", "Roy"),
            ("oscar.boyer", "Oscar", "Boyer"),
            ("zoe.riviere", "Zoe", "Riviere"),
            ("yanis.blanc", "Yanis", "Blanc"),
            ("anna.muller", "Anna", "Muller"),
        ]

        users = {"lucas": lucas}
        for username, first_name, last_name in guide_users:
            user = User.objects.create_user(
                email=f"{username}.demo@guidheho.local",
                password=self.demo_password,
                first_name=first_name,
                last_name=last_name,
                role="guide",
                is_verified=True,
            )
            users[first_name.lower()] = user

        for username, first_name, last_name in traveler_users:
            user = User.objects.create_user(
                email=f"{username}.demo@guidheho.local",
                password=self.demo_password,
                first_name=first_name,
                last_name=last_name,
                role="traveler",
                is_verified=True,
            )
            users[first_name.lower()] = user

        return users

    def _create_catalog(self):
        languages = {
            name: Language.objects.create(name=name)
            for name in [
                "Francais",
                "Anglais",
                "Espagnol",
                "Italien",
                "Arabe",
                "Allemand",
                "Portugais",
                "Neerlandais",
                "Japonais",
                "Coreen",
                "Chinois",
                "Russe",
                "Turc",
                "Polonais",
            ]
        }
        themes = {
            name: Theme.objects.create(name=name)
            for name in [
                "Patrimoine",
                "Gastronomie",
                "Street art",
                "Nature",
                "Famille",
                "Photographie",
                "Architecture",
                "Musees",
                "Vie nocturne",
                "Shopping local",
                "Histoire",
                "Randonnee",
                "Bord de mer",
                "Vignobles",
                "Marche local",
                "Artisanat",
                "Cinema",
                "Musique",
                "Bien-etre",
                "Sport",
            ]
        }
        return languages, themes

    def _create_guides(self, users, languages, themes):
        guide_specs = [
            ("claire", "Paris", "48.856613", "2.352222", "38.00", ["Francais", "Anglais", "Espagnol"], ["Patrimoine", "Gastronomie", "Photographie"]),
            ("mehdi", "Marseille", "43.296482", "5.369780", "32.00", ["Francais", "Anglais", "Arabe"], ["Street art", "Nature", "Famille"]),
            ("sofia", "Lyon", "45.764043", "4.835659", "35.00", ["Francais", "Italien", "Anglais"], ["Patrimoine", "Gastronomie", "Famille"]),
            ("antoine", "Bordeaux", "44.837789", "-0.579180", "42.00", ["Francais", "Anglais", "Allemand"], ["Vignobles", "Architecture", "Gastronomie"]),
            ("camille", "Lille", "50.629250", "3.057256", "29.00", ["Francais", "Anglais", "Neerlandais"], ["Musees", "Patrimoine", "Marche local"]),
            ("youssef", "Toulouse", "43.604652", "1.444209", "34.00", ["Francais", "Arabe", "Espagnol"], ["Architecture", "Histoire", "Gastronomie"]),
            ("lea", "Nantes", "47.218371", "-1.553621", "31.00", ["Francais", "Anglais"], ["Artisanat", "Famille", "Nature"]),
            ("hugo", "Strasbourg", "48.573405", "7.752111", "36.00", ["Francais", "Allemand", "Anglais"], ["Patrimoine", "Marche local", "Architecture"]),
            ("maria", "Nice", "43.710173", "7.261953", "40.00", ["Francais", "Italien", "Portugais"], ["Bord de mer", "Photographie", "Gastronomie"]),
            ("julien", "Montpellier", "43.610769", "3.876716", "30.00", ["Francais", "Anglais", "Espagnol"], ["Street art", "Vie nocturne", "Architecture"]),
            ("amina", "Rennes", "48.117266", "-1.677793", "28.00", ["Francais", "Arabe", "Anglais"], ["Histoire", "Musees", "Shopping local"]),
            ("paul", "Dijon", "47.322047", "5.041480", "33.00", ["Francais", "Anglais"], ["Vignobles", "Gastronomie", "Patrimoine"]),
            ("elena", "Grenoble", "45.188529", "5.724524", "37.00", ["Francais", "Russe", "Anglais"], ["Randonnee", "Nature", "Sport"]),
            ("maxime", "Annecy", "45.899247", "6.129384", "39.00", ["Francais", "Anglais", "Allemand"], ["Nature", "Bord de mer", "Photographie"]),
            ("nora", "Avignon", "43.949317", "4.805528", "35.00", ["Francais", "Espagnol", "Anglais"], ["Patrimoine", "Cinema", "Histoire"]),
            ("thomas", "Tours", "47.394144", "0.684840", "31.00", ["Francais", "Anglais"], ["Vignobles", "Patrimoine", "Famille"]),
            ("chloe", "Biarritz", "43.483152", "-1.558626", "41.00", ["Francais", "Espagnol", "Anglais"], ["Bord de mer", "Sport", "Bien-etre"]),
            ("samir", "Saint-Malo", "48.649337", "-2.025674", "34.00", ["Francais", "Arabe", "Anglais"], ["Bord de mer", "Histoire", "Photographie"]),
            ("alice", "Reims", "49.258329", "4.031696", "36.00", ["Francais", "Anglais", "Allemand"], ["Vignobles", "Architecture", "Patrimoine"]),
            ("victor", "Rouen", "49.443232", "1.099971", "30.00", ["Francais", "Anglais"], ["Histoire", "Architecture", "Musees"]),
            ("laura", "Aix-en-Provence", "43.529742", "5.447427", "38.00", ["Francais", "Italien", "Anglais"], ["Marche local", "Artisanat", "Gastronomie"]),
            ("quentin", "La Rochelle", "46.160329", "-1.151139", "33.00", ["Francais", "Anglais", "Neerlandais"], ["Bord de mer", "Famille", "Nature"]),
            ("sarah", "Colmar", "48.079358", "7.358512", "35.00", ["Francais", "Allemand", "Anglais"], ["Patrimoine", "Photographie", "Marche local"]),
            ("enzo", "Cannes", "43.552847", "7.017369", "45.00", ["Francais", "Italien", "Anglais"], ["Cinema", "Vie nocturne", "Bord de mer"]),
            ("manon", "Clermont-Ferrand", "45.777222", "3.087025", "29.00", ["Francais", "Anglais"], ["Randonnee", "Nature", "Histoire"]),
            ("gabriel", "Nancy", "48.692054", "6.184417", "30.00", ["Francais", "Allemand", "Polonais"], ["Architecture", "Musees", "Artisanat"]),
            ("fatima", "Nimes", "43.836699", "4.360054", "32.00", ["Francais", "Arabe", "Espagnol"], ["Histoire", "Patrimoine", "Famille"]),
            ("adrien", "Metz", "49.119309", "6.175716", "31.00", ["Francais", "Allemand", "Anglais"], ["Musees", "Architecture", "Shopping local"]),
            ("eva", "Perpignan", "42.688659", "2.894833", "30.00", ["Francais", "Espagnol", "Anglais"], ["Marche local", "Bord de mer", "Gastronomie"]),
            ("romain", "Ajaccio", "41.919229", "8.738635", "44.00", ["Francais", "Italien", "Anglais"], ["Nature", "Bord de mer", "Randonnee"]),
        ]

        guides = {}
        for key, city, latitude, longitude, price, guide_languages, guide_themes in guide_specs:
            user = users[key]
            guide = Guide.objects.create(
                user=user,
                city=city,
                latitude=Decimal(latitude),
                longitude=Decimal(longitude),
                price_per_hour=Decimal(price),
                bio=(
                    f"{user.first_name} connait {city} comme son quartier et "
                    "prepare des visites adaptees au rythme, aux centres "
                    "d'interet et au niveau de curiosite de chaque groupe."
                ),
            )
            guide.languages.set(languages[name] for name in guide_languages)
            guide.themes.set(themes[name] for name in guide_themes)
            guides[key] = guide

        return guides

    def _create_availabilities(self, guides):
        now = timezone.now().replace(minute=0, second=0, microsecond=0)
        availabilities = {}
        for index, (key, guide) in enumerate(guides.items()):
            created = []
            guide_slots = [
                (1 + index % 5, 9, 11, 4 + index % 3, True),
                (3 + index % 7, 14, 17, 5 + index % 4, True),
                (8 + index % 9, 10, 13, 3 + index % 5, True),
                (14 + index % 11, 16, 18, 4 + index % 4, True),
                (21 + index % 13, 9, 12, 6 + index % 3, True),
                (-2 - index % 8, 10, 12, 2 + index % 4, False),
            ]
            for day_offset, start_hour, end_hour, max_people, is_available in guide_slots:
                day = now + timedelta(days=day_offset)
                start = day.replace(hour=start_hour)
                end = day.replace(hour=end_hour)
                created.append(
                    Availability.objects.create(
                        guide=guide,
                        start_datetime=start,
                        end_datetime=end,
                        max_people=max_people,
                        is_available=is_available,
                    )
                )
            availabilities[key] = created

        return availabilities

    def _create_bookings(self, users, guides, availabilities):
        traveler_keys = [
            "lucas",
            "emma",
            "nathan",
            "ines",
            "jade",
            "mathis",
            "lina",
            "oscar",
            "zoe",
            "yanis",
            "anna",
        ]
        statuses = ["accepted", "accepted", "pending", "accepted", "cancelled"]

        bookings = []
        for index, (key, guide) in enumerate(guides.items()):
            traveler = users[traveler_keys[index % len(traveler_keys)]]
            status = statuses[index % len(statuses)]
            availability = availabilities[key][index % 5]
            if status == "accepted":
                availability.is_available = False
                availability.save(update_fields=["is_available"])
            bookings.append(
                Booking.objects.create(
                    traveler=traveler,
                    guide=guide,
                    availability=availability,
                    Booking_date=availability.start_datetime.date(),
                    number_of_people=2 + index % 4,
                    status=status,
                    message=(
                        "Bonjour, nous preparons une visite pour notre sejour "
                        "et aimerions un parcours local et facile a suivre."
                    ),
                )
            )
        return bookings

    def _create_reviews(self, users, guides, bookings):
        comments = [
            "Visite tres claire, beaucoup d'adresses faciles a refaire ensuite.",
            "Excellent rythme et vraie connaissance du terrain.",
            "Une sortie chaleureuse avec des anecdotes utiles pour comprendre la ville.",
            "Guide ponctuel, flexible et tres attentif au groupe.",
            "Parcours original, parfait pour sortir des circuits trop classiques.",
        ]

        accepted_bookings = [booking for booking in bookings if booking.status == "accepted"]
        for index, booking in enumerate(accepted_bookings):
            Review.objects.create(
                traveler=booking.traveler,
                guide=booking.guide,
                rating=4 + index % 2,
                comment=comments[index % len(comments)],
            )

    def _create_favorites(self, users, guides):
        traveler_keys = ["lucas", "emma", "nathan", "ines", "jade", "mathis", "lina", "zoe"]
        guide_items = list(guides.items())
        for index, (_, guide) in enumerate(guide_items):
            guide.favorites.add(users[traveler_keys[index % len(traveler_keys)]])
            if index % 3 == 0:
                guide.favorites.add(users[traveler_keys[(index + 2) % len(traveler_keys)]])

    def _create_messages(self, users, guides):
        traveler_keys = ["lucas", "emma", "nathan", "ines", "jade", "mathis", "lina", "oscar"]
        for index, (_, guide) in enumerate(list(guides.items())[:16]):
            sender = users[traveler_keys[index % len(traveler_keys)]]
            message = (
                f"Bonjour {guide.user.first_name}, votre visite a {guide.city} "
                "nous interesse. Pouvez-vous adapter le parcours a un petit groupe ?"
            )
            ContactMessage.objects.create(
                sender=sender,
                receiver=guide.user,
                message=message,
                status="read" if index % 4 == 0 else "sent",
            )

    def _create_verification_codes(self):
        User = get_user_model()
        for user in User.objects.filter(is_superuser=False):
            EmailVerification.objects.update_or_create(
                user=user,
                defaults={"code": "123456"},
            )

    def _refresh_ratings(self):
        for guide in Guide.objects.all():
            average = guide.reviews.aggregate(avg=Avg("rating"))["avg"] or 0
            guide.average_rating = round(average, 1)
            guide.save(update_fields=["average_rating"])
