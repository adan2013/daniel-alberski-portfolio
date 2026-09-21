## Skąd wziął się ten projekt

DIY Arduino Dashboard zbudowałem, kiedy regularnie jeździłem po Europie w Euro Truck Simulator 2 i chciałem dodać tej zabawie więcej fizycznego "czucia". Nie interesował mnie prosty panel z przyciskami ani kilka luźnych diodek na biurku. Chciałem pełny, zamknięty w obudowie zestaw wskaźników, który wygląda jak fragment prawdziwego kokpitu i reaguje na to, co dzieje się w grze.

W praktyce oznaczało to połączenie kilku warstw naraz: elektroniki, oprogramowania Arduino, aplikacji desktopowej odbierającej telemetrię oraz projektu wizualnego tarcz i kontrolek. To były moje pierwsze poważne kroki w elektronice, więc każdy etap wymagał osobnego rozeznania i wielu iteracji. Projekt powstawał po godzinach i z przerwami, dlatego od pierwszego szkicu do gotowego urządzenia minęło ponad półtora roku.

Od początku założyłem jedną rzecz: nie robię demonstratora, tylko działające urządzenie, którego faktycznie będę używał. Z tego powodu zależało mi nie tylko na funkcjach, ale też na ergonomii, estetyce i możliwości serwisowania. Z perspektywy czasu to właśnie ta decyzja podniosła skalę projektu najbardziej.

## Jak to działa od strony systemu

Sercem rozwiązania nie było samo Arduino, tylko cały przepływ danych. Gra udostępnia telemetrię przez bibliotekę SCS Software, ale to są surowe dane. Żeby zamienić je na sensowne zachowanie fizycznych zegarów, napisałem własny interpreter w C#/WPF. Ten program po stronie komputera odczytywał stan ciężarówki, przetwarzał go i wysyłał przez USB gotowe komendy do mikrokontrolera.

Taki podział odpowiedzialności był celowy. Logika na PC dawała mi wygodniejsze diagnozowanie błędów i możliwość szybkiego testowania bez każdorazowego przebudowywania oprogramowania Arduino. Po stronie Arduino zostawiłem to, co musi być blisko sprzętu: sterowanie wskazówkami, kontrolkami i wyświetlaczem LCD. Dzięki temu mogłem utrzymać odpowiednią płynność działania mimo ograniczonej mocy obliczeniowej.

Dodatkowo interfejs interpretera pełnił rolę zaplecza serwisowego. Pozwalał uruchamiać tryby testowe, ręcznie sterować wskazówkami, korygować pozycje startowe silników krokowych i przełączać ustawienia związane z ekranem czy dźwiękami ostrzegawczymi. W praktyce ten panel bardzo skracał pętlę diagnostyczną podczas budowy.

[media:1]

## Główne decyzje techniczne i kompromisy

Największym wyzwaniem było pogodzenie płynnej pracy wskazówek z obsługą kolorowego ekranu LCD 2.4" na Arduino. Sam kontroler wyświetlacza i magistrala SPI potrafiły zjeść znaczną część dostępnego czasu procesora, a projekt musiał jednocześnie aktualizować kilka niezależnych elementów.

Rozwiązałem to przez restrykcyjną optymalizację odświeżania. Zamiast rysować cały interfejs od nowa, aktualizowałem tylko te obszary ekranu, które faktycznie się zmieniły, i tylko wtedy, gdy było to potrzebne. Interfejs oparłem o proste prymitywy graficzne zamiast cięższej warstwy gotowych kontrolek. To nie było najwygodniejsze podejście na etapie implementacji, ale dobrze pasowało do ograniczeń sprzętu.

Drugim ciekawym kompromisem była telemetria ETS/ATS. Nie udostępniała ona wszystkich stanów, których potrzebowałem. Przykład: brak bezpośredniego odczytu blokady dyferencjału. Żeby zachować tę kontrolkę na panelu, dodałem obejście oparte na dedykowanym skrócie klawiszowym i synchronizacji stanu po stronie aplikacji. To nie jest rozwiązanie idealne, ale w codziennym użyciu działało wystarczająco dobrze.

Trzeci obszar decyzji dotyczył sterowania kontrolkami LED. Zamiast prowadzić osobne linie do każdego punktu świetlnego, użyłem ekspandera MCP23017 na I2C. Dzięki temu uprościłem okablowanie i oszczędziłem piny Arduino, a jednocześnie mogłem niezależnie sterować 16 kontrolkami.

