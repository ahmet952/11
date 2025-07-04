// Firebase yapılandırman varsa buraya ekle (isteğe bağlı)
// Örneğin:
// const firebaseConfig = { ... };
// firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging();

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
  izinIstegiVeSesHazirla();

  const saved = localStorage.getItem("tasks");
  if (saved) {
    taskList.innerHTML = saved;

    taskList.querySelectorAll("li").forEach(li => {
      const [time, desc] = li.querySelector("span").textContent.split(" - ");

      const now = new Date();
      const taskTime = new Date();
      const [hour, minute] = time.split(":");
      taskTime.setHours(hour, minute, 0, 0);

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
    });
  }
});

// Görev ekleme
taskForm.addEventListener("submit", (e) => {
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

  const now = new Date();
  const taskTime = new Date();
  const [hour, minute] = time.split(":");
  taskTime.setHours(hour, minute, 0, 0);

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

// Bildirim izni kontrol ve ses hazırlama fonksiyonu
function izinIstegiVeSesHazirla() {
  const izinDurumu = Notification.permission; // "granted", "denied" veya "default"

  if (izinDurumu === "granted") {
    console.log("İzin zaten verilmiş.");
    alarmSound.play().then(() => {
      alarmSound.pause();
      alarmSound.currentTime = 0;
      console.log("Ses hazırlandı.");
    }).catch(err => {
      console.log("Ses çalma engellendi:", err);
    });
    return;
  }

  if (izinDurumu === "denied") {
    console.log("İzin reddedilmiş, izin istenmeyecek.");
    return;
  }

  // İzin durumu "default" ise izin iste
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("Bildirim izni verildi.");
      alarmSound.play().then(() => {
        alarmSound.pause();
        alarmSound.currentTime = 0;
        console.log("Ses hazırlandı.");
      }).catch(err => {
        console.log("Ses çalma engellendi:", err);
      });
    } else {
      console.log("Bildirim izni reddedildi veya iptal edildi.");
    }
  });
}
