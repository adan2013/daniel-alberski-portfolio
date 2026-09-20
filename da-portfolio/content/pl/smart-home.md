## System zbudowany do codziennego użycia

Zbudowałem smart home do codziennego użytku przez wszystkich domowników. Główny panel działa na tablecie zamontowanym na ścianie w trybie Fully Kiosk, ten sam dashboard jest dostępny na telefonach jako aplikacja PWA, a najczęstsze czynności można wykonać tradycyjnymi pilotami w pomieszczeniach.

Home Assistant dobrze radzi sobie z komunikacją z urządzeniami różnych producentów, ale jego standardowy interfejs nie odpowiadał mojemu sposobowi korzystania z domu. Zamiast dopasowywać potrzeby do gotowego układu, napisałem własny frontend w React. Mogłem sam ustalić hierarchię informacji, wygląd kafelków oraz zachowanie elementów przygotowanych pod ekran dotykowy. Wolę napisać potrzebną funkcję niż długo szukać obejścia w cudzym interfejsie.

Projekt obejmuje też backend w Node.js. To w nim działa logika automatyzacji, system powiadomień i monitoring urządzeń. Home Assistant pozostał warstwą pośredniczącą między kodem a sprzętem, w tym urządzeniami Zigbee i integracjami korzystającymi z MQTT.

## Krótki eksperyment z Node-RED

Na początku sprawdziłem Node-RED. Graficzne węzły wystarczały do prostych reguł, lecz problemy pojawiły się już podczas projektowania powiadomień. Liczba połączeń szybko rosła, dane przepływały przez nietypowane węzły, a brak testów odbierał mi pewność, że zmiana jednego fragmentu nie zepsuje innej automatyzacji.

Nie miałem wtedy rozbudowanego systemu, który wymagał wielkiej migracji. Dość szybko uznałem, że jako programista mam większą kontrolę nad zwykłym kodem. Własny backend pozwolił mi rozdzielać odpowiedzialności na serwisy, opisywać urządzenia typami i testować logikę bez uruchamiania jej na prawdziwym domu. Testy obejmują między innymi encje, automaty stanów, harmonogramy oraz poszczególne usługi.

Dashboard utrzymuje jedno połączenie WebSocket z backendem. Backend subskrybuje zmiany w Home Assistant, udostępnia frontendowi potrzebne stany i przyjmuje polecenia sterujące. Token Home Assistanta nie trafia dzięki temu do przeglądarki. Sam dostęp do domowej sieci również nie wystarcza do sterowania urządzeniami: przy pierwszym uruchomieniu dashboard wymaga hasła, a backend odrzuca nieuwierzytelnione połączenia.

[media:1]

## Powiadomienia, które prowadzą do działania

Powiadomienie w tym systemie nie jest krótkim komunikatem znikającym z ekranu. Backend przechowuje listę aktywnych zdarzeń i usuwa je dopiero wtedy, gdy przyczyna przestaje występować albo użytkownik świadomie je zamknie. Alert może mieć priorytet, kolor oraz sygnał dźwiękowy. Panel obsługuje też tryb nocny, który wycisza mniej pilne zdarzenia.

Komunikaty są widoczne na tablecie. Dodatkowo listwa RGB obok niego zmienia kolor, a przy pilnych zdarzeniach uruchamia się dźwięk. Dzięki temu nie trzeba akurat patrzeć na ekran. Następnym krokiem będą alerty SMS dla zdarzeń, o których powinienem wiedzieć również poza domem.

Monitoring drzwi wejściowych pokazuje cały przepływ powiadomienia. Wewnątrz ramy zamontowałem własny czujnik, który sprawdza położenie rygla. Po pozostawieniu drzwi bez zaryglowania panel pokazuje ostrzeżenie i włącza żółte światło. Jeśli ten stan trwa ponad 90 sekund, alert zmienia kolor na czerwony i uruchamia dźwięk. Po zaryglowaniu drzwi komunikat znika, ponieważ system reaguje na stan fizycznego zabezpieczenia, a nie tylko na upływ czasu.

[media:2]

## Fizyczne sterowanie bez aplikacji

Ekran nie zawsze jest najwygodniejszym sposobem sterowania światłem. W salonie korzystamy z sześcioprzyciskowego pilota ściennego. Pięć przycisków odpowiada pięciu źródłom światła, a pojedyncze naciśnięcie, podwójne naciśnięcie i przytrzymanie wybierają jeden z trzech poziomów jasności. Szósty przycisk wyłącza wszystkie lampy.

Logika bierze pod uwagę aktualny stan oświetlenia. Jeśli wybrana scena już działa, ponowne użycie tego samego skrótu wyłącza przypisane światło. Jeden przycisk może również włączyć kilka lamp lub wygasić inne, dlatego pilot nadal zachowuje prosty układ mimo bardziej złożonych działań w tle. Domownik nie musi znać struktury automatyzacji ani otwierać aplikacji.

Dashboard zawiera też wirtualną kopię pilota dostępną z telefonu. To idealne rozwiązanie, kiedy kot leży na kolanach i wstawanie tylko po to, żeby zmienić światło, nie wchodzi w grę.

[media:3]

## Monitoring samego systemu

Automatyka domowa przestaje pomagać, jeśli po cichu traci kontakt z czujnikiem. Backend synchronizuje obecnie ponad 300 encji Home Assistanta. Są wśród nich urządzenia fizyczne, sensory oraz encje pomocnicze i wirtualne. Wybrane elementy mają własne reguły nadzoru: system wykrywa stan offline, niski poziom baterii oraz brak raportu w oczekiwanym czasie.

Sensor może nadal widnieć jako dostępny, ale przez wiele godzin nie przesłać żadnej aktualizacji. Dla pasywnych czujników dopuszczam dłuższą przerwę, a aktywne urządzenia powinny zgłaszać się częściej. Jeśli ważny element przekroczy swój limit, jego ogólna nazwa pojawia się w powiadomieniu. Nie muszę czekać, aż niedziałający sensor ujawni się podczas prawdziwego zdarzenia.

Backend zapisuje ustrukturyzowane logi na osobnym wolumenie, a ich ostatnie wpisy mogę otworzyć z dashboardu. Panel pokazuje także stan usług i połączenia z Home Assistantem. System działa na co dzień od kilku lat i restartuję go tylko na potrzeby aktualizacji. Własna warstwa automatyzacji nie jest więc eksperymentem uruchamianym od czasu do czasu, lecz stałym elementem domu.

## Projekt, który nadal rośnie

Smart home rozwijam od 2023 roku. Większość systemu powstała przed okresem, w którym zacząłem regularnie korzystać z asystentów programowania. AI pomogło mi przy późniejszej refaktoryzacji przepływu danych, dzięki czemu sprawniej przeprowadziłem zmianę w działającej instalacji. Nadal sam określam zachowanie systemu i sprawdzam je w testach oraz w codziennym użyciu.

Projekt nie jest zamknięty. W interfejsie pozostało kilka placeholderów, a następna większa funkcja ma sterować kaloryferami na podstawie obecności domowników. Planowane powiadomienia SMS rozszerzą natomiast istniejący system alertów poza sieć lokalną.
