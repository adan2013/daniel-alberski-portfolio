## Interfejs do domu, z którego korzystam

Zaprojektowałem własny system zarządzania domem. Frontend w React działa na tablecie w trybie Fully Kiosk. Backend Node.js odpowiada za przepływ danych i logikę, a Home Assistant komunikuje się z fizycznymi urządzeniami.

Zależało mi na rozwiązaniu, którego mogę używać codziennie: stabilnym i łatwym w obsłudze z ekranu dotykowego. To wymagało myślenia o całym systemie, od interfejsu po integracje.

## Gdy automatyzacje przestają być proste

Początkowo korzystałem z Node-RED. Z czasem automatyzacje stały się zbyt złożone, dlatego przeniosłem logikę do własnego backendu. Home Assistant pozostawiłem głównie w roli warstwy komunikacji z urządzeniami.

Dzięki temu podział odpowiedzialności jest jasny: interfejs służy obsłudze domu, backend zawiera moją logikę, a Home Assistant łączy ją ze sprzętem.

[architecture]

## Codzienna obsługa i utrzymanie

Interfejs projektowałem z myślą o tablecie i Fully Kiosk. Nie jest osobnym pokazem wizualnym — stanowi część systemu, do którego wracam na co dzień.

Stabilność wspierają testy, logi zapisywane na wolumenie oraz monitoring backupów i kondycji sieci Zigbee. Utrzymanie jest tutaj częścią projektu, bo problemy z automatyzacją mają bezpośredni wpływ na korzystanie z domu.

[media:1]

## Rezultat: używany i rozwijany system

System jest aktywnie używany i nadal go rozwijam. Repozytoria frontendu i backendu są publiczne. To mój główny przykład budowania pełnego rozwiązania: od interfejsu w React, przez przepływ danych i logikę, po integrację z urządzeniami.
