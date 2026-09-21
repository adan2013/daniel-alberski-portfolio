## Tani alarm do mieszkania bez internetu

PiGuard powstał z nagłej potrzeby zabezpieczenia pustego mieszkania. Brak stałego łącza internetowego sprawił, że powiadomienia GSM stały się podstawowym wymaganiem. Miałem już Raspberry Pi, modem i kartę SIM. Zamiast kupować gotowy alarm, mogłem wykorzystać sprzęt, który leżał w szufladzie, i przy okazji sprawdzić, czy uda mi się samodzielnie zaprogramować komunikację z siecią komórkową.

Założenia były konkretne. Urządzenie miało obserwować trzy czujki ruchu, zapisywać wszystkie zdarzenia i wysyłać SMS-y alarmowe oraz diagnostyczne. Po powrocie zasilania powinno uruchomić się bez mojej pomocy, ponownie zestawić komunikację z modemem i potwierdzić gotowość wiadomością. Nie planowałem akumulatora ani UPS-a. PiGuard nie działa podczas przerwy w dostawie prądu, ale sam wraca do pracy, gdy w gniazdku ponownie pojawia się 230 V.

Na wykonanie całości miałem trzy tygodnie. Najpierw powstały małe skrypty służące wyłącznie do eksperymentów z modemem. Dopiero gdy komunikacja zaczęła działać powtarzalnie, zabrałem się za docelowy program. Płytka z elektroniką i drukowana obudowa były ostatnim etapem.

## Dwa modemy Huawei i port szeregowy

Najwięcej czasu zabrały dwa warianty modemu Huawei E3372: H w wersji HiLink oraz S w wersji Stick. Producent przewidział obsługę przez własne oprogramowanie, a nie wykorzystanie urządzenia jako zwykłego modemu szeregowego sterowanego z Raspberry Pi. Dokumentacja potrzebna do mojego zastosowania była szczątkowa.

Oba egzemplarze ostatecznie udało mi się uruchomić. Każdy wymagał jednorazowej konfiguracji pod Windowsem, a później odpowiedniej sekwencji komend AT wysyłanych przez USB. Dochodziłem do niej eksperymentalnie, zaczynając od prostych poleceń sprawdzających, czy modem w ogóle odpowiada. Następnie testowałem tryb wiadomości tekstowych, stan karty SIM, rejestrację w sieci, operatora i siłę sygnału. Dopiero na końcu przeszedłem do wysyłania SMS-ów.

W docelowej aplikacji komendy trafiają do kolejki, ponieważ modem musi zakończyć jedną operację przed rozpoczęciem następnej. Każde polecenie ma limit czasu i może zostać ponowione po błędzie. Program wykrywa też zamknięcie portu i próbuje zestawić połączenie od nowa. Przed wysłaniem wiadomości diagnostycznej odpytuje modem o bieżący stan, dzięki czemu SMS zawiera informacje z chwili jego przygotowania, a nie stare dane zapisane podczas startu.

Główna część programu jest napisana w TypeScript i działa w Node.js. Niewielki skrypt w Pythonie steruje tylko sygnałami dźwiękowymi. AI pomogło mi szukać sposobu komunikacji z modemami i przygotować prosty panel w czystym HTML. Podpowiedziało również, jak skonfigurować usługi sieciowe w Linuksie. Wszystko sprawdzałem bezpośrednio na docelowym Raspberry Pi i obu modemach. Był to szybki projekt hobbystyczny, bez osobnego środowiska testowego.

## Trzy czujki i fizyczny klucz

PiGuard odbiera sygnały z trzech tanich czujek PIR podłączonych do GPIO. Program reaguje na zmianę stanu wejścia, zapisuje zdarzenie, uruchamia sygnał dźwiękowy i wysyła SMS. Cooldown chroni przed serią wiadomości, gdy czujka pozostaje aktywna albo wzbudzi się ponownie po kilku sekundach.

