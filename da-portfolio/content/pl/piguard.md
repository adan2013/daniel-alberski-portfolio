## Alarm do codziennego działania

Chciałem zbudować prywatną centralkę alarmową opartą na Raspberry Pi. Jej zadanie jest proste: odbierać stan czujek i wysyłać alerty SMS przez modem USB GSM. Ważniejsze od liczby funkcji było dla mnie stabilne działanie przez długi czas.

To był mój pierwszy duży projekt elektroniczny z obudową wydrukowaną w 3D. Musiałem połączyć elektronikę, komunikację z modemem i oprogramowanie w urządzenie, które będzie pracowało bez ciągłego doglądania.

## Modem: komendy AT i skąpa dokumentacja

Obsługa modemu wymagała pracy z komendami AT oraz odblokowywania modemów Huawei. Dokumentacja była skąpa. W tym obszarze korzystałem ze wsparcia AI: przy przygotowaniu obsługi modemu, konfiguracji Linuxa i budowie panelu HTML.

Główne oprogramowanie napisałem w Node.js, z dodatkiem Pythona. Wsparcie AI pozwoliło mi poświęcić więcej uwagi elektronice i wykonaniu obudowy. Podobnie jak w Gauge Generatorze było istotną częścią pracy nad projektem, a nie pojedynczym eksperymentem.

[media:1]

## Konfiguracja bez otwierania obudowy

Panel webowy jest dostępny przez hotspot Raspberry Pi. Pozwala między innymi skonfigurować numery telefonu i sprawdzić stan czujek. Logi gromadzę w pamięci i udostępniam przez ten sam interfejs. Dzięki temu mogę zobaczyć, co dzieje się w urządzeniu, bez zaglądania do jego wnętrza.

[media:2]

## Rezultat: dziesiątki dni bez przerwy

Alarm nadal działa i wysyła alerty, pracując dziesiątki dni bez przerwy. To dla mnie najważniejszy rezultat: połączenie kilku różnych obszarów w system, który wykonuje swoje zadanie na co dzień. Kod projektu jest publiczny.
