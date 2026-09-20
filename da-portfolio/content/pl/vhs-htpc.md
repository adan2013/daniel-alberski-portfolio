## Skąd wziął się ten projekt

VHS HTPC zaczął się od prostej potrzeby: chciałem wygodnie oglądać wideo na telewizorze z urządzenia, które nie będzie kolejną czarną skrzynką obok szafki RTV. Miałem pod ręką stary laptop, który jako komputer przenośny był już mało praktyczny, ale nadal miał mocny procesor i wystarczający zapas do codziennego odtwarzania materiałów online. Zamiast kupować nowy mini PC, postanowiłem dać mu drugie życie.

Drugim elementem układanki był retro magnetowid Panasonic NV-J35HQ. To sprzęt, który pamiętam jeszcze z dzieciństwa, więc pomysł zbudowania nowego urządzenia właśnie w tej obudowie miał dla mnie dodatkową wartość. Chciałem zachować jego charakterystyczny wygląd, a jednocześnie zbudować funkcjonalny komputer multimedialny z własnym sterowaniem.

Od początku było jasne, że to nie będzie projekt typu "przełóż płytę i gotowe". W środku magnetowidu jest mało miejsca, a płyta główna 17-calowego laptopa Asus K75VJ jest duża i długa. Każda decyzja konstrukcyjna wpływała na kolejne: położenie płyty, prowadzenie zasilania, dostęp do portów, chłodzenie i miejsce na elektronikę sterującą.

## Najtrudniejsza część: geometria i upakowanie podzespołów

Pierwsza koncepcja zakładała montaż płyty głównej prostopadle do frontu obudowy. Taki układ wyglądał dobrze na papierze, bo dawał prostsze wyprowadzenie portów na tył i zostawiał przestrzeń na dodatkowe moduły. W praktyce szybko wyszło, że płyta ledwo mieści się w obudowie nawet po odpięciu fragmentu PCB z gniazdami SATA.

Sprawdziłem kilka wariantów obejścia tego problemu, między innymi zmianę sposobu podłączenia dysku i alternatywne prowadzenie wiązek. Finalnie najrozsądniejszy okazał się montaż płyty równolegle do frontu. Ta decyzja uratowała zgodność z oryginalnym okablowaniem laptopa, ale wymusiła bardzo precyzyjne przygotowanie mocowań i reorganizację całego wnętrza.

Na etapie obróbki obudowy musiałem usunąć część wewnętrznych wzmocnień z tworzywa, wyciąć nowe otwory i dopasować przejścia dla portów oraz przewodów. Kluczowe było to, żeby nie zniszczyć bryły urządzenia od zewnątrz. Po złożeniu magnetowid nadal wygląda jak klasyczny sprzęt RTV, ale jego wnętrze zostało przeprojektowane pod nową funkcję.

Efekt końcowy to konstrukcja oparta o trzy warstwy. Na dole trafiły elementy związane z zasilaniem, wyżej płyta główna laptopa, a obok i nad nią moduły pomocnicze: SSD, panel portów oraz moja elektronika sterująca. Taki układ pozwolił zmieścić wszystko w ograniczonej przestrzeni bez tworzenia przypadkowej plątaniny przewodów.

[media:1]

## Własny układ sterowania i fizyczny interfejs

Samo uruchamianie Windowsa z pilota nie rozwiązywało jeszcze problemu wygody. Chciałem mieć fizyczne sprzężenie z urządzeniem: przycisk, diodę stanu i mały wyświetlacz pokazujący to, co jest potrzebne podczas codziennego używania.

Dlatego zaprojektowałem i polutowałem autorski układ oparty na ESP8266 (NodeMCU v3), który zarządzał logiką sterowania oraz komunikacją z komputerem. Do płytki dołożyłem zegar czasu rzeczywistego, obsługę panelu frontowego i separację sygnałów pomiędzy elektroniką pomocniczą a płytą laptopa. Dzięki temu mogłem niezależnie kontrolować zasilanie i reakcje przycisku, a jednocześnie zachować bezpieczne granice między układami.

Druga część tej warstwy to sterownik wyświetlacza segmentowego. Zbudowałem go ręcznie na osobnej płytce, używając rejestrów przesuwnych i tranzystorów, a sam wyświetlacz osadziłem z przodu obudowy razem z odbiornikiem podczerwieni. W praktyce oznaczało to dużo pracy mechanicznej i lutowania, ale dzięki temu panel frontowy dostał funkcję, która naprawdę przydaje się na co dzień.

Pilot stał się głównym urządzeniem wejściowym. Z poziomu przycisków mogę uruchamiać akcje systemowe, wybierać profile skrótów i przechodzić po prostym menu. Zależało mi, żeby obsługa była intuicyjna bez dokładania klawiatury i myszy do każdego krótkiego zadania.

[media:2]

## Integracja z Windowsem i logika aplikacji C#

Elektronika była tylko jedną stroną projektu. Drugą był software, który spina całość od strony systemu operacyjnego. Napisałem aplikację desktopową w C#, która komunikuje się z kontrolerem przez port COM i tłumaczy komendy z pilota na akcje po stronie Windowsa.

W najprostszym scenariuszu działa to tak: użytkownik naciska przycisk na pilocie, ESP8266 wysyła kod akcji, a aplikacja uruchamia odpowiedni skrót klawiszowy albo funkcję systemową. Ten model okazał się elastyczny, bo mogłem łatwo rozbudowywać mapowanie akcji bez przebudowy całego firmware'u.

Dodałem też lekkie okna pomocnicze do wyboru profili i skrótów aplikacji. Dzięki nim zestaw działa nie jako pojedynczy pilot do play i pause, tylko jako mały interfejs do codziennego korzystania z HTPC. To ważny element projektu, bo przenosi ciężar z jednorazowego efektu DIY na realną użyteczność.

Po stronie danych aplikacja wysyła do kontrolera również temperaturę procesora, która jest pokazywana na wyświetlaczu. Taki drobiazg dobrze łączy warstwę software i hardware: ekran na obudowie nie jest ozdobą, tylko przekazuje bieżący stan urządzenia.

[video]

## Co finalnie powstało

VHS HTPC to kompletny, działający komputer multimedialny zamknięty w obudowie klasycznego magnetowidu. Projekt połączył kilka obszarów, które zwykle rozdziela się na osobne zadania: modyfikację konstrukcji, integrację elektroniki, napisanie oprogramowania i dopracowanie ergonomii obsługi.

Największą wartością tego projektu jest dla mnie sposób podejmowania decyzji pod realne ograniczenia. Nie miałem komfortu idealnej obudowy ani gotowego zestawu modułów. Każda zmiana musiała uwzględniać konkretną przestrzeń, dostępność elementów i to, czy urządzenie będzie wygodne w codziennym użyciu po zamknięciu pokrywy.

Dziś ten projekt traktuję jako ważny etap rozwoju pracy na styku software i hardware. Pokazał mi, jak prowadzić implementację wtedy, gdy architektura kodu i architektura fizyczna są od siebie zależne. To doświadczenie później dobrze zaprocentowało w kolejnych konstrukcjach, gdzie kod musi współpracować z realnym urządzeniem, a nie tylko z kolejną warstwą API.

[media:3]

Kod źródłowy, schemat i pełna dokumentacja budowy są publicznie dostępne. Dzięki temu ten case study nie jest tylko opisem gotowego efektu, ale też zapisem procesu: od pierwszych przymiarek, przez iteracje konstrukcji, aż po finalny system działający w salonie.