Największym źródłem fałszywych alarmów okazały się same czujki. Wyregulowałem ich czułość i długość impulsu, ale przy dużych zmianach temperatury nadal czasem pojawia się błędny odczyt. Centralka rejestruje go zgodnie z tym, co dostaje na wejściu. To ograniczenie tanich sensorów, które zaakceptowałem w tym zastosowaniu.

Do obsługi alarmu wykorzystałem samochodową stacyjkę. Miałem kilka takich przełączników, a ich mechanika dobrze pasowała do zadania. Osobny klucz noszę razem z kluczami do mieszkania, więc nie mogę zostawić go w środku i przypadkiem wyjść bez ponownego uzbrojenia alarmu. Nie muszę też pamiętać kodu.

Pierwsza pozycja stacyjki wyłącza powiadomienia SMS, na przykład na czas wejścia do mieszkania. Krótkie przekręcenie do pozycji rozruchu wysyła wiadomość diagnostyczną. Dłuższe przytrzymanie bezpiecznie zamyka system. Dioda pokazuje stan pracy i aktywność czujek, a krótkie dźwięki potwierdzają wykonanie poleceń.

[media:2]

## Elektronika przygotowana do stałej pracy

Sercem urządzenia jest Raspberry Pi 3B+. Połączenia wykonałem na lutowanej płytce uniwersalnej. Przewody zarobiłem we wtyczki i poprowadziłem tak, aby wnętrze dało się serwisować bez odcinania kabli. Płytka zbiera połączenia czujek, diody, głośnika i obu pozycji stacyjki.

Obudowę zaprojektowałem od zera w Fusion 360. Druga wersja została wersją finalną. Dodałem otwór wentylacyjny w pokrywie, przepusty kablowe od spodu oraz uchwyty pozwalające zawiesić całość na ścianie. Rozmieszczenie elementów wewnątrz podporządkowałem prowadzeniu przewodów i dostępowi do Raspberry Pi oraz modemu.

[media:3]

## Konfiguracja przez własny hotspot

Raspberry Pi tworzy lokalny hotspot Wi-Fi, ponieważ w mieszkaniu nie ma routera. Połączenie wymaga hasła. Dopiero z tej sieci można otworzyć panel urządzenia i sprawdzić czas pracy, stan trzech wejść, parametry modemu oraz ostatnie logi. Panel pozwala też wysłać testowy SMS, zmienić konfigurację, zsynchronizować zegar oraz bezpiecznie zrestartować lub wyłączyć urządzenie.

[media:1]

Logi trafiają do rotowanych plików na karcie pamięci. Osobno zapisuję zwykły przebieg pracy i błędy, a panel pokazuje ostatnie wpisy z obu plików. Przy urządzeniu pozostawionym w pustym mieszkaniu jest to prostsze niż podłączanie monitora albo każdorazowe logowanie przez SSH.

Po uruchomieniu systemd startuje aplikację i czeka na pojawienie się portu USB modemu. PiGuard inicjalizuje komunikację GSM, sprawdza kartę SIM i rejestrację w sieci, a następnie wysyła raport. Wiadomość diagnostyczna podaje między innymi operatora, siłę sygnału, czas pracy i stan każdego wejścia. SMS po nieplanowanym restarcie jest jednocześnie informacją, że w mieszkaniu wróciło zasilanie i alarm ponownie działa.

[media:4]

## Praca poza stołem warsztatowym

PiGuard działa w mieszkaniu do dziś. Jedyną przyczyną restartów były przerwy w dostawie energii. Po przywróceniu zasilania centralka uruchamia się i ponownie łączy z siecią GSM bez ręcznej interwencji. Sporadyczne fałszywe alarmy nadal mogą pochodzić od tanich czujek reagujących na zmianę temperatury.

W ciągu trzech tygodni przeszedłem od pojedynczych komend wysyłanych do niechętnego współpracy modemu do urządzenia zamontowanego na ścianie. Projekt połączył komunikację szeregową, GPIO, usługi Linuksa, prosty interfejs webowy, lutowanie i projektowanie obudowy. Kod wraz z instrukcją instalacji i obsługi jest dostępny w publicznym repozytorium.
