<br />
<p align="center">
  <a href="https://tigerpool.onrender.com/">
    <img src="docs/assets/tigerpool_screenshot.png" alt="TigerPool Screenshot" width="600">
  </a>
  <h1 align="center">TigerPool</h1>
  <p align="center">
    A ridesharing platform built by and for Princeton students — streamline travel planning, save on costs, and make connections along the way.
  </p>
</p>

---

## 🏆 Why TigerPool?

Every semester, dozens of students flood listservs looking for affordable, reliable rides to airports or weekend trips. Manual posts get lost, messages pile up, and schedules don’t align. TigerPool solves this by:

* **Matching** riders & drivers by time, destination, and preferences
* **Filtering** rides by location radius, date/time, and group size
* **Notifying** participants via email when someone joins or leaves
* **Strengthening** campus connections through shared travel experiences

---

## ✨ Features & Functionality

* **CAS-backed Authentication**
  Secure single sign-on via Princeton’s CAS system.
* **Ride Creation & Discovery**

  * Autocomplete or map-pick your pickup & drop-off
  * Date/time selector that prevents past rides
  * Set maximum group size & optional cost-splitting notes
* **Dynamic Filtering & Sorting**
  Search by pickup/destination, date, time window, or radius (default: 2 miles)
* **Real-time Matching & Join/Leave Actions**
  Confirm via modal, with instant table updates
* **Email Notification Engine**

  * Ride creator gets an email when participants join/leave
  * Retry logic on failures to ensure reliability
* **Profile Dashboard**
  Toggle between **Current Rides** and **Ride History**, with quick “Join”/“Leave” controls
* **Responsive, Mobile-Friendly UI**
  Built with React & Bootstrap for a clean, intuitive experience

---

## 🛠️ Tech Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| **Frontend**   | React, React-Bootstrap, Google Maps API |
| **Backend**    | Python 3.11, Flask, Flask-Login         |
| **Database**   | PostgreSQL (hosted on Render)           |
| **Email**      | SendGrid (with retry & logging)         |
| **Deployment** | Render.com                              |

---

## 🚧 Architecture & Workflow

1. **User requests** ride creation/discovery →
2. **Flask API** validates input, stores in PostgreSQL →
3. **React frontend** fetches via REST endpoints →
4. **Websocket (future)** will enable live updates →
5. **SendGrid service** sends join/leave notifications

All sensitive keys (e.g., `APP_SECRET_KEY`, SendGrid API key) are managed via environment variables or a `.env` file.

---

## 📝 Development Setup

```bash
# 1. Clone & enter project
git clone https://github.com/your-org/TigerPool.git
cd TigerPool

# 2. Backend setup
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
export APP_SECRET_KEY="your-secret-key"
export SENDGRID_API_KEY="your-sendgrid-key"

# 3. Frontend setup
cd frontend
npm install
npm run build
cd ..

# 4. Run server
python runserver.py 5000
# Visit http://localhost:5000 in your browser
```

*For Dockerized development, see `docker-compose.yml`.*

---

## 🔄 Iterative Feedback Loop

We believe great products evolve with real user input:

1. **Prototype & Smoke Testing**
   Early features tested via print/log statements & manual UI flows.
2. **Coverage Audits**
   Ensured ≥ 90% code coverage to catch edge cases.
3. **White-Box & Black-Box Testing**
   Combined unit tests with manual user scenarios (invalid inputs, past dates).
4. **User Evaluations**
   In-person sessions with 4 Princeton students → logged 30+ actionable insights:

   * **Default radius** bump to 2 miles
   * **“See Ride”** shortcut on creation success
   * Option for **time-range** selection
   * Enhanced **table design** & future in-app messaging
5. **Rapid Iteration**
   Critical fixes (ride-time zones, email retries) deployed within 48 hours.

---

<p align="center">
  Built with ❤️ by the TigerPool Team
</p>
