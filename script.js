import { initializeApp }       from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getDatabase, ref, push, onValue, serverTimestamp, query, orderByChild, limitToLast, set, onDisconnect, get }
                                  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "pairchat-77.firebaseapp.com",
    databaseURL: "https://pairchat-77-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pairchat-77",
    storageBucket: "pairchat-77.firebasestorage.app",
    messagingSenderId: "427287619713",
    appId: "1:427287619713:web:eb8d341ac2b2c3c2be4580",
    measurementId: "G-VB7P0FC0LP"
  };

  const app = initializeApp(firebaseConfig);
  const db  = getDatabase(app);

  let myUserId = null, myName = null, chatId = null;
  let notifOK = false, lastMsgKey = null;

  /* ── notifications ── */
  async function askNotif() {
    if (!("Notification" in window)) return;
    const r = await Notification.requestPermission();
    notifOK = r === "granted";
    updateNotifBtn();
  }
  function updateNotifBtn() {
    const b = document.getElementById("nb");
    if (!b) return;
    b.textContent  = notifOK ? "🔔 ON" : "🔕 Notify";
    b.style.color  = notifOK ? "#4ade80" : "";
  }
  function fireNotif(sender, text) {
    if (!notifOK || document.hasFocus()) return;
    const n = new Notification("💬 " + sender, {
      body: text.length > 90 ? text.slice(0,90)+"…" : text,
      tag: "pc", renotify: true
    });
    n.onclick = () => { window.focus(); n.close(); };
  }
  function ping() {
    try {
      const c = new AudioContext(), o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(c.destination);
      o.frequency.value = 920;
      g.gain.setValueAtTime(.25, c.currentTime);
      g.gain.exponentialRampToValueAtTime(.001, c.currentTime + .35);
      o.start(); o.stop(c.currentTime + .35);
    } catch {}
  }

  /* ── join ── */
  async function join() {
    const roomRaw = document.getElementById("ri").value.trim();
    const uid     = document.getElementById("ui").value.trim();
    const name    = document.getElementById("ni").value.trim() || uid;

    if (!roomRaw || !uid) { err("Room ID and User ID are required."); return; }

    chatId    = roomRaw.toUpperCase();
    myUserId  = uid;
    myName    = name;

    const btn = document.getElementById("jb");
    btn.textContent = "Connecting…"; btn.disabled = true;

    try {
      // check member count
      const snap = await get(ref(db, `rooms/${chatId}/members`));
      const members = snap.val() || {};
      const others  = Object.keys(members).filter(k => k !== myUserId);
      if (others.length >= 2) { err("Room is full! Max 2 people."); btn.textContent="Join"; btn.disabled=false; return; }

      // register presence
      const meRef = ref(db, `rooms/${chatId}/members/${myUserId}`);
      await set(meRef, { name: myName, online: true, at: serverTimestamp() });
      onDisconnect(meRef).update({ online: false });

      showChat();
      listenMembers();
      listenMsgs();
      askNotif();
    } catch(e) {
      err("Error: " + e.message);
      btn.textContent = "Join Chat"; btn.disabled = false;
    }
  }

  /* ── members listener ── */
  function listenMembers() {
    onValue(ref(db, `rooms/${chatId}/members`), snap => {
      const m = snap.val() || {};
      const others = Object.entries(m).filter(([k]) => k !== myUserId);
      const dot  = document.getElementById("dot");
      const who  = document.getElementById("who");
      if (others.length) {
        const [, d] = others[0];
        who.textContent = d.name || "Partner";
        dot.className   = "dot " + (d.online ? "on" : "off");
      } else {
        who.textContent = "Waiting for partner…";
        dot.className   = "dot off";
      }
    });
  }

  /* ── messages listener ── */
  function listenMsgs() {
    const q = query(ref(db, `rooms/${chatId}/messages`), orderByChild("ts"), limitToLast(300));
    onValue(q, snap => {
      const data = snap.val();
      const box  = document.getElementById("msgs");
      if (!data) return;

      const keys = Object.keys(data);
      const newest = keys[keys.length - 1];

      // notify on new message from partner
      if (lastMsgKey && newest !== lastMsgKey && data[newest].userId !== myUserId) {
        fireNotif(data[newest].name || "Partner", data[newest].text);
        ping();
      }
      lastMsgKey = newest;

      box.innerHTML = "";
      keys.forEach(k => {
        const m   = data[k];
        const me  = m.userId === myUserId;
        const ts  = m.ts ? new Date(m.ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) : "";
        const div = document.createElement("div");
        div.className = "msg " + (me ? "me" : "them");
        div.innerHTML = `
          <div class="bubble">
            <div class="txt">${esc(m.text)}</div>
            <div class="ts">${ts}</div>
          </div>
          ${!me ? `<div class="sname">${esc(m.name||m.userId)}</div>` : ""}
        `;
        box.appendChild(div);
      });
      box.scrollTop = box.scrollHeight;
    });
  }

  /* ── send ── */
  async function send() {
    const inp  = document.getElementById("inp");
    const text = inp.value.trim();
    if (!text || !chatId) return;
    inp.value = ""; resize(inp);
    await push(ref(db, `rooms/${chatId}/messages`), {
      userId: myUserId, name: myName, text, ts: serverTimestamp()
    });
  }

  /* ── helpers ── */
  function showChat() {
    document.getElementById("join").style.display  = "none";
    document.getElementById("chat").style.display  = "flex";
    document.getElementById("roomtag").textContent = "#" + chatId;
    document.getElementById("myname").textContent  = myName;
    document.getElementById("inp").focus();
  }
  function err(msg) {
    const e = document.getElementById("errmsg");
    e.textContent = msg; e.style.opacity = "1";
    setTimeout(() => e.style.opacity = "0", 4000);
  }
  function esc(s) {
    return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>");
  }

  /* ── globals ── */
  window.doJoin   = join;
  window.doSend   = send;
  window.doNotif  = askNotif;
  window.resize   = function(el) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 130) + "px";
  };
  window.keydown  = function(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  if (Notification.permission === "granted") notifOK = true;
  window.addEventListener("load", updateNotifBtn);
