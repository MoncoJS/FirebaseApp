![image](https://github.com/user-attachments/assets/80f81bff-e19e-44bd-8f75-7bbf86909d0a)
![image](https://github.com/user-attachments/assets/21b61826-351f-4397-b660-91e5b6142199)
![image](https://github.com/user-attachments/assets/78eba23b-25b7-4adb-982c-16edc8d623b8)
![image](https://github.com/user-attachments/assets/577ba037-4030-4cc5-9611-b3e6679548d2)
![image](https://github.com/user-attachments/assets/271a58c7-e4f0-431f-bc0b-600a4c0d9b6f)
![image](https://github.com/user-attachments/assets/cfb4b38e-3475-4142-97b9-ef88d273856a)


rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

---

expo init FirebaseApp
npx expo start
