# No to jedziemy
(nie dałem .enva)
## 1. Weź to sklonuj
## 2. Terminal odpal
## 3. Upewnij się że jesteś w folderze JUDAS
## 3,5. Jak nie to wpisz `cd JUDAS`
## 4. Masz .env.example, wpisz tam dane do mongo i klucz JWT
## 5. Odpal terminal i wpisz `copy .env.example .env`
## 6. Wpisz do tego terminala coś takiego `docker-compose up --build`
## 7. Módl się żeby zadziałało

### Wymagania to jakieś:
- Docker
- Docker Compose
(nie wiem)

### Aplikacja powinna być pod:
- Frontend: [http://localhost:3000]
- Backend API: [http://localhost:5000]

## Co to ma być?
Apka generalnie narazie ma mieć mechanike użytkowników, logowania, rejestracji i grup.
Takie proste coś że się możesz zalogować, dołączyć lub utworzyć grupę, a potem chatować z innymi.

## Problemy
Grupy działały (czas przeszły), chciałem dodać websockety żeby ci się na bierząco wyświetlała np liczba użytkowników na grupie, ale coś się powiesiło 10 metrów nad ziemią. (Będzie naprawione, a przynajmniej spróbowane)

## Co to może być?
Zmyśliłem sobie że śmieszny by było z tego zrobić taką mini gierke, że masz room i w roomie jest 12 osób, z czego każda która nie jest prawdziwym człowiekiem będzie na pałe chatem gpt. Celem ludzi jest znaleźć bota, a celem chatów jest znaleźć człowieka.