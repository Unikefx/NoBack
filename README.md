# 📸 NoBack

> **100% Private, Client-Side Instagram Follower & Following Comparator and Safe Unfollow Tracker.**

🌐 **Live Demo:** [https://unikefx.github.io/NoBack/](https://unikefx.github.io/NoBack/)

Easily compare your Instagram followers and following lists to find non-followers (who doesn't follow back), fans, and mutuals — all directly inside your browser without logging in or handing over your account credentials.

---

## ✨ Key Features

* 🔒 **100% Private & Client-Side:** Zero servers, zero logins, zero API calls. Your data never leaves your browser.
* 📁 **Multi-Format Parser:** Supports Official Instagram Data Exports (`followers.html`, `following.html`), JSON exports (`string_list_data`), plain text lists, and pasted HTML snippets.
* ⚡ **Smart Matching & Filtering:** Automatically handles `@` prefixes, whitespace, case insensitivity, and filtering.
* 📊 **Categorized Breakdown:**
  * **Don't Follow Back** (Accounts you follow, but don't follow you back)
  * **Your Fans** (Accounts that follow you, but you don't follow back)
  * **Mutual Followers** (Accounts following each other)
  * **All Unique Accounts**
* 📋 **Line-by-Line Copy Box:** Click to copy individual usernames, copy all line-by-line, or export to `.txt`.
* 🛡️ **Interactive Unfollow Tracker:**
  * **One-Click Profile Opener:** Opens the next profile on Instagram in a new tab and automatically marks it as completed.
  * **Auto-Next Loop:** Automatically opens profiles on a custom timer with human-like variable delay (+0s to +3s jitter).
  * **Safe Rate Limiter:** Built-in hourly rate counter with safety warnings (~15 unfollows/hour) to keep your account safe from IG blocks.
  * **Progress Bar & Slider:** Easily jump to any item number or drag the slider to sync your progress.
* 💾 **Session Auto-Save:** Automatically saves your lists and tracking progress in `localStorage` so you don't lose progress on page refresh.

---

## 🚀 Quick Start

1. **Clone or Download:**
   ```bash
   git clone https://github.com/your-username/insta-diff.git
   ```
2. **Open `index.html`:**
   Simply double-click `index.html` to launch the app in any modern web browser — no build steps or dependencies required!

---

## 📥 How to Get Your Instagram Data

1. Open Instagram on your phone or desktop and go to **Settings & Privacy** > **Accounts Center**.
2. Navigate to **Your Information and Permissions** > **Download Your Information**.
3. Select **Download or Transfer Information** and choose **Some of your information**.
4. Check **Followers and Following**.
5. Set format to **HTML** (or **JSON**) and request the file.
6. Once downloaded, extract the ZIP file and locate `followers.html` and `following.html` (or `followers_1.json` / `following.json`).
7. Drag & drop both files into **InstaDiff**!

---

## 🛡️ Privacy & Safety First

Unlike third-party mobile apps that require your Instagram username and password (which risks account bans or compromise), **InstaDiff**:
* Does **NOT** ask for passwords or session tokens.
* Executes 100% locally in your web browser.
* Includes rate-limit helpers to prevent aggressive unfollowing actions.

---

## 🛠️ Built With

* **HTML5** & **Vanilla CSS3** (Custom Dark Theme UI)
* **Modern JavaScript (ES6+)**
* **FontAwesome 6** (Icons)

---

## 📜 Disclaimer

This project is an independent tool developed for personal privacy and data management. It is not affiliated with, endorsed by, or associated with Instagram or Meta Platforms, Inc. Always adhere to Instagram's Terms of Use when managing your account.
