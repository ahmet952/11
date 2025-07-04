// Firebase config ve init
const firebaseConfig = {
  apiKey: "AIzaSyAwFWM-YqQBuvjvAQ3dMFbPhSgOHuvyAqk",
  authDomain: "plan-bd9d8.firebaseapp.com",
  projectId: "plan-bd9d8",
  storageBucket: "plan-bd9d8.firebasestorage.app",
  messagingSenderId: "501991214743",
  appId: "1:501991214743:web:4e6d5deacba7b4ffa363d2",
  measurementId: "G-B4P9EDH14F"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

const clock = document.getElementById("clock");
const date = document.getElementById("date");
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const alarmSound = document.getElementById("alarm-sound");

const confirmBox = document.getElementById("confirm-box");
const confirmYes = document.getElementById("confirm-yes");
const confirmNo = document.getElementById("confirm-no");
const clearAll = document.getElementById("clear-all");

// Saat ve tarih güncelle
setInterval(() => {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString("tr-TR");
  date.textContent = now.toLocaleDateString("tr-TR");
}, 1000);

// Sayfa yüklendiğinde görevleri geri yükle ve alarmları kur
window.addEventListener("load", () => {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    taskList.innerHTML = saved;

    // Her görev için alarm kur
    taskList.querySelectorAll("li").forEach(li => {
      const timeText = li.querySelector("span").textContent.split(" - ")[0];
      const descText = li.querySelector("span").textContent.split(" - ")[1];

      const now = new Date();
      const taskTime = new Date();
      const [hour, minute] = timeText.split(":");
      taskTime.setHours(hour);
      taskTime.setMinutes(minute);
      taskTime.setSeconds(0);

      const diff = taskTime.getTime() - now.getTime();
      if (diff > 0) {
        setTimeout(() => {
          alarmSound.play().catch(console.error);

          // Bildirim göster (local)
          if (Notification.permission === "granted") {
            new Notification("Görev zamanı!", {
              body: descText,
              icon: "/alarm-icon.png"
            });
          }
        }, diff);
      }
    });
  }
});

// Görev ekleme
taskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const time = document.getElementById("task-time").value;
  const desc = document.getElementById("task-desc").value;

  const li = document.createElement("li");
  li.innerHTML = `
    <span>${time} - ${desc}</span>
    <div>
      <button onclick="markDone(this)">✔</button>
      <button onclick="deleteTask(this)">🗑</button>
    </div>
  `;
  taskList.appendChild(li);
  saveTasks();

  // Alarm kur
  const now = new Date();
  const taskTime = new Date();
  const [hour, minute] = time.split(":");
  taskTime.setHours(hour);
  taskTime.setMinutes(minute);
  taskTime.setSeconds(0);

  const diff = taskTime.getTime() - now.getTime();
  if (diff > 0) {
    setTimeout(() => {
      alarmSound.play().catch(console.error);

      if (Notification.permission === "granted") {
        new Notification("Görev zamanı!", {
          body: desc,
          icon: "/alarm-icon.png"
        });
      }
    }, diff);
  }

  taskForm.reset();
});

// Görevleri kaydet
function saveTasks() {
  localStorage.setItem("tasks", taskList.innerHTML);
}

// Görev tamamlandı işaretle
function markDone(btn) {
  btn.closest("li").classList.toggle("done");
  saveTasks();
}

// Görev sil
function deleteTask(btn) {
  btn.closest("li").remove();
  saveTasks();
}

// Tümünü sil
clearAll.addEventListener("click", () => {
  confirmBox.classList.remove("hidden");
});

confirmYes.addEventListener("click", () => {
  taskList.innerHTML = "";
  saveTasks();
  confirmBox.classList.add("hidden");
});

confirmNo.addEventListener("click", () => {
  confirmBox.classList.add("hidden");
});

// **Tek seferlik izin isteme ve ses hazırlama**
window.addEventListener("load", () => {
  const izinIstendi = localStorage.getItem("izinIstendi");

  if (!izinIstendi) {
    Notification.requestPermission().then(permission => {
      localStorage.setItem("izinIstendi", "true");

      if (permission === "granted") {
        console.log("Bildirim izni verildi.");

        alarmSound.play().then(() => {
          alarmSound.pause();
          alarmSound.currentTime = 0;
          console.log("Ses hazırlandı.");
        }).catch(() => {
          console.log("Ses çalma engellendi.");
        });

        // Firebase Messaging token al
        const vapidKey = 'BM-DCsqdeK61XRWVFy_xc5m294zJqD65JBC2k0UG1AG5XIUxnBus4MAlA-likjWr37xdIZN7dcm75Z_CW6CbwxY';
        messaging.getToken({ vapidKey }).then(token => {
          if (token) {
            console.log("FCM Token:", token);
            // Token'ı backend veya localStorage'a kaydedebilirsin
          } else {
            console.log("Token alınamadı");
          }
        }).catch(console.error);

      } else {
        console.log("Bildirim izni reddedildi.");
      }
    });
  } else {
    console.log("İzin daha önce soruldu.");
  }
});
