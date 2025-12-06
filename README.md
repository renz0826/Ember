# Ember

![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Ember** is a digital time capsule web application. It allows users to "seal" memories—comprising photos, titles, and descriptions—and schedule them to "open" at a specific future date. It features a dashboard with a calendar view and tools to manage your preserved moments.

## 🚀 Features

* **Preserve Moments:** Upload images and write stories to create a digital capsule.
* **Time Capsule Logic:** Set a future "Open Date" for every memory.
* **Visual Dashboard:** View upcoming moments and recently sealed items via a calendar interface.
* **Moment Management:**
    * **View:** Read descriptions and view full-size images of your moments.
    * **Edit:** Update the "Open Date" if you wish to extend the seal time.
    * **Delete:** Remove moments and automatically clean up associated image files from the server.
* **Sorting:** Filter moments by "Sealed" or "Unsealed" status.

## 🛠️ Technology Stack

* **Backend:** PHP (Native)
* **Database:** MySQL
* **Frontend:** HTML5, CSS, JavaScript
* **Architecture:** Component-based (Separated headers, nav, and button logic)

## 📂 Project Structure

```text
/Ember
├── assets/             # Icons and static resources
├── components/         # Reusable UI parts (nav.php, header.php, calendar.php)
├── database/           # SQL file directory for test moments
├── includes/           # Configs (db_connect.php, head.php)
├── pages/              # Contains all necessary pages (dashboard, preserve, and view moments)
├── uploads/            # Directory for user-uploaded images
index.php               # Main entry point, login page
```

## 📦 Installation & Setup

1. **Clone the repository** to your web server root (e.g., htdocs in XAMPP or www in WAMP).

```bash
git clone [https://github.com/renz0826/Ember]
```

2. **Database Setup**Create a MySQL database and run the following SQL command to create the moments table required by the application:

```SQL
CREATE TABLE moments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255),
    seal DATE NOT NULL,
    open DATE NOT NULL
);
```

3. **Configure Connection** Ensure includes/db_connect.php has your correct database credentials (host, username, password, db_name).

4. **Permissions** Ensure the /uploads/ directory has write permissions so PHP can save images.

## 📖 Usage

1. Navigate to home.php to see your dashboard.
2. Click "Preserve a Moment" to upload a photo and write a description.
3. Use **"My Moments"** to track which capsules are still sealed and which are ready to view.

## 👤 Authors

* **Renz Clyd Bedonia** - *Project Manager*
* **Mary Dawn Alido** - *Fronted Developer*
* **Joseph Junel Reyes** - *Fronted Developer*
* **Frandolph Joseph Guadalupe** - *Backend Developer*
* **Gem Adrian Candaganan** - *Backend Developer*
* **John Mark Panganiban** - *Database Manager*


├── view_moment.php     # Detailed view of a specific moment
├── my_moments.php      # List view of all moments
└── ...
