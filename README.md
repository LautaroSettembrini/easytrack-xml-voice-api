# EasyTrack Microservice

This repository contains a **demonstration version** of a Node.js microservice developed for integration with the EasyTrack AVL API. It fetches geolocation data for predefined vehicles, converts it to XML (Twilio-compatible), and serves it via HTTP endpoints.

---

## ⚠️ Disclaimer

> This project is part of my **personal development portfolio** and is published **for demonstration purposes only**.

- This is **not** the production version.
- It does **not include any real credentials, access tokens, or private data**.
- Vehicle identifiers (license plates) have been **generalized** or **placeholderized**.
- The production version exists and is actively deployed, but it is **private and secured**.

Please do not reuse, distribute, or attempt to deploy this demo in real applications.

---

## 🚀 Features (in this demo)

- Authenticates with EasyTrack API using JWT (placeholder credentials)
- Retrieves mocked or placeholder bus position by plate
- Generates voice-ready XML via `xmlbuilder`
- HTTP endpoints for data refresh (`POST /update`) and voice retrieval (`GET /voice/:busKey`)

---

## 🛠 Tech Stack

- Node.js
- Express.js
- Axios
- dotenv
- xmlbuilder

---

## 🧪 Environment Configuration

Create a `.env` file using the provided `.env.example` template:

```
EASYTRACK_USER=your_api_user
EASYTRACK_PASS=your_api_password
BUS_1=bus_registration_1
BUS_2=bus_registration_2
BUS_3=bus_registration_3
```

> Use only **placeholder values**.  
> **Do not** place any real credentials or access tokens in this repository.

---

## ▶️ Running Locally (for demonstration/testing only)

```bash
npm install
node app.js
```

The service will run on `http://localhost:8080`.

---

## 📤 API Endpoints

- `POST /update` → Fetches and refreshes the latest XML data.
- `GET /voice/:busKey` → Returns the latest XML for `bus_1`, `bus_2`, or `bus_3`.

---

## 🔐 Production Usage

The real production version of this microservice is **not public** and contains:

- Real-time credentials managed securely
- Private vehicle data
- Enhanced error handling and deployment pipeline

If you are interested in technical details or collaboration, feel free to contact me.

---

## 🔒 License

This project is licensed under a **Restricted Demonstration License**.

- You are allowed to **view and evaluate** the code for personal, non-commercial purposes only.
- You are **not permitted** to copy, reuse, modify, redistribute, or deploy this code in any form.
- This repository exists solely as part of a **personal technical portfolio**.

Any use beyond reading the source code requires **prior written consent** from the author.