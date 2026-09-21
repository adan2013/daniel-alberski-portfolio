## Od WordPressa do własnej platformy

Uruchomiłem Redarka w 2018 roku, żeby dzielić się wiedzą o komputerach i oprogramowaniu. Z czasem zacząłem tam również dokumentować własne projekty: Arduino Dashboard, czytnik audiobooków na Raspberry Pi czy VHS HTPC. Zależało mi na publikowaniu opisów, do których sam chciałbym trafić podczas rozwiązywania podobnego problemu.

Pierwsza wersja działała na WordPressie. Znałem ten system i mogłem szybko uruchomić serwis, ale gotowe motywy mi nie odpowiadały, więc napisałem własny w PHP. Pozwolił mi wystartować, choć wraz z rozwojem bloga rosła też ilość kodu i liczba obejść potrzebnych do wprowadzania kolejnych zmian.

[media:1]

Z czasem utrzymanie WordPressa zaczęło zajmować coraz więcej czasu. Aktualizacje WordPressa i wtyczek potrafiły powodować nowe problemy, przejście na HTTPS okazało się niepotrzebnie trudne, a bezwzględne adresy utrudniały uruchomienie kopii strony w innym środowisku. Sam Redark nie został zaatakowany, ale wielokrotnie pomagałem ratować cudze instancje WordPressa. Wiedziałem, ile szkód może wyrządzić podatna wtyczka albo zaniedbana aktualizacja.

Przez około dwa miesiące sprawdzałem mniej radykalne rozwiązania. Próbowałem użyć WordPressa jako headless CMS-a oraz osadzić Reacta w istniejącym motywie. Oba warianty zostawiały najtrudniejszą część problemu: nadal musiałbym utrzymywać WordPressa i dopasowywać do niego resztę systemu. Ostatecznie zdecydowałem się usunąć go całkowicie i zbudować statyczną wersję bloga w React i Gatsby.

## Migracja około 80 artykułów

Nie przenosiłem pustej strony. Redark miał około 80 opublikowanych artykułów, grafiki, kategorie, tagi, powiązane wpisy i adresy obecne już w wynikach wyszukiwania. Ręczne kopiowanie treści odpadało, ale automatyczny import również nie mógł działać bez kontroli. Był 2020 rok, więc nie mogłem przekazać całego archiwum modelowi językowemu i poprosić go o znalezienie różnic.

Napisałem w Node.js skrypt do migracji oraz testy wskazujące miejsca z uszkodzonymi odnośnikami do stron i mediów. Linki zapisane na stałe z domeną Redarka zamieniałem na względne, aby lokalna kopia, środowisko testowe i wersja produkcyjna korzystały z tych samych treści. Po automatycznych sprawdzeniach przejrzałem wynik ręcznie. Cała migracja zajęła ponad miesiąc.

Artykuły trafiły do plików MDX przechowywanych razem z kodem w repozytorium. Każdy plik zawierał treść i metadane, takie jak tytuł, data, slug, kategorie, tagi czy grafika wyróżniająca. MDX pozwolił mi osadzać w tekście własne komponenty, na przykład galerie, przyciski i bloki informacyjne, bez wiązania zawartości artykułu z edytorem WordPressa.

[media:2]

Zachowanie widoczności w wyszukiwarce było jednym z wymagań, ale nie mam statystyk, które pozwalałyby mi obiecać „migrację bez utraty SEO”. Mogę natomiast wskazać pracę, którą wykonałem: zachowałem dotychczasową strukturę adresów, sprawdziłem linki i grafiki, przygotowałem metadane oraz obrazy używane przy udostępnianiu wpisów, zweryfikowałem sitemapę i przetestowałem stronę kilkoma analizatorami SEO. Kontrolowałem też wygląd i treść przeniesionych artykułów.

## Publikowanie bez panelu administratora

Po usunięciu WordPressa zniknął panel administracyjny i baza danych. Kod oraz artykuły przechowywałem na GitHubie, a serwer otrzymywał wygenerowane pliki strony. Ograniczyło to powierzchnię ataku i dało mi pełną historię zmian, ale odebrało wygodny przycisk „Opublikuj”. Musiałem zbudować własny proces.

Pierwsza wersja polegała na pełnym zbudowaniu strony i wysłaniu jej przez FTP. W 2020 roku zajmowało to około 60–70 minut, głównie ze względu na liczbę przetwarzanych grafik. Następnie skonfigurowałem pipeline w Buddy Works. Narzędzie budowało projekt i przesyłało tylko zmienione pliki, skracając cały proces do około czterech minut.

[media:3]

Rozmiar Redarka szybko przestał mieścić się w darmowym planie usługi. Zamiast wracać do ręcznego wdrażania, napisałem własne narzędzie w Node.js. Pobierało zmiany z GitHuba, budowało stronę, porównywało rezultat z poprzednią wersją, wysyłało różnicę na serwer FTP i przesyłało raport e-mailem. Wdrożenie trwało wtedy zwykle 2–3 minuty. Podane czasy opisują stan projektu w 2020 roku, a nie obecne wyniki.

[media:4]

Takie rozwiązanie wymagało więcej pracy na początku, ale usuwało czynności, które przy każdym artykule musiałbym powtarzać ręcznie. Kod bloga i narzędzia wdrożeniowego udostępniłem publicznie.

## Decyzja po sześciu latach

Przejście z WordPressa nadal uważam za bardzo dobrą decyzję. Redark działa na tej samej domenie do dziś, a opisy moich projektów nadal są dostępne. Publikuję okazjonalnie, choć blog nie jest już moim głównym obszarem pracy.

Zmienił się zarówno internet, jak i tematyka serwisu. Czytelnicy coraz częściej pytają narzędzia AI zamiast szukać poradników, a odpowiedzi generowane bezpośrednio w wyszukiwarkach ograniczają liczbę wejść na strony. Pisanie rozbudowanych artykułów stało się przez to mniej opłacalne czasowo. Jednocześnie kryzys dostępności kart graficznych, a później wysokie ceny pamięci RAM i dysków sprawiły, że składanie komputerów przestało być tak atrakcyjne jak wcześniej. Te zmiany odbiły się na oglądalności Redarka.

Z perspektywy czasu inaczej wybrałbym technologię docelową. Gatsby dobrze spełnił swoje zadanie w 2020 roku, lecz kolejne lata przyniosły długie buildy, rosnący rozmiar artefaktów i coraz cięższe wdrożenia. Jego społeczność również straciła wcześniejsze tempo. W 2025 roku przygotowałem prototyp Redarka w Next.js, ale przy mniejszym ruchu nie było powodu ryzykować kolejnej migracji działającej strony. Gdybym zaczynał ten proces dzisiaj, nadal odszedłbym od WordPressa, lecz od razu wybrałbym Next.js.