[media:2]

## Wykonanie fizyczne i warstwa DIY

Warstwa mechaniczna i wizualna była równie ważna jak warstwa programowa. Jako bazę wykorzystałem zegary z Golfa IV i przebudowałem je tak, aby pasowały do skali ciężarówki oraz do własnego układu kontrolek. Powstała obudowa ze sklejki ciętej laserowo, komplet własnych połączeń elektrycznych i ręcznie przygotowane tarcze.

Same tarcze wymagały osobnego procesu projektowego. Oryginalne skale samochodowe nie pasowały do symulatora, więc stworzyłem własne grafiki w autorskim programie [Gauge Generator](/projects/gauge-generator), który rozwijam jako osobny projekt w tym portfolio. Później przetestowałem różne materiały i układ warstw pod kątem przepuszczania światła. Efektem było rozwiązanie wielowarstwowe, które zachowuje czytelność w dzień i daje dobry efekt podświetlenia po zmroku.

Ta część projektu nauczyła mnie pracy z tolerancjami i geometrią, nawet bez drukarki 3D. Każdy przewód, dystans i uchwyt musiał mieć swoje miejsce, bo dostępna przestrzeń szybko się kończyła. Wielokrotnie wracałem do wcześniejszych etapów, żeby poprawić prowadzenie kabli albo sposób montażu konkretnego elementu.

## Co użytkownik dostaje podczas jazdy

Z perspektywy użytkowej ten zestaw nie kończył się na "ruszających się wskazówkach". Zależało mi, żeby urządzenie realnie rozszerzało interfejs gry, a nie tylko go kopiowało. Dlatego poza klasycznymi zegarami i kontrolkami dodałem komputer pokładowy na LCD, który pokazuje kilka widoków danych i umożliwia prostą personalizację.

W praktyce podczas jazdy widzę najważniejsze informacje bez ciągłego zerknięcia na ekran gry: bieg, tempomat, przebieg, retarder, limit prędkości czy krótkie komunikaty zdarzeń. Do tego dochodzą ostrzeżenia świetlne i dźwiękowe, które działają bardziej jak sygnały z prawdziwego pojazdu niż jak suche statusy w interfejsie gry.

To była dla mnie ważna część projektu, bo wymusiła myślenie nie tylko o elektronice, ale o przepływie informacji i priorytetach danych. Musiałem zdecydować, co ma pojawiać się stale, co okresowo i jak nie przeładować ekranu mimo ograniczonej przestrzeni oraz mocy obliczeniowej.

[video]

## Co zrobiłbym inaczej

Największy błąd to rezygnacja z dedykowanego PCB. Poszedłem drogą ręcznego okablowania i "zastępstwa płytki", co dało działający rezultat, ale kosztowało dużo więcej czasu niż powinno. Dzisiaj od początku przygotowałbym płytkę pod projekt i zostawił więcej zapasu na serwis.

Druga rzecz to margines wydajności dla wyświetlacza. Udało się osiągnąć używalny efekt, ale przy bardziej dynamicznych zmianach danych było widać momenty przycięć. Gdybym budował ten projekt ponownie, mocniej rozdzieliłbym zadania między urządzeniami albo od razu dobrał platformę z większą rezerwą mocy.

Mimo tych ograniczeń uważam ten etap za bardzo wartościowy. To był projekt, w którym większość wiedzy zdobywałem w trakcie, a każde potknięcie przekładało się potem na lepsze decyzje w kolejnych konstrukcjach.

[media:3]

## Efekt końcowy

Finalnie powstał kompletny zestaw do ETS2/ATS: fizyczne wskaźniki, kontrolki, ekran pokładowy i własna warstwa integracji z telemetrią gry. To nie była pojedyncza funkcja, tylko pełny system łączący programowanie i elektronikę w jednym urządzeniu.

Najważniejsze jest dla mnie to, że projekt nie skończył jako prototyp na zdjęciach. Działał w realnym użyciu, przeszedł wiele iteracji i dał mi solidne podstawy pod późniejsze projekty elektroniczne. W tym sensie DIY Arduino Dashboard był nie tylko gotowym produktem, ale też punktem zwrotnym w moim sposobie pracy nad projektami, które wychodzą poza sam kod.
