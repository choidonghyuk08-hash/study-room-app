import React, { useEffect, useMemo, useRef, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCoGWdjnnE3j9FgClgRzdm8yVXMBTAJKPg",
  authDomain: "study-room-afa3a.firebaseapp.com",
  projectId: "study-room-afa3a",
  storageBucket: "study-room-afa3a.firebasestorage.app",
  messagingSenderId: "546251776377",
  appId: "1:546251776377:web:3e7ca35fa082755a524fa8",
  measurementId: "G-9X1G2EBMES"
};




const THEME_COLORS = {
  blue: {
    label: "파랑",
    accent: "#3182f6",
    accentDark: "#1b64da",
    accentSoft: "#eff6ff",
    accentSoft2: "#dbeafe",
    accentSoft3: "#bfdbfe",
    accentText: "#1d4ed8",
    accentShadow: "rgba(49,130,246,0.24)",
  },
  red: {
    label: "빨강",
    accent: "#e5484d",
    accentDark: "#c92a2f",
    accentSoft: "#fff1f2",
    accentSoft2: "#ffe4e6",
    accentSoft3: "#fecdd3",
    accentText: "#be123c",
    accentShadow: "rgba(229,72,77,0.24)",
  },
  green: {
    label: "초록",
    accent: "#00a661",
    accentDark: "#008c54",
    accentSoft: "#ecfdf3",
    accentSoft2: "#dcfce7",
    accentSoft3: "#bbf7d0",
    accentText: "#047857",
    accentShadow: "rgba(0,166,97,0.24)",
  },
  purple: {
    label: "보라",
    accent: "#8b5cf6",
    accentDark: "#6d28d9",
    accentSoft: "#f5f3ff",
    accentSoft2: "#ede9fe",
    accentSoft3: "#ddd6fe",
    accentText: "#6d28d9",
    accentShadow: "rgba(139,92,246,0.24)",
  },
  black: {
    label: "검정",
    accent: "#191f28",
    accentDark: "#000000",
    accentSoft: "#f2f4f6",
    accentSoft2: "#e5e8eb",
    accentSoft3: "#d1d6db",
    accentText: "#191f28",
    accentShadow: "rgba(25,31,40,0.22)",
  },
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ICONS = {
  logo: "/icons/study-room-logo.png",
  home: "/icons/home-icon.png",
  planner: "/icons/planner-icon.png",
  chat: "/icons/chat-icon.png",
  room: "/icons/room-icon.png",
  profile: "/icons/profile-icon.png",
};

function IconImage({ src, alt, size = 32, style = {} }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
        ...style,
      }}
    />
  );
}

const S = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "var(--app-bg)",
    color: "var(--text-main)",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    padding: 0,
    margin: 0,
    boxSizing: "border-box",
    overflowX: "hidden",
  },
  wrap: {
    width: "100%",
    maxWidth: "none",
    minHeight: "100vh",
    margin: 0,
    background: "var(--app-bg)",
    borderRadius: 0,
    padding: "14px 18px",
    boxSizing: "border-box",
    overflowX: "hidden",
  },
  card: {
    background: "var(--card-bg)",
    border: "1px solid var(--border)",
    borderRadius: 24,
    padding: 16,
    boxShadow: "0 12px 34px rgba(25,31,40,0.06)",
  },
  input: {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid transparent",
  borderRadius: 16,
  padding: "10px 12px",
  fontSize: 13,
  outline: "none",
  background: "var(--input-bg)",
  color: "var(--text-main)",
  WebkitTextFillColor: "var(--text-main)",
  caretColor: "var(--accent)",
},
  textarea: {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid transparent",
  borderRadius: 16,
  padding: "10px 12px",
  fontSize: 13,
  outline: "none",
  minHeight: 58,
  resize: "vertical",
  background: "var(--input-bg)",
  color: "var(--text-main)",
  WebkitTextFillColor: "var(--text-main)",
  caretColor: "var(--accent)",
},
  button: {
    border: "none",
    borderRadius: 16,
    padding: "10px 14px",
    fontWeight: 850,
    cursor: "pointer",
    background: "var(--accent)",
    color: "white",
    boxShadow: "0 8px 18px var(--accent-shadow)",
  },
  lightButton: {
    border: "1px solid transparent",
    borderRadius: 16,
    padding: "10px 14px",
    fontWeight: 850,
    cursor: "pointer",
    background: "var(--input-bg)",
    color: "var(--text-main)",
  },
  small: { color: "var(--text-sub)", fontSize: 12 },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 800,
    color: "var(--text-mid)",
    marginBottom: 4,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 10,
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 10,
  },
  modalBg: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: 16,
  },
  modal: {
    width: "100%",
    maxWidth: 850,
    maxHeight: "90vh",
    overflow: "auto",
    background: "var(--card-bg-solid)",
    borderRadius: 28,
    padding: 18,
  },
};

const todayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const studyDayString = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(d.getHours() - 6);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const nowTime = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(
    2,
    "0"
  )}`;
};

const formatTimer = (sec) => {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const formatStudy = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}시간 ${m}분`;
  return `${m}분`;
};

const normalizeId = (v) => v.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 12);
const normalizePw = (v) => v.replace(/[^a-zA-Z0-9*-]/g, "").slice(0, 20);
const normalizeRoomCode = (v) =>
  v.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 8);
const normalizeRoomPw = (v) => v.replace(/[^0-9]/g, "").slice(0, 8);
const loginEmail = (id) => `${id}@studyroom.local`;

const timeTableHours = [
  ...Array.from({ length: 18 }, (_, i) => `${String(i + 6).padStart(2, "0")}:00`),
  ...Array.from({ length: 6 }, (_, i) => `${String(i).padStart(2, "0")}:00`),
];

const SOUND_OPTIONS = [
  { id: "white", label: "백색소음", src: "/sounds/white.mp3" },
  { id: "rain", label: "빗소리", src: "/sounds/rain.mp3" },
  { id: "fireplace", label: "장작소리", src: "/sounds/fireplace.mp3" },
  { id: "whale", label: "고래소리", src: "/sounds/whale.mp3" },
  { id: "airplane", label: "비행기 소리", src: "/sounds/airplane.mp3", notice: "초반에 안내방송이 들어 있습니다. 집중 전 미리 확인해 주세요." },
];

function Modal({ title, onClose, children }) {
  return (
    <div style={S.modalBg}>
      <div style={S.modal}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ marginTop: 0 }}>{title}</h2>
          <button style={S.lightButton} onClick={onClose}>
            닫기
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div
      style={{
        borderTop: "1px solid #d4d4d8",
        paddingTop: 6,
        marginTop: 12,
        fontSize: 10,
        fontWeight: 900,
        letterSpacing: 1.2,
        color: "#52525b",
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const today = studyDayString();
  const isCompactScreen = typeof window !== "undefined" && window.innerWidth <= 900;

  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [authMode, setAuthMode] = useState("login");
  const [authMsg, setAuthMsg] = useState("");
  const [themeKey, setThemeKey] = useState(() => {
    if (typeof window === "undefined") return "blue";
    return window.localStorage.getItem("studyRoomTheme") || "blue";
  });
  const currentTheme = THEME_COLORS[themeKey] || THEME_COLORS.blue;
  const themeVars = {
    "--accent": currentTheme.accent,
    "--accent-dark": currentTheme.accentDark,
    "--accent-soft": currentTheme.accentSoft,
    "--accent-soft-2": currentTheme.accentSoft2,
    "--accent-soft-3": currentTheme.accentSoft3,
    "--accent-text": currentTheme.accentText,
    "--accent-shadow": currentTheme.accentShadow,
    "--app-bg": "#f7f8fa",
    "--card-bg": "rgba(255,255,255,0.96)",
    "--card-bg-solid": "white",
    "--text-main": "#191f28",
    "--text-sub": "#8b95a1",
    "--text-mid": "#4e5968",
    "--input-bg": "#f2f4f6",
    "--soft-bg": "#f7f8fa",
    "--soft-bg-2": "#f2f4f6",
    "--border": "rgba(229,232,235,0.85)",
    "--border-soft": "#eef1f4",
  };
  const changeTheme = (nextTheme) => {
    setThemeKey(nextTheme);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("studyRoomTheme", nextTheme);
    }
  };
  const [signup, setSignup] = useState({ id: "", pw: "", pw2: "" });
  const [login, setLogin] = useState({ id: "", pw: "" });
  const [idCheck, setIdCheck] = useState({ id: "", ok: false, msg: "" });

  const [profile, setProfile] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    displayName: "",
    bio: "",
    defaultGoal: "",
    newPw: "",
    newPw2: "",
  });
  const [profileMsg, setProfileMsg] = useState("");

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [enteredGroupId, setEnteredGroupId] = useState("");
  const [members, setMembers] = useState([]);
  const [groupMsg, setGroupMsg] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [roomMenuOpen, setRoomMenuOpen] = useState(false);
  const [createRoom, setCreateRoom] = useState({
    name: "",
    description: "",
    goal: "",
    password: "",
  });
  const [pendingCode, setPendingCode] = useState("");
  const [codeMsg, setCodeMsg] = useState("");
  const [joinRoom, setJoinRoom] = useState({ code: "", password: "" });
  const [showRoomPassword, setShowRoomPassword] = useState(false);

  const [subjects, setSubjects] = useState([
    "국어",
    "수학",
    "영어",
    "생활과 윤리",
    "화학",
    "생명과학",
    "한국사",
  ]);
  const [subject, setSubject] = useState("영어");
  const [newSubject, setNewSubject] = useState("");
  const [detail, setDetail] = useState("");

  const [studying, setStudying] = useState(false);
  const [totalSec, setTotalSec] = useState(0);
  const [sessionSec, setSessionSec] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [liveStudy, setLiveStudy] = useState(null);
  const [nowTick, setNowTick] = useState(Date.now());

  const [records, setRecords] = useState([]);
  const [groupRecords, setGroupRecords] = useState([]);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatNotice, setChatNotice] = useState(true);
  const [unread, setUnread] = useState(0);
  const [messages, setMessages] = useState([]);
  const [chatText, setChatText] = useState("");

  const soundRef = useRef(null);
  const [soundType, setSoundType] = useState("white");
  const [soundVolume, setSoundVolume] = useState(45);
  const [soundPlaying, setSoundPlaying] = useState(false);

  const [ddays, setDdays] = useState([]);
  const [ddayOpen, setDdayOpen] = useState(false);
  const [selectedDdayId, setSelectedDdayId] = useState("");
  const [plannerDdayId, setPlannerDdayId] = useState("");
  const [editingDdayId, setEditingDdayId] = useState("");
  const [ddayForm, setDdayForm] = useState({
    title: "",
    date: today,
    category: "시험",
    priority: "보통",
    memo: "",
  });

  const [plannerOpen, setPlannerOpen] = useState(false);
  const [plannerDate, setPlannerDate] = useState(today);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [memos, setMemos] = useState({});

  const uid = user?.uid || "";
  const userId = profile?.userId || "";
  const displayName = profile?.displayName || userId || "나";

  const currentGroup = groups.find((g) => g.id === enteredGroupId) || null;
  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || null;
  const selectedGroupBannedMembers = Object.values(selectedGroup?.bannedMembers || {}).sort(
    (a, b) => (b.bannedAtMs || 0) - (a.bannedAtMs || 0)
  );
  const currentSound = SOUND_OPTIONS.find((item) => item.id === soundType) || SOUND_OPTIONS[0];

  useEffect(() => {
    setShowRoomPassword(false);
  }, [selectedGroupId]);

  useEffect(() => {
    if (!soundRef.current) return;
    soundRef.current.volume = soundVolume / 100;
  }, [soundVolume]);

  useEffect(() => {
    if (!soundRef.current) return;

    soundRef.current.pause();
    soundRef.current.currentTime = 0;
    soundRef.current.load();

    if (soundPlaying) {
      soundRef.current
        .play()
        .catch(() => {
          setSoundPlaying(false);
          alert("브라우저가 자동 재생을 차단했습니다. 재생 버튼을 다시 눌러 주세요.");
        });
    }
  }, [soundType]);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.pause();
      }
    };
  }, []);

  const playSound = async () => {
    if (!soundRef.current) return;

    try {
      soundRef.current.loop = true;
      soundRef.current.volume = soundVolume / 100;
      await soundRef.current.play();
      setSoundPlaying(true);
    } catch (error) {
      console.error("백색소음 재생 실패:", error);
      alert("소리를 재생할 수 없습니다. 파일 위치가 public/sounds 안에 있는지 확인해 주세요.");
    }
  };

  const stopSound = () => {
    if (!soundRef.current) return;
    soundRef.current.pause();
    setSoundPlaying(false);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingAuth(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(doc(db, "users", uid), (snap) => {
      if (snap.exists()) setProfile({ uid, ...snap.data() });
    });
    return () => unsub();
  }, [uid]);

  useEffect(() => {
    if (!uid) {
      setLiveStudy(null);
      setStudying(false);
      setTotalSec(0);
      setSessionSec(0);
      setStartedAt(null);
      return;
    }

    const liveStudyRef = doc(db, "users", uid, "liveStudy", "current");

    const unsub = onSnapshot(liveStudyRef, (snap) => {
      if (!snap.exists()) {
        setLiveStudy(null);
        setStudying(false);
        setTotalSec(0);
        setSessionSec(0);
        setStartedAt(null);
        return;
      }

      const data = snap.data();
      setLiveStudy(data);

      if (data.studying) {
        setStudying(true);
        setStartedAt(data.startedAtLabel || null);
        if (data.subject) setSubject(data.subject);
        if (data.detail) setDetail(data.detail);
      } else {
        setStudying(false);
        setTotalSec(0);
        setSessionSec(0);
        setStartedAt(null);
      }
    });

    return () => unsub();
  }, [uid]);

  useEffect(() => {
    if (!uid) {
      setGroups([]);
      return;
    }

    const unsub = onSnapshot(collection(db, "groups"), (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const mine = all.filter((g) => (g.memberUids || []).includes(uid));
      mine.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setGroups(mine);

      const stillInEnteredGroup = enteredGroupId
        ? mine.some((g) => g.id === enteredGroupId)
        : true;

      if (enteredGroupId && !stillInEnteredGroup) {
        setEnteredGroupId("");
        setSelectedGroupId(mine[0]?.id || "");
        setGroupMsg("현재 방에서 나갔거나 추방되었습니다.");
        return;
      }

      if (!enteredGroupId && mine[0]) {
        setEnteredGroupId(mine[0].id);
        setSelectedGroupId(mine[0].id);
      }
    });

    return () => unsub();
  }, [uid, enteredGroupId]);

  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(collection(db, "studyRecords"), (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRecords(all.filter((r) => r.ownerUid === uid));
      setGroupRecords(all);
    });
    return () => unsub();
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(collection(db, "users", uid, "ddays"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => String(a.date).localeCompare(String(b.date)));
      setDdays(list);

      if (!selectedDdayId && list[0]) {
        setSelectedDdayId(list[0].id);
        setPlannerDdayId(list[0].id);
      }
    });
    return () => unsub();
  }, [uid, selectedDdayId]);

  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(collection(db, "users", uid, "plannerMemos"), (snap) => {
      const obj = {};
      snap.docs.forEach((d) => {
        obj[d.id] = d.data().text || "";
      });
      setMemos(obj);
    });
    return () => unsub();
  }, [uid]);

  useEffect(() => {
    if (!enteredGroupId) {
      setMembers([]);
      setMessages([]);
      return;
    }

    const unsubMembers = onSnapshot(
      collection(db, "groups", enteredGroupId, "members"),
      (snap) => {
        setMembers(snap.docs.map((d) => ({ uid: d.id, ...d.data() })));
      }
    );

    const unsubMessages = onSnapshot(
      collection(db, "groups", enteredGroupId, "messages"),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort(
          (a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
        );
        setMessages(list);
      }
    );

    return () => {
      unsubMembers();
      unsubMessages();
    };
  }, [enteredGroupId]);

  useEffect(() => {
    if (!uid || !enteredGroupId) return;

    const memberRef = doc(db, "groups", enteredGroupId, "members", uid);

    const sendHeartbeat = async () => {
      try {
        await setDoc(
          memberRef,
          {
            uid,
            userId,
            displayName,
            role: currentGroup?.ownerUid === uid ? "방장" : "참여자",
            lastSeenAtMs: Date.now(),
            lastSeenLabel: nowTime(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("접속 상태 업데이트 실패:", error);
      }
    };

    sendHeartbeat();
    const heartbeatTimer = setInterval(sendHeartbeat, 30000);

    const handleVisibilityChange = () => {
      if (!document.hidden) sendHeartbeat();
    };

    window.addEventListener("focus", sendHeartbeat);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(heartbeatTimer);
      window.removeEventListener("focus", sendHeartbeat);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [uid, enteredGroupId, userId, displayName, currentGroup?.ownerUid]);

  useEffect(() => {
    if (!liveStudy?.studying || !liveStudy.startedAtMs) return;

    const updateTimer = () => {
      const baseSeconds = liveStudy.baseSeconds || 0;
      const elapsed = Math.floor((Date.now() - liveStudy.startedAtMs) / 1000);
      const nextSeconds = Math.max(0, baseSeconds + elapsed);

      setTotalSec(nextSeconds);
      setSessionSec(nextSeconds);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [liveStudy]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTick(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!studying) return;
    const last = messages[messages.length - 1];
    if (last && last.senderUid !== uid) setUnread((v) => v + 1);
  }, [messages, studying, uid]);

  const selectedDday = ddays.find((d) => d.id === selectedDdayId) || null;
  const plannerDday = ddays.find((d) => d.id === plannerDdayId) || selectedDday;

  const getRecordStudyDate = (record) => record.studyDate || record.date;
  const todayRecords = records.filter((r) => getRecordStudyDate(r) === today);
  const plannerRecords = records.filter((r) => getRecordStudyDate(r) === plannerDate);
  const todayTotal = todayRecords.reduce((s, r) => s + (r.seconds || 0), 0);
  const currentSessionSeconds = studying ? totalSec : 0;
  const currentSessionStudyDate = liveStudy?.studyDate || today;
  const currentSessionCountsToday = studying && currentSessionStudyDate === today;
  const todayTotalWithLive = todayTotal + (currentSessionCountsToday ? currentSessionSeconds : 0);
  const currentSubjectTodayTotal =
    todayRecords
      .filter((r) => r.subject === subject)
      .reduce((s, r) => s + (r.seconds || 0), 0) +
    (currentSessionCountsToday ? currentSessionSeconds : 0);
  const plannerTotal = plannerRecords.reduce((s, r) => s + (r.seconds || 0), 0);

  const recordDateMap = useMemo(() => {
    const obj = {};
    records.forEach((r) => {
      const key = getRecordStudyDate(r);
      obj[key] = (obj[key] || 0) + (r.seconds || 0);
    });
    return obj;
  }, [records]);

  const getMemberLiveSeconds = (member) => {
    if (!member?.studying) return 0;

    if (member.uid === uid) {
      return totalSec || 0;
    }

    if (member.liveStartedAtMs) {
      const baseSeconds = member.liveBaseSeconds || member.liveSeconds || 0;
      const elapsed = Math.floor((nowTick - member.liveStartedAtMs) / 1000);
      return Math.max(0, baseSeconds + elapsed);
    }

    return member.liveSeconds || 0;
  };

  const liveMembers = useMemo(() => {
    return members.map((m) => {
      const computedSeconds = getMemberLiveSeconds(m);

      if (m.uid !== uid) {
        return {
          ...m,
          liveSeconds: computedSeconds,
        };
      }

      return {
        ...m,
        displayName,
        subject,
        detail,
        studying,
        liveSeconds: computedSeconds,
        liveStudyDate: liveStudy?.studyDate || m.liveStudyDate,
      };
    });
  }, [members, uid, displayName, subject, detail, studying, totalSec, nowTick, liveStudy?.studyDate]);

  const getMemberTodaySavedSeconds = (member) => {
    if (!enteredGroupId || !member?.uid) return 0;

    return groupRecords
      .filter(
        (r) =>
          r.ownerUid === member.uid &&
          (r.sharedToGroups || []).includes(enteredGroupId) &&
          getRecordStudyDate(r) === today
      )
      .reduce((sum, r) => sum + (r.seconds || 0), 0);
  };

  const getMemberTodayTotalSeconds = (member) => {
    const liveStudyDate = member?.liveStudyDate || today;
    const liveSeconds = liveStudyDate === today ? getMemberLiveSeconds(member) : 0;
    return getMemberTodaySavedSeconds(member) + liveSeconds;
  };

  const groupTodayTotal = liveMembers.reduce(
    (sum, member) => sum + getMemberTodayTotalSeconds(member),
    0
  );

  const groupRankMembers = [...liveMembers].sort(
    (a, b) => getMemberTodayTotalSeconds(b) - getMemberTodayTotalSeconds(a)
  );

  const isMemberOnline = (member) => {
    if (!member) return false;
    if (member.uid === uid && enteredGroupId) return true;
    if (!member.lastSeenAtMs) return false;
    return nowTick - member.lastSeenAtMs < 65000;
  };

  const formatLastSeen = (member) => {
    if (isMemberOnline(member)) return "접속 중";
    if (!member?.lastSeenAtMs) return "접속 정보 없음";

    const diffSeconds = Math.max(0, Math.floor((nowTick - member.lastSeenAtMs) / 1000));
    if (diffSeconds < 60) return "방금 전 접속";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}분 전 접속`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시간 전 접속`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일 전 접속`;
  };

  const formatDday = (date) => {
    if (!date) return "";
    const a = new Date(`${today}T00:00:00`);
    const b = new Date(`${date}T00:00:00`);
    const diff = Math.ceil((b - a) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "D-DAY";
    if (diff > 0) return `D-${diff}`;
    return `D+${Math.abs(diff)}`;
  };

  const getRecordHour = (time) => {
    const h = Number(String(time).split(":")[0]);
    if (Number.isNaN(h)) return "";
    return `${String(h).padStart(2, "0")}:00`;
  };

  const recordsByHour = (hour, list) => list.filter((r) => getRecordHour(r.start) === hour);

  const groupedPlannerContents = (list) => {
    const map = new Map();

    list.forEach((record) => {
      const subjectName = String(record.subject || "과목 없음").trim() || "과목 없음";
      const detailText = String(record.detail || "세부 내용 없음").trim() || "세부 내용 없음";

      if (!map.has(subjectName)) {
        map.set(subjectName, new Set());
      }

      map.get(subjectName).add(detailText);
    });

    return Array.from(map.entries()).map(([subjectName, details]) => ({
      subject: subjectName,
      details: Array.from(details),
    }));
  };

  const getCalendarCells = () => {
    const y = calendarMonth.getFullYear();
    const m = calendarMonth.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const arr = [];

    for (let i = 0; i < first.getDay(); i++) arr.push(null);
    for (let d = 1; d <= last.getDate(); d++) {
      arr.push(`${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
    }
    return arr;
  };

  const checkId = async () => {
    const id = normalizeId(signup.id);
    if (!id) {
      setIdCheck({ id: "", ok: false, msg: "아이디를 입력해 주세요." });
      return;
    }

    const snap = await getDoc(doc(db, "userIds", id));
    if (snap.exists()) {
      setIdCheck({ id, ok: false, msg: `${id}는 이미 사용 중입니다.` });
    } else {
      setIdCheck({ id, ok: true, msg: `${id}는 사용할 수 있습니다.` });
    }
  };

  const doSignup = async () => {
    try {
      const id = normalizeId(signup.id);
      const pw = normalizePw(signup.pw);
      const pw2 = normalizePw(signup.pw2);

      if (!id) throw new Error("아이디를 입력해 주세요.");
      if (idCheck.id !== id || !idCheck.ok) throw new Error("아이디 중복 확인을 해 주세요.");
      if (!pw || !pw2) throw new Error("비밀번호를 두 번 입력해 주세요.");
      if (pw.length < 6) throw new Error("비밀번호는 최소 6글자 이상이어야 합니다.");
      if (pw !== pw2) throw new Error("비밀번호가 서로 다릅니다.");

      const cred = await createUserWithEmailAndPassword(auth, loginEmail(id), pw);

      await setDoc(doc(db, "userIds", id), {
        uid: cred.user.uid,
        createdAt: serverTimestamp(),
      });

      await setDoc(doc(db, "users", cred.user.uid), {
        userId: id,
        displayName: id,
        bio: "",
        defaultGoal: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setAuthMsg("");
    } catch (e) {
      setAuthMsg(e.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  const doLogin = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        loginEmail(normalizeId(login.id)),
        normalizePw(login.pw)
      );
      setAuthMsg("");
    } catch {
      setAuthMsg("아이디 또는 비밀번호가 맞지 않습니다.");
    }
  };

  const openProfile = () => {
    setProfileForm({
      displayName: profile?.displayName || userId,
      bio: profile?.bio || "",
      defaultGoal: profile?.defaultGoal || "",
      newPw: "",
      newPw2: "",
    });
    setProfileMsg("");
    setProfileOpen(true);
  };

  const saveProfile = async () => {
    try {
      const newPw = normalizePw(profileForm.newPw);
      const newPw2 = normalizePw(profileForm.newPw2);

      if ((newPw || newPw2) && newPw !== newPw2) {
        throw new Error("새 비밀번호가 서로 다릅니다.");
      }
      if (newPw) {
        if (newPw.length < 6) throw new Error("비밀번호는 최소 6글자 이상이어야 합니다.");
        await updatePassword(user, newPw);
      }

      await updateDoc(doc(db, "users", uid), {
        displayName: profileForm.displayName.trim() || userId,
        bio: profileForm.bio.trim(),
        defaultGoal: profileForm.defaultGoal.trim(),
        updatedAt: serverTimestamp(),
      });

      setProfileMsg("저장되었습니다.");
    } catch (e) {
      setProfileMsg(e.message || "저장 중 오류가 발생했습니다.");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setProfileOpen(false);
    setEnteredGroupId("");
    setSelectedGroupId("");
  };

  const randomCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from({ length: 8 }, () => letters[Math.floor(Math.random() * letters.length)]).join("");
  };

  const generateRoomCode = async () => {
    let code = "";
    let exists = true;
    let count = 0;

    while (exists) {
      code = randomCode();
      count += 1;
      const snap = await getDoc(doc(db, "roomCodes", code));
      exists = snap.exists();
    }

    setPendingCode(code);
    setCodeMsg(
      `중복 확인 완료: ${code}는 사용 가능해. ${
        count > 1 ? `${count}번 확인했습니다.` : "한 번에 생성되었습니다."
      }`
    );
    return code;
  };

  const createGroup = async () => {
    try {
      const name = createRoom.name.trim();
      const description = createRoom.description.trim() || "새로 만든 스터디 그룹";
      const goal = createRoom.goal.trim() || "오늘 목표를 정해 보세요";
      const password = normalizeRoomPw(createRoom.password);

      if (!name) throw new Error("방 이름을 입력해 주세요.");
      if (!/^[0-9]{8}$/.test(password)) throw new Error("비밀번호는 숫자 8개여야 합니다.");

      const code = pendingCode || (await generateRoomCode());
      const codeSnap = await getDoc(doc(db, "roomCodes", code));
      if (codeSnap.exists()) throw new Error("방 ID가 이미 있습니다. 다시 생성해 주세요.");

      const groupRef = await addDoc(collection(db, "groups"), {
        name,
        description,
        goal,
        roomCode: code,
        password,
        privacy: "private",
        ownerUid: uid,
        ownerUserId: userId,
        memberUids: [uid],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await setDoc(doc(db, "roomCodes", code), {
        groupId: groupRef.id,
        createdAt: serverTimestamp(),
      });

      await setDoc(doc(db, "groups", groupRef.id, "members", uid), {
        uid,
        userId,
        displayName,
        role: "방장",
        subject,
        detail,
        studying: false,
        liveSeconds: 0,
        lastSeenAtMs: Date.now(),
        lastSeenLabel: nowTime(),
        joinedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "groups", groupRef.id, "messages"), {
        senderUid: uid,
        senderName: displayName,
        text: "스터디 그룹을 만들었습니다.",
        createdAt: serverTimestamp(),
      });

      setSelectedGroupId(groupRef.id);
      setEnteredGroupId(groupRef.id);
      setCreateOpen(false);
      setPendingCode("");
      setCodeMsg("");
      setCreateRoom({ name: "", description: "", goal: "", password: "" });
      setGroupMsg(`방이 생성되었습니다. 방 ID는 ${code}입니다.`);
    } catch (e) {
      setGroupMsg(e.message || "방 생성 중 오류가 발생했습니다.");
    }
  };

  const joinGroup = async () => {
    try {
      const code = normalizeRoomCode(joinRoom.code);
      const password = normalizeRoomPw(joinRoom.password);

      if (!/^[A-Z]{8}$/.test(code)) throw new Error("방 ID는 영어 대문자 8자입니다.");
      if (!/^[0-9]{8}$/.test(password)) throw new Error("비밀번호는 숫자 8개입니다.");

      const codeSnap = await getDoc(doc(db, "roomCodes", code));
      if (!codeSnap.exists()) throw new Error("해당 방 ID를 찾을 수 없습니다.");

      const groupId = codeSnap.data().groupId;
      const groupSnap = await getDoc(doc(db, "groups", groupId));
      if (!groupSnap.exists()) throw new Error("방 정보를 찾을 수 없습니다.");

      const group = { id: groupId, ...groupSnap.data() };
      if (group.password !== password) throw new Error("방 ID 또는 비밀번호가 틀렸습니다.");

      const bannedUids = group.bannedUids || [];
      const bannedMembers = group.bannedMembers || {};
      if (bannedUids.includes(uid) || bannedMembers[uid]) {
        throw new Error("방장에 의해 추방된 계정입니다. 방장이 재입장을 허용해야 다시 입장할 수 있습니다.");
      }

      const nextMembers = Array.from(new Set([...(group.memberUids || []), uid]));

      await updateDoc(doc(db, "groups", groupId), {
        memberUids: nextMembers,
        updatedAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, "groups", groupId, "members", uid),
        {
          uid,
          userId,
          displayName,
          role: group.ownerUid === uid ? "방장" : "참여자",
          subject,
          detail,
          studying: false,
          liveSeconds: 0,
          lastSeenAtMs: Date.now(),
          lastSeenLabel: nowTime(),
          joinedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setSelectedGroupId(groupId);
      setEnteredGroupId(groupId);
      setJoinRoom({ code: "", password: "" });
      setGroupMsg(`${group.name}에 입장했습니다.`);
    } catch (e) {
      setGroupMsg(e.message || "방 입장 중 오류가 발생했습니다.");
    }
  };

  const deleteGroup = async (group) => {
  if (!group) return;

  if (group.ownerUid !== uid) {
    alert("방장만 방을 삭제할 수 있습니다.");
    return;
  }

  const ok = window.confirm(
    `정말 "${group.name}" 방을 삭제하시겠습니까?\n\n삭제하면 방 정보, 그룹원 정보, 채팅 기록이 삭제되며 되돌릴 수 없습니다.`
  );

  if (!ok) return;

  try {
    const membersSnap = await getDocs(collection(db, "groups", group.id, "members"));
    await Promise.all(membersSnap.docs.map((memberDoc) => deleteDoc(memberDoc.ref)));

    const messagesSnap = await getDocs(collection(db, "groups", group.id, "messages"));
    await Promise.all(messagesSnap.docs.map((messageDoc) => deleteDoc(messageDoc.ref)));

    if (group.roomCode) {
      await deleteDoc(doc(db, "roomCodes", group.roomCode));
    }

    await deleteDoc(doc(db, "groups", group.id));

    if (enteredGroupId === group.id) {
      setEnteredGroupId("");
    }

    if (selectedGroupId === group.id) {
      setSelectedGroupId("");
    }

    setGroupMsg(`"${group.name}" 방을 삭제했습니다.`);
  } catch (error) {
    console.error(error);
    setGroupMsg("방 삭제 중 오류가 발생했습니다.");
  }
};
  const kickMember = async (group, member) => {
    if (!group || !member) return;

    if (group.ownerUid !== uid) {
      alert("방장만 멤버를 추방할 수 있습니다.");
      return;
    }

    if (member.uid === uid) {
      alert("방장은 자기 자신을 추방할 수 없습니다.");
      return;
    }

    const memberName = member.displayName || member.userId || "선택한 멤버";
    const ok = window.confirm(
      `정말 "${memberName}"님을 이 방에서 추방하시겠습니까?\n\n추방된 멤버는 방장이 재입장을 허용하기 전까지 방 ID와 비밀번호를 입력해도 다시 입장할 수 없습니다.`
    );

    if (!ok) return;

    try {
      const nextMembers = (group.memberUids || []).filter((memberUid) => memberUid !== member.uid);
      const nextBannedUids = Array.from(new Set([...(group.bannedUids || []), member.uid]));
      const nextBannedMembers = {
        ...(group.bannedMembers || {}),
        [member.uid]: {
          uid: member.uid,
          userId: member.userId || "",
          displayName: memberName,
          role: member.role || "참여자",
          bannedAtMs: Date.now(),
          bannedAtLabel: nowTime(),
          bannedByUid: uid,
          bannedByName: displayName,
        },
      };

      await updateDoc(doc(db, "groups", group.id), {
        memberUids: nextMembers,
        bannedUids: nextBannedUids,
        bannedMembers: nextBannedMembers,
        updatedAt: serverTimestamp(),
      });

      await deleteDoc(doc(db, "groups", group.id, "members", member.uid));

      setGroupMsg(`"${memberName}"님을 방에서 추방했습니다. 방장이 재입장을 허용해야 다시 입장할 수 있습니다.`);
    } catch (error) {
      console.error(error);
      setGroupMsg("멤버 추방 중 오류가 발생했습니다.");
    }
  };

  const allowMemberReentry = async (group, bannedMember) => {
    if (!group || !bannedMember) return;

    if (group.ownerUid !== uid) {
      alert("방장만 재입장을 허용할 수 있습니다.");
      return;
    }

    const memberName = bannedMember.displayName || bannedMember.userId || "선택한 멤버";
    const ok = window.confirm(
      `"${memberName}"님의 재입장을 허용하시겠습니까?\n\n허용 후에는 해당 멤버가 방 ID와 비밀번호를 입력하면 다시 입장할 수 있습니다.`
    );

    if (!ok) return;

    try {
      const nextBannedUids = (group.bannedUids || []).filter((memberUid) => memberUid !== bannedMember.uid);
      const nextBannedMembers = { ...(group.bannedMembers || {}) };
      delete nextBannedMembers[bannedMember.uid];

      await updateDoc(doc(db, "groups", group.id), {
        bannedUids: nextBannedUids,
        bannedMembers: nextBannedMembers,
        updatedAt: serverTimestamp(),
      });

      setGroupMsg(`"${memberName}"님의 재입장을 허용했습니다. 이제 방 ID와 비밀번호로 다시 입장할 수 있습니다.`);
    } catch (error) {
      console.error(error);
      setGroupMsg("재입장 허용 중 오류가 발생했습니다.");
    }
  };

  const addSubject = () => {
    const value = newSubject.trim();
    if (!value || studying) return;
    if (!subjects.includes(value)) setSubjects((prev) => [...prev, value]);
    setSubject(value);
    setNewSubject("");
  };

  const startStudy = async () => {
    if (!subject || !detail.trim()) {
      alert("과목과 자세한 공부 내용을 입력해 주세요.");
      return;
    }

    if (!uid) {
      alert("로그인 정보가 확인되지 않았습니다. 다시 로그인해 주세요.");
      return;
    }

    const startMs = Date.now();
    const startLabel = nowTime();
    const startStudyDate = studyDayString(new Date(startMs));
    const sessionId = `${uid}-${startMs}`;
    const liveStudyRef = doc(db, "users", uid, "liveStudy", "current");

    await setDoc(
      liveStudyRef,
      {
        studying: true,
        sessionId,
        subject,
        detail,
        startedAtMs: startMs,
        startedAtLabel: startLabel,
        baseSeconds: 0,
        studyDate: startStudyDate,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setStudying(true);
    setStartedAt(startLabel);
    setSessionSec(0);
    setTotalSec(0);
    setUnread(0);

    if (enteredGroupId) {
      try {
        await setDoc(
          doc(db, "groups", enteredGroupId, "members", uid),
          {
            uid,
            userId,
            displayName,
            role: currentGroup?.ownerUid === uid ? "방장" : "참여자",
            subject,
            detail,
            studying: true,
            liveStartedAtMs: startMs,
            liveBaseSeconds: 0,
            liveSeconds: 0,
            liveStudyDate: startStudyDate,
            lastSeenAtMs: Date.now(),
            lastSeenLabel: nowTime(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("그룹 상태 업데이트 실패:", error);
      }
    }
  };

  const stopStudy = async () => {
    if (!uid) return;

    const end = nowTime();
    const liveStudyRef = doc(db, "users", uid, "liveStudy", "current");
    const recordRef = doc(collection(db, "studyRecords"));

    let result = null;

    try {
      result = await runTransaction(db, async (transaction) => {
        const liveSnap = await transaction.get(liveStudyRef);

        if (!liveSnap.exists()) {
          return { saved: false, reason: "no-live-study" };
        }

        const data = liveSnap.data();

        if (!data.studying) {
          return { saved: false, reason: "already-stopped" };
        }

        const liveSubject = data.subject || subject;
        const liveDetail = data.detail || detail;
        const liveStartedAt = data.startedAtLabel || startedAt || "시작 시간 없음";
        const recordStudyDate = data.studyDate || studyDayString(data.startedAtMs ? new Date(data.startedAtMs) : new Date());
        const finalSeconds = data.startedAtMs
          ? Math.max(
              0,
              (data.baseSeconds || 0) +
                Math.floor((Date.now() - data.startedAtMs) / 1000)
            )
          : sessionSec;

        if (finalSeconds > 0) {
          transaction.set(recordRef, {
            ownerUid: uid,
            ownerUserId: userId,
            ownerName: displayName,
            date: recordStudyDate,
            studyDate: recordStudyDate,
            subject: liveSubject,
            detail: liveDetail,
            seconds: finalSeconds,
            start: liveStartedAt,
            end,
            sharedToGroups: groups.map((g) => g.id),
            liveStudySessionId: data.sessionId || null,
            createdAt: serverTimestamp(),
          });
        }

        transaction.set(
          liveStudyRef,
          {
            studying: false,
            subject: liveSubject,
            detail: liveDetail,
            baseSeconds: 0,
            startedAtMs: null,
            startedAtLabel: null,
            stoppedAtLabel: end,
            studyDate: null,
            lastSessionSeconds: finalSeconds,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        return {
          saved: finalSeconds > 0,
          finalSeconds,
          subject: liveSubject,
          detail: liveDetail,
        };
      });
    } catch (error) {
      console.error("순공 종료 저장 실패:", error);
      alert("순공 기록 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    if (enteredGroupId) {
      await setDoc(
        doc(db, "groups", enteredGroupId, "members", uid),
        {
          studying: false,
          liveSeconds: 0,
          liveBaseSeconds: 0,
          liveStartedAtMs: null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    setStudying(false);
    setStartedAt(null);
    setSessionSec(0);
    setTotalSec(0);
    setUnread(0);
    setPlannerDate(today);

    if (result?.reason === "already-stopped") {
      setGroupMsg("이미 다른 기기에서 순공이 종료되었습니다.");
    }
  };

  const sendMessage = async () => {
    if (!enteredGroupId || !chatText.trim() || studying) return;

    await addDoc(collection(db, "groups", enteredGroupId, "messages"), {
      senderUid: uid,
      senderName: displayName,
      text: chatText.trim(),
      createdAt: serverTimestamp(),
    });

    setChatText("");
  };

  const saveMemo = async (date, text) => {
    setMemos((prev) => ({ ...prev, [date]: text }));
    await setDoc(
      doc(db, "users", uid, "plannerMemos", date),
      { text, updatedAt: serverTimestamp() },
      { merge: true }
    );
  };

  const openNewDday = () => {
    setEditingDdayId("");
    setDdayForm({
      title: "",
      date: today,
      category: "시험",
      priority: "보통",
      memo: "",
    });
    setDdayOpen(true);
  };

  const openEditDday = (d) => {
    setEditingDdayId(d.id);
    setDdayForm({
      title: d.title || "",
      date: d.date || today,
      category: d.category || "시험",
      priority: d.priority || "보통",
      memo: d.memo || "",
    });
    setDdayOpen(true);
  };

  const saveDday = async () => {
    const title = ddayForm.title.trim();
    if (!title || !ddayForm.date) return;

    if (editingDdayId) {
      await setDoc(
        doc(db, "users", uid, "ddays", editingDdayId),
        { ...ddayForm, title, updatedAt: serverTimestamp() },
        { merge: true }
      );
    } else {
      const ref = await addDoc(collection(db, "users", uid, "ddays"), {
        ...ddayForm,
        title,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSelectedDdayId(ref.id);
      setPlannerDdayId(ref.id);
      setEditingDdayId(ref.id);
    }
  };

  const deleteDday = async (id) => {
    await deleteDoc(doc(db, "users", uid, "ddays", id));
  };

  const moveMonth = (amount) => {
    setCalendarMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + amount, 1)
    );
  };


  const renderGroupRankCard = () => {
    return (
      <section style={{ ...S.card, padding: 14, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <div>
            <div style={{ ...S.small, fontWeight: 900, color: "var(--accent)" }}>그룹원 현황 및 랭킹</div>
            <h2 style={{ margin: "2px 0 0", fontSize: 20 }}>그룹 오늘 합계</h2>
            <p style={{ ...S.small, margin: "4px 0 0" }}>
              공부 기준일은 06:00부터 다음 날 06:00까지입니다.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <b style={{ color: "var(--text-main)", display: "block" }}>{formatTimer(groupTodayTotal)}</b>
            <div style={{ ...S.small, fontSize: 10 }}>
              <span style={{ color: "#22c55e", fontWeight: 900 }}>●</span> 접속 중
              <span style={{ color: "#cbd5e1", fontWeight: 900, marginLeft: 8 }}>●</span> 미접속
            </div>
          </div>
        </div>

        <div style={{ marginTop: 10, maxHeight: 390, overflowY: "auto" }}>
          {groupRankMembers.length ? (
            groupRankMembers.map((m, idx) => {
              const todaySeconds = getMemberTodayTotalSeconds(m);
              const savedSeconds = getMemberTodaySavedSeconds(m);
              const liveSeconds = (m.liveStudyDate || today) === today ? getMemberLiveSeconds(m) : 0;

              return (
                <div
                  key={m.uid}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "28px minmax(0, 1fr) auto",
                    gap: 8,
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid #eef1f4",
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 8,
                      background: idx === 0 ? "#fff7d6" : "#f2f4f6",
                      color: idx === 0 ? "#f59f00" : "#6b7684",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 950,
                      fontSize: 12,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                      <b style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {m.displayName || m.userId}
                      </b>
                      <span
                        title={formatLastSeen(m)}
                        style={{
                          flex: "0 0 auto",
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: isMemberOnline(m) ? "#22c55e" : "#cbd5e1",
                          boxShadow: isMemberOnline(m) ? "0 0 0 3px rgba(34,197,94,0.14)" : "none",
                        }}
                      />
                    </div>
                    <span style={{ ...S.small, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {m.studying
                        ? `공부 중 · ${m.subject || "과목 없음"} · ${isMemberOnline(m) ? "접속 중" : formatLastSeen(m)}`
                        : `휴식 · ${formatLastSeen(m)}`}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <b>{formatTimer(todaySeconds)}</b>
                    <div style={{ ...S.small, fontSize: 10 }}>
                      저장 {formatStudy(savedSeconds)}{liveSeconds > 0 ? ` · 진행 ${formatStudy(liveSeconds)}` : ""}
                    </div>
                    {currentGroup?.ownerUid === uid && m.uid !== uid && (
                      <button
                        type="button"
                        onClick={() => kickMember(currentGroup, m)}
                        style={{
                          marginTop: 6,
                          border: "1px solid #fecaca",
                          background: "#fff1f2",
                          color: "#dc2626",
                          borderRadius: 10,
                          padding: "5px 8px",
                          fontSize: 11,
                          fontWeight: 900,
                          cursor: "pointer",
                        }}
                      >
                        추방
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p style={S.small}>아직 그룹원이 없습니다.</p>
          )}
        </div>
      </section>
    );
  };

  const renderTodayPlannerCompact = (list, total, date) => {
    return (
      <div
        style={{
          ...S.card,
          padding: 10,
          marginTop: 0,
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, var(--accent-soft) 0%, var(--accent-soft-2) 45%, var(--accent-soft-3) 100%)",
            color: "var(--accent-text)",
            padding: "8px 10px",
            borderRadius: 12,
            marginBottom: 8,
            flex: "0 0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            border: "1px solid var(--accent-soft-2)",
          }}
        >
          <div>
            <div style={{ fontSize: 9, letterSpacing: 1.2, opacity: 0.85 }}>
              PERSONAL STUDY PLANNER
            </div>
            <h3 style={{ margin: "2px 0 0", fontSize: 16 }}>{date} 플래너</h3>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, opacity: 0.85 }}>오늘 순공</div>
            <b style={{ fontSize: 18 }}>{formatStudy(total)}</b>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isCompactScreen ? "1fr" : "minmax(0, 1.15fr) minmax(190px, 0.85fr)",
            gap: 10,
            flex: 1,
            minHeight: 0,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <SectionTitle>DATE</SectionTitle>
                <div style={{ fontSize: 13, fontWeight: 800 }}>{date}</div>
              </div>
              <div>
                <SectionTitle>D-DAY</SectionTitle>
                <select
                  style={{ ...S.input, padding: "6px 8px", fontSize: 11 }}
                  value={plannerDdayId}
                  onChange={(e) => setPlannerDdayId(e.target.value)}
                >
                  <option value="">D-DAY 없음</option>
                  {ddays.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title} · {formatDday(d.date)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {plannerDday && (
              <div
                style={{
                  background: "var(--input-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: 6,
                  marginTop: 6,
                  fontSize: 11,
                }}
              >
                <b>{plannerDday.title}</b> {formatDday(plannerDday.date)} · {plannerDday.category}
              </div>
            )}

            <SectionTitle>CONTENTS</SectionTitle>
            <div
              style={{
                background: "var(--input-bg)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: 7,
                minHeight: 54,
                flex: "0 0 auto",
                overflowY: "auto",
              }}
            >
              {list.length ? (
                groupedPlannerContents(list).map((group) => (
                  <div key={group.subject} style={{ fontSize: 11, marginBottom: 6 }}>
                    <b>{group.subject}</b>
                    <div style={{ color: "#52525b", marginTop: 2 }}>
                      {group.details.map((detailText) => (
                        <div key={detailText}>· {detailText}</div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <span style={{ ...S.small, fontSize: 11 }}>아직 오늘 기록된 공부가 없습니다.</span>
              )}
            </div>

            <SectionTitle>TASK</SectionTitle>
            <div
              style={{
                borderTop: "1px solid var(--border)",
                flex: 1,
                minHeight: 118,
                overflowY: "auto",
              }}
            >
              {list.length ? (
                list.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "74px 1fr 58px",
                      gap: 6,
                      padding: "5px 0",
                      borderBottom: "1px solid var(--border)",
                      fontSize: 11,
                    }}
                  >
                    <div style={{ color: "#71717a", fontSize: 10 }}>{r.start} - {r.end}</div>
                    <div>
                      <b>{r.subject}</b> <span style={{ color: "#71717a" }}>{r.detail}</span>
                    </div>
                    <b style={{ textAlign: "right" }}>{formatStudy(r.seconds || 0)}</b>
                  </div>
                ))
              ) : (
                <div style={{ padding: 8, ...S.small, fontSize: 11 }}>기록 없음</div>
              )}
            </div>

            <SectionTitle>MEMO</SectionTitle>
            <textarea
              style={{ ...S.textarea, minHeight: 64, padding: "7px 8px", fontSize: 11 }}
              value={memos[date] || ""}
              onChange={(e) => saveMemo(date, e.target.value)}
              placeholder="오늘 메모. 이 메모는 다른 사람에게 공유되지 않습니다."
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            <SectionTitle>TIME TABLE</SectionTitle>
            <div style={{ ...S.small, fontSize: 10 }}>06:00부터 다음날 05:00까지</div>
            <div
              style={{
                marginTop: 6,
                borderTop: "1px solid var(--border)",
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
              }}
            >
              {timeTableHours.map((hour) => {
                const hourRecords = recordsByHour(hour, list);
                return (
                  <div
                    key={hour}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "42px 1fr",
                      minHeight: 24,
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ paddingTop: 5, fontSize: 9, color: "#71717a" }}>{hour}</div>
                    <div style={{ padding: 2 }}>
                      {hourRecords.map((r) => (
                        <div
                          key={r.id}
                          style={{
                            background: "linear-gradient(135deg, var(--accent-soft) 0%, var(--accent-soft-2) 100%)",
                            border: "1px solid var(--accent-soft-3)",
                            color: "var(--accent-text)",
                            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.45)",
                            borderRadius: 7,
                            padding: 4,
                            fontSize: 9,
                            marginBottom: 2,
                          }}
                        >
                          <b>{r.subject}</b> · {r.start}-{r.end} · {formatStudy(r.seconds || 0)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPlanner = (list, total, date) => {
    return (
      <div style={S.card}>
        <div
          style={{
            background: "linear-gradient(135deg, var(--accent-soft) 0%, var(--accent-soft-2) 45%, var(--accent-soft-3) 100%)",
            color: "var(--accent-text)",
            padding: 16,
            borderRadius: 18,
            marginBottom: 18,
            border: "1px solid var(--accent-soft-2)",
          }}
        >
          <div style={{ fontSize: 12, letterSpacing: 2, opacity: 0.8 }}>
            PERSONAL STUDY PLANNER
          </div>
          <h2 style={{ margin: "6px 0 0" }}>{date} 공부 플래너</h2>
          <div style={{ fontSize: 13, marginTop: 5, opacity: 0.9 }}>
            공부 기록은 참여 방에 공유 · MEMO는 비공개
          </div>
        </div>

        <div style={S.grid2}>
          <div>
            <SectionTitle>DATE</SectionTitle>
            <h3>{date}</h3>

            <SectionTitle>D-DAY</SectionTitle>
            <select
              style={S.input}
              value={plannerDdayId}
              onChange={(e) => setPlannerDdayId(e.target.value)}
            >
              <option value="">D-DAY 없음</option>
              {ddays.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} · {formatDday(d.date)}
                </option>
              ))}
            </select>

            {plannerDday && (
              <div style={{ ...S.small, marginTop: 8 }}>
                <b>{plannerDday.title}</b> {formatDday(plannerDday.date)}
                <br />
                {plannerDday.category} · 중요도 {plannerDday.priority}
                {plannerDday.memo && (
                  <>
                    <br />
                    {plannerDday.memo}
                  </>
                )}
              </div>
            )}

            <SectionTitle>CONTENTS</SectionTitle>
            <div
              style={{
                background: "var(--input-bg)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 12,
                minHeight: 60,
              }}
            >
              {list.length ? (
                groupedPlannerContents(list).map((group) => (
                  <div key={group.subject} style={{ fontSize: 14, marginBottom: 10 }}>
                    <b>{group.subject}</b>
                    <div style={{ color: "#52525b", marginTop: 3 }}>
                      {group.details.map((detailText) => (
                        <div key={detailText}>· {detailText}</div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <span style={S.small}>기록된 공부 내용이 없습니다.</span>
              )}
            </div>

            <SectionTitle>TASK</SectionTitle>
            <div style={{ borderTop: "1px solid var(--border)" }}>
              {list.length ? (
                list.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "90px 1fr 80px",
                      gap: 8,
                      padding: "10px 0",
                      borderBottom: "1px solid var(--border)",
                      fontSize: 13,
                    }}
                  >
                    <div style={S.small}>
                      {r.start} - {r.end}
                    </div>
                    <div>
                      <b>{r.subject}</b>
                      <br />
                      <span style={S.small}>{r.detail}</span>
                    </div>
                    <b style={{ textAlign: "right" }}>{formatStudy(r.seconds || 0)}</b>
                  </div>
                ))
              ) : (
                <div style={{ padding: 12, ...S.small }}>기록 없음</div>
              )}
            </div>

            <SectionTitle>MEMO</SectionTitle>
            <textarea
              style={{ ...S.textarea, minHeight: 120 }}
              value={memos[date] || ""}
              onChange={(e) => saveMemo(date, e.target.value)}
              placeholder="오늘 느낀 점, 내일 할 일, 오답 메모 등을 적어줘. 이 메모는 다른 사람에게 공유되지 않습니다."
            />
            <div style={S.small}>MEMO는 본인만 볼 수 있는 비공개 메모입니다.</div>
          </div>

          <div>
            <SectionTitle>TOTAL</SectionTitle>
            <h1>{formatStudy(total)}</h1>

            <SectionTitle>TIME TABLE</SectionTitle>
            <div style={S.small}>06:00부터 다음날 05:00까지 하루 흐름으로 표시됩니다.</div>

            <div style={{ marginTop: 10, borderTop: "1px solid var(--border)" }}>
              {timeTableHours.map((hour) => {
                const hourRecords = recordsByHour(hour, list);
                return (
                  <div
                    key={hour}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "60px 1fr",
                      minHeight: 38,
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ paddingTop: 9, fontSize: 12, color: "#71717a" }}>
                      {hour}
                    </div>
                    <div style={{ padding: 5 }}>
                      {hourRecords.map((r) => (
                        <div
                          key={r.id}
                          style={{
                            background: "linear-gradient(135deg, var(--accent-soft) 0%, var(--accent-soft-2) 100%)",
                            border: "1px solid var(--accent-soft-3)",
                            color: "var(--accent-text)",
                            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.45)",
                            borderRadius: 10,
                            padding: 7,
                            fontSize: 12,
                            marginBottom: 4,
                          }}
                        >
                          <b>{r.subject}</b>
                          <br />
                          {r.start} - {r.end} · {formatStudy(r.seconds || 0)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loadingAuth) {
    return <div style={{ ...S.page, ...themeVars }}>앱을 불러오는 중입니다...</div>;
  }

  if (!user) {
    return (
      <div style={{ ...S.page, ...themeVars }}>
        <div style={{ maxWidth: 900, margin: "40px auto" }}>
          <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
            <div style={S.grid2}>
              <div style={{ background: "#191f28", color: "white", padding: 34 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 18,
                      background: "rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconImage src={ICONS.logo} alt="Study Room" size={38} />
                  </div>
                  <p style={{ color: "#a1a1aa", margin: 0, fontWeight: 900 }}>Study Room</p>
                </div>
                <h1 style={{ fontSize: 40, lineHeight: 1.1 }}>
                  친구와 공부하기 전, 먼저 로그인해 주세요.
                </h1>
                <p style={{ color: "#d4d4d8" }}>
                  회원가입, 방, 채팅, 공부 기록이 Firebase에 저장돼.
                </p>
                <div
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    padding: 16,
                    borderRadius: 18,
                    marginTop: 28,
                    fontSize: 14,
                  }}
                >
                  <b>회원가입 규칙</b>
                  <p>· 아이디: 영어와 숫자만, 최대 12글자</p>
                  <p>· 비밀번호: 영어, 숫자, *, -만, 최대 20글자</p>
                  <p>· Firebase 기준에 따라 비밀번호는 최소 6글자</p>
                </div>
              </div>

              <div style={{ padding: 34 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                  <button
                    style={authMode === "login" ? S.button : S.lightButton}
                    onClick={() => setAuthMode("login")}
                  >
                    로그인
                  </button>
                  <button
                    style={authMode === "signup" ? S.button : S.lightButton}
                    onClick={() => setAuthMode("signup")}
                  >
                    회원가입
                  </button>
                </div>

                {authMode === "login" ? (
                  <>
                    <h2>로그인</h2>
                    <Field label="아이디">
                      <input
                        style={S.input}
                        value={login.id}
                        onChange={(e) =>
                          setLogin((p) => ({ ...p, id: normalizeId(e.target.value) }))
                        }
                      />
                    </Field>
                    <Field label="비밀번호">
                      <input
                        style={S.input}
                        type="password"
                        value={login.pw}
                        onChange={(e) =>
                          setLogin((p) => ({ ...p, pw: normalizePw(e.target.value) }))
                        }
                      />
                    </Field>
                    <button style={{ ...S.button, width: "100%" }} onClick={doLogin}>
                      로그인
                    </button>
                  </>
                ) : (
                  <>
                    <h2>회원가입</h2>
                    <Field label="아이디">
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          style={S.input}
                          value={signup.id}
                          onChange={(e) => {
                            setSignup((p) => ({ ...p, id: normalizeId(e.target.value) }));
                            setIdCheck({ id: "", ok: false, msg: "" });
                          }}
                        />
                        <button style={S.lightButton} onClick={checkId}>
                          중복확인
                        </button>
                      </div>
                      <div
                        style={{
                          ...S.small,
                          marginTop: 6,
                          color: idCheck.ok ? "#15803d" : "#71717a",
                        }}
                      >
                        {idCheck.msg || "영어와 숫자만 가능, 최대 12글자"}
                      </div>
                    </Field>

                    <Field label="비밀번호">
                      <input
                        style={S.input}
                        type="password"
                        value={signup.pw}
                        onChange={(e) =>
                          setSignup((p) => ({ ...p, pw: normalizePw(e.target.value) }))
                        }
                      />
                    </Field>

                    <Field label="비밀번호 다시 입력">
                      <input
                        style={S.input}
                        type="password"
                        value={signup.pw2}
                        onChange={(e) =>
                          setSignup((p) => ({ ...p, pw2: normalizePw(e.target.value) }))
                        }
                      />
                    </Field>

                    {signup.pw2 && (
                      <p style={{ color: signup.pw === signup.pw2 ? "#15803d" : "#dc2626" }}>
                        {signup.pw === signup.pw2
                          ? "비밀번호가 일치합니다."
                          : "비밀번호가 일치하지 않습니다."}
                      </p>
                    )}

                    <button style={{ ...S.button, width: "100%" }} onClick={doSignup}>
                      회원가입 후 입장
                    </button>
                  </>
                )}

                {authMsg && (
                  <div
                    style={{
                      marginTop: 14,
                      background: "#fef2f2",
                      color: "#dc2626",
                      padding: 12,
                      borderRadius: 14,
                    }}
                  >
                    {authMsg}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...S.page, ...themeVars }}>
      <audio ref={soundRef} src={currentSound.src} loop preload="auto" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isCompactScreen ? "1fr" : "58px minmax(0, 1fr)",
          minHeight: "100vh",
          background: "var(--app-bg)",
        }}
      >
        {!isCompactScreen && (
          <aside
            style={{
              borderRight: "1px solid #eef1f4",
              background: "var(--card-bg-solid)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              padding: "14px 0",
              position: "sticky",
              top: 0,
              height: "100vh",
            }}
          >
            <button
              title="내 정보"
              onClick={openProfile}
              style={{
                width: 42,
                height: 42,
                border: "none",
                borderRadius: 16,
                background: "#f2f6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
                boxShadow: "0 8px 18px rgba(49,130,246,0.12)",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <IconImage src={ICONS.profile} alt="내 정보" size={34} />
            </button>
            {[
              { label: "홈", icon: ICONS.home },
              { label: "방", icon: ICONS.room },
              { label: "플래너", icon: ICONS.planner },
              { label: "채팅", icon: ICONS.chat },
            ].map((item, idx) => (
              <button
                key={item.label}
                title={item.label}
                onClick={() => {
                  if (item.label === "방") setRoomMenuOpen(true);
                  if (item.label === "플래너") setPlannerOpen(true);
                  if (item.label === "채팅") setChatOpen(true);
                }}
                style={{
                  width: 42,
                  height: 42,
                  border: "none",
                  borderRadius: 16,
                  background: idx === 0 ? "#edf4ff" : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                <IconImage src={item.icon} alt={item.label} size={28} />
              </button>
            ))}
          </aside>
        )}

        <div style={{ ...S.wrap, padding: isCompactScreen ? 12 : "10px 18px 18px" }}>
          <div
            style={{
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <IconImage src={ICONS.logo} alt="Study Room" size={34} />
                <h1
                  style={{
                    margin: 0,
                    fontSize: 18,
                    letterSpacing: -0.4,
                    color: "var(--text-main)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Study Room
                </h1>
              </div>
              <div
                style={{
                  height: 28,
                  padding: "0 10px",
                  borderRadius: 999,
                  background: "var(--card-bg-solid)",
                  border: "1px solid var(--border-soft)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "var(--text-sub)",
                  fontSize: 12,
                  minWidth: 0,
                }}
              >
                <span style={{ color: "var(--accent)", fontWeight: 900 }}>●</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {currentGroup?.name || "입장한 방 없음"}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <select
                style={{ ...S.input, width: isCompactScreen ? 140 : 190, height: 34, padding: "6px 10px" }}
                value={selectedDdayId}
                onChange={(e) => {
                  setSelectedDdayId(e.target.value);
                  setPlannerDdayId(e.target.value);
                }}
              >
                <option value="">D-DAY 없음</option>
                {ddays.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} · {formatDday(d.date)}
                  </option>
                ))}
              </select>
              <button style={{ ...S.lightButton, height: 34, padding: "6px 10px" }} onClick={openNewDday}>
                D-DAY
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isCompactScreen ? "1fr" : "minmax(0, 1fr) 320px",
              gap: 14,
              alignItems: "start",
            }}
          >
            <main style={{ minWidth: 0 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isCompactScreen
                    ? "1fr"
                    : "repeat(4, minmax(150px, 1fr))",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                {[
                  ["오늘 총 공부", formatTimer(todayTotalWithLive), studying ? "진행 중 포함" : "저장된 기록 기준", "var(--accent)"],
                  ["현재 과목", subject, formatTimer(currentSessionSeconds), "#00a661"],
                  ["과목 오늘 누적", formatStudy(currentSubjectTodayTotal), subject, "#8b5cf6"],
                  ["그룹 오늘 합계", formatTimer(groupTodayTotal), currentGroup?.name || "방 없음", "#f97316"],
                ].map(([title, value, desc, color]) => (
                  <div
                    key={title}
                    style={{
                      ...S.card,
                      padding: "13px 14px",
                      minHeight: 92,
                      border: "1px solid var(--border-soft)",
                    }}
                  >
                    <div style={{ ...S.small, fontWeight: 900 }}>{title}</div>
                    <div
                      style={{
                        fontSize: title === "현재 과목" ? 24 : 26,
                        fontWeight: 950,
                        letterSpacing: -1,
                        marginTop: 8,
                        color: "var(--text-main)",
                        lineHeight: 1.05,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {value}
                    </div>
                    <div style={{ ...S.small, marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: color, display: "inline-block" }} />
                      {desc}
                    </div>
                  </div>
                ))}
              </div>

              <section
                style={{
                  ...S.card,
                  padding: 14,
                  marginBottom: 12,
                  background: "linear-gradient(180deg, #ffffff 0%, #fbfcfd 100%)",
                  border: "1px solid var(--border-soft)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <div style={{ ...S.small, fontWeight: 900, color: "var(--accent)" }}>실시간 순공 측정</div>
                    <h2 style={{ margin: "2px 0 0", fontSize: 24, letterSpacing: -0.8 }}>
                      {studying ? `${subject} 공부 중` : "오늘 시작하기"}
                    </h2>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 42, fontWeight: 950, letterSpacing: -1.4, lineHeight: 1 }}>
                      {formatTimer(currentSessionSeconds)}
                    </div>
                    <div style={{ ...S.small, marginTop: 4 }}>
                      {studying ? `${startedAt}부터 측정 중` : "대기 중"}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isCompactScreen ? "1fr" : "minmax(0, 0.88fr) minmax(0, 1.12fr)",
                    gap: 12,
                    alignItems: "stretch",
                  }}
                >
                  <div
                    style={{
                      background: "var(--app-bg)",
                      border: "1px solid var(--border-soft)",
                      borderRadius: 18,
                      padding: 12,
                    }}
                  >
                    <div style={S.grid2}>
                      <Field label="과목 선택">
                        <select
                          style={S.input}
                          value={subject}
                          disabled={studying}
                          onChange={(e) => setSubject(e.target.value)}
                        >
                          {subjects.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </Field>

                      <Field label="과목 추가">
                        <div style={{ display: "flex", gap: 6 }}>
                          <input
                            style={S.input}
                            value={newSubject}
                            disabled={studying}
                            onChange={(e) => setNewSubject(e.target.value)}
                            placeholder="예 : 미적분"
                          />
                          <button style={{ ...S.lightButton, minWidth: 40 }} onClick={addSubject}>
                            +
                          </button>
                        </div>
                      </Field>
                    </div>

                    <Field label="자세한 공부 내용">
                      <textarea
                        style={{ ...S.textarea, minHeight: 70 }}
                        value={detail}
                        disabled={studying}
                        onChange={(e) => setDetail(e.target.value)}
                        placeholder="예 : 영어 단어 Day 12 암기 + 예문 복습"
                      />
                    </Field>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      {studying ? (
                        <button style={{ ...S.button, minWidth: 110 }} onClick={stopStudy}>
                          공부 종료
                        </button>
                      ) : (
                        <button
                          style={{ ...S.button, minWidth: 110 }}
                          disabled={!subject || !detail.trim()}
                          onClick={startStudy}
                        >
                          순공 시작
                        </button>
                      )}
                      <div style={{ ...S.small, lineHeight: 1.4 }}>
                        친구에게 표시: <b style={{ color: "var(--text-main)" }}>{subject}</b> · {detail}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "var(--card-bg-solid)",
                      border: "1px solid var(--border-soft)",
                      borderRadius: 18,
                      padding: 12,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                      <div>
                        <div style={{ ...S.small, fontWeight: 900 }}>내 스터디 그룹</div>
                        <h3 style={{ margin: "3px 0", fontSize: 17 }}>
                          {currentGroup?.name || selectedGroup?.name || "입장한 방 없음"}
                        </h3>
                        <p style={{ ...S.small, margin: 0 }}>
                          {currentGroup
                            ? `현재 입장 중 · 방 ID ${currentGroup.roomCode}`
                            : selectedGroup
                            ? `선택됨 · 방 ID ${selectedGroup.roomCode}`
                            : "왼쪽 메뉴의 방 버튼으로 방을 만들거나 입장할 수 있습니다."}
                        </p>
                      </div>
                      <button style={S.lightButton} onClick={() => setRoomMenuOpen(true)}>
                        방 관리
                      </button>
                    </div>

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginTop: 10 }}>
                      <select
                        style={{ ...S.input, flex: "1 1 150px", minWidth: 0 }}
                        value={selectedGroupId}
                        onChange={(e) => setSelectedGroupId(e.target.value)}
                        disabled={studying}
                      >
                        <option value="">방 선택</option>
                        {groups.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                      <button
                        style={S.button}
                        disabled={!selectedGroup || studying}
                        onClick={() => setEnteredGroupId(selectedGroup.id)}
                      >
                        입장
                      </button>
                      {selectedGroup?.ownerUid === uid && (
                        <button
                          style={{ ...S.lightButton, color: "#dc2626", borderColor: "#fecaca", background: "#fff1f2" }}
                          disabled={studying}
                          onClick={() => deleteGroup(selectedGroup)}
                        >
                          삭제
                        </button>
                      )}
                    </div>

                    {selectedGroup?.ownerUid === uid && (
                      <div
                        style={{
                          marginTop: 10,
                          padding: "10px 12px",
                          borderRadius: 14,
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 900, color: "#334155" }}>
                              방 비밀번호
                            </div>
                            <div style={{ ...S.small, fontSize: 11 }}>
                              방장에게만 보이는 정보입니다.
                            </div>
                          </div>
                          <button
                            type="button"
                            style={{
                              ...S.lightButton,
                              padding: "6px 9px",
                              fontSize: 12,
                              color: "var(--accent)",
                              borderColor: "var(--accent-soft-3)",
                              background: "var(--accent-soft)",
                            }}
                            onClick={() => setShowRoomPassword((v) => !v)}
                          >
                            {showRoomPassword ? "숨기기" : "확인"}
                          </button>
                        </div>
                        <div
                          style={{
                            marginTop: 8,
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                            fontSize: 18,
                            fontWeight: 900,
                            letterSpacing: 2,
                            color: "#0f172a",
                          }}
                        >
                          {showRoomPassword ? selectedGroup.password || "저장된 비밀번호 없음" : "••••••••"}
                        </div>
                      </div>
                    )}

                    {selectedGroup?.ownerUid === uid && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-soft)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                          <div>
                            <div style={{ ...S.small, fontWeight: 900 }}>추방 멤버 관리</div>
                            <div style={{ ...S.small, fontSize: 11, marginTop: 3 }}>
                              추방된 멤버는 재입장 허용 전까지 방 ID와 비밀번호를 입력해도 들어올 수 없습니다.
                            </div>
                          </div>
                        </div>

                        <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
                          {selectedGroupBannedMembers.length ? (
                            selectedGroupBannedMembers.map((member) => (
                              <div
                                key={member.uid}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: 8,
                                  padding: "8px 10px",
                                  borderRadius: 12,
                                  background: "#fff7ed",
                                  border: "1px solid #fed7aa",
                                }}
                              >
                                <div style={{ minWidth: 0 }}>
                                  <b style={{ display: "block", fontSize: 12, color: "#9a3412" }}>
                                    {member.displayName || member.userId || "이름 없음"}
                                  </b>
                                  <span style={{ ...S.small, fontSize: 10 }}>
                                    추방 시간 {member.bannedAtLabel || "정보 없음"}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => allowMemberReentry(selectedGroup, member)}
                                  style={{
                                    ...S.lightButton,
                                    flex: "0 0 auto",
                                    padding: "6px 9px",
                                    fontSize: 11,
                                    color: "var(--accent)",
                                    borderColor: "var(--accent-soft-3)",
                                    background: "var(--accent-soft)",
                                  }}
                                >
                                  재입장 허용
                                </button>
                              </div>
                            ))
                          ) : (
                            <div
                              style={{
                                padding: "8px 10px",
                                borderRadius: 12,
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                ...S.small,
                                fontSize: 11,
                              }}
                            >
                              추방된 멤버가 없습니다.
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-soft)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                        <div>
                          <div style={{ ...S.small, fontWeight: 900 }}>공부 중 채팅 알림</div>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              marginTop: 4,
                              padding: "4px 8px",
                              borderRadius: 999,
                              fontSize: 11,
                              fontWeight: 900,
                              background: chatNotice ? "#e8f7ee" : "#f2f4f6",
                              color: chatNotice ? "#008c54" : "#6b7684",
                            }}
                          >
                            현재 {chatNotice ? "켜짐" : "꺼짐"}
                          </div>
                        </div>
                        <button
                          style={{ ...S.lightButton, background: chatNotice ? "#191f28" : "white", color: chatNotice ? "white" : "#191f28" }}
                          onClick={() => setChatNotice((v) => !v)}
                        >
                          {chatNotice ? "알림 끄기" : "알림 켜기"}
                        </button>
                      </div>
                      <p style={{ ...S.small, margin: "7px 0 0", lineHeight: 1.35 }}>
                        알림만 표시됩니다. 순공 중에는 설정을 켜도 꺼도 채팅 내용은 볼 수 없습니다.
                      </p>
                    </div>

                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-soft)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                        <div>
                          <div style={{ ...S.small, fontWeight: 900 }}>백색소음</div>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              marginTop: 4,
                              padding: "4px 8px",
                              borderRadius: 999,
                              fontSize: 11,
                              fontWeight: 900,
                              background: soundPlaying ? "#e8f3ff" : "#f2f4f6",
                              color: soundPlaying ? "#1b64da" : "#6b7684",
                            }}
                          >
                            현재 {soundPlaying ? "재생 중" : "정지"}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                          {soundPlaying ? (
                            <button style={S.lightButton} onClick={stopSound}>
                              정지
                            </button>
                          ) : (
                            <button style={S.button} onClick={playSound}>
                              재생
                            </button>
                          )}
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 120px", gap: 8, marginTop: 10, alignItems: "center" }}>
                        <select
                          style={S.input}
                          value={soundType}
                          onChange={(e) => setSoundType(e.target.value)}
                        >
                          {SOUND_OPTIONS.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.label}
                            </option>
                          ))}
                        </select>

                        <div>
                          <div style={{ ...S.small, fontSize: 10, marginBottom: 3 }}>소리 {soundVolume}%</div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={soundVolume}
                            onChange={(e) => setSoundVolume(Number(e.target.value))}
                            style={{ width: "100%" }}
                          />
                        </div>
                      </div>

                      <p style={{ ...S.small, margin: "7px 0 0", lineHeight: 1.35 }}>
                        음원이 끝나면 자동으로 반복 재생됩니다.
                        {soundType === "airplane" && (
                          <span style={{ display: "block", marginTop: 3, color: "#f97316", fontWeight: 800 }}>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 12,
                  alignItems: "stretch",
                }}
              >
                <section style={{ minWidth: 0, display: "flex" }}>
                  {renderTodayPlannerCompact(todayRecords, todayTotal, today)}
                </section>

                
              </div>
            </main>

            <aside style={{ display: "grid", gap: 12 }}>
              <section style={{ ...S.card, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div>
                    <div style={{ ...S.small, fontWeight: 900 }}>내 정보</div>
                    <h2 style={{ margin: "2px 0", fontSize: 20 }}>{displayName}</h2>
                    <p style={{ ...S.small, margin: 0 }}>@{userId}</p>
                  </div>
                  <button style={S.lightButton} onClick={openProfile}>
                    수정
                  </button>
                </div>
              </section>

              <section style={{ ...S.card, padding: 16 }}>
                <div style={{ ...S.small, fontWeight: 900, color: "var(--accent)" }}>테마 색상</div>
                <h3 style={{ margin: "4px 0 10px", fontSize: 18 }}>
                  {currentTheme.label}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                  {Object.entries(THEME_COLORS).map(([key, theme]) => (
                    <button
                      key={key}
                      type="button"
                      title={theme.label}
                      onClick={() => changeTheme(key)}
                      style={{
                        position: "relative",
                        height: 34,
                        borderRadius: 14,
                        border: themeKey === key ? `2px solid ${theme.accent}` : "1px solid #e5e8eb",
                        background: theme.accent,
                        cursor: "pointer",
                        boxShadow: themeKey === key ? `0 0 0 4px ${theme.accentShadow}` : "none",
                      }}
                    >
                      <span style={{ position: "absolute", opacity: 0 }}>{theme.label}</span>
                    </button>
                  ))}
                </div>
                <p style={{ ...S.small, margin: "8px 0 0" }}>
                  빨강, 초록, 파랑, 보라, 검정 중 원하는 색으로 앱의 주요 색상을 바꿀 수 있습니다.
                </p>

                </section>

              <section
                style={{
                  background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)",
                  color: "white",
                  borderRadius: 28,
                  padding: "20px 18px",
                  boxShadow: "0 18px 42px var(--accent-shadow)",
                }}
              >
                <div style={{ fontSize: 12, opacity: 0.78, fontWeight: 900 }}>오늘 총 공부시간</div>
                <div style={{ fontSize: "clamp(44px, 5vw, 68px)", fontWeight: 950, lineHeight: 0.98, letterSpacing: -2, marginTop: 6 }}>
                  {formatTimer(todayTotalWithLive)}
                </div>
                <div style={{ fontSize: 12, opacity: 0.78, marginTop: 8 }}>
                  {studying ? "현재 진행 중인 순공시간 포함" : "오늘 저장된 기록 기준"}
                </div>
              </section>

              <section style={{ ...S.card, padding: 16 }}>
                <div style={{ ...S.small, fontWeight: 900, color: "var(--accent)" }}>오늘 할 일</div>
                <h3 style={{ margin: "4px 0 10px", fontSize: 18 }}>선택한 D-DAY</h3>
                {selectedDday ? (
                  <div style={{ background: "var(--app-bg)", borderRadius: 16, padding: 12 }}>
                    <b>{selectedDday.title}</b>
                    <div style={{ ...S.small, marginTop: 4 }}>
                      {formatDday(selectedDday.date)} · {selectedDday.category} · 중요도 {selectedDday.priority}
                    </div>
                  </div>
                ) : (
                  <p style={S.small}>D-DAY를 설정해두면 여기에서 바로 확인할 수 있습니다.</p>
                )}
              </section>

              {renderGroupRankCard()}

            </aside>
          </div>
        </div>

        {profileOpen && (
          <Modal title="나의 정보" onClose={() => setProfileOpen(false)}>
            <div style={S.grid2}>
              <div style={{ ...S.card, boxShadow: "none" }}>
                <p style={S.small}>아이디</p>
                <h3>{userId}</h3>
                <p style={S.small}>아이디는 수정할 수 없도록 설정했습니다.</p>
              </div>
              <div style={{ ...S.card, boxShadow: "none" }}>
                <p style={S.small}>표시 이름</p>
                <h3>{displayName}</h3>
              </div>
            </div>

            <Field label="표시 이름">
              <input
                style={S.input}
                value={profileForm.displayName}
                onChange={(e) =>
                  setProfileForm((p) => ({
                    ...p,
                    displayName: e.target.value.slice(0, 12),
                  }))
                }
              />
            </Field>

            <Field label="한 줄 소개">
              <input
                style={S.input}
                value={profileForm.bio}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, bio: e.target.value.slice(0, 40) }))
                }
              />
            </Field>

            <Field label="기본 공부 목표">
              <input
                style={S.input}
                value={profileForm.defaultGoal}
                onChange={(e) =>
                  setProfileForm((p) => ({
                    ...p,
                    defaultGoal: e.target.value.slice(0, 30),
                  }))
                }
              />
            </Field>

            <div style={{ ...S.card, boxShadow: "none" }}>
              <h3>비밀번호 변경</h3>
              <p style={S.small}>변경하지 않으려면 비워두세요.</p>
              <input
                style={{ ...S.input, marginBottom: 8 }}
                type="password"
                value={profileForm.newPw}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, newPw: normalizePw(e.target.value) }))
                }
                placeholder="새 비밀번호"
              />
              <input
                style={S.input}
                type="password"
                value={profileForm.newPw2}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, newPw2: normalizePw(e.target.value) }))
                }
                placeholder="새 비밀번호 다시 입력"
              />
            </div>

            {profileMsg && <p>{profileMsg}</p>}

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button style={S.button} onClick={saveProfile}>
                내 정보 저장
              </button>
              <button style={S.lightButton} onClick={logout}>
                로그아웃
              </button>
            </div>
          </Modal>
        )}
        
        {roomMenuOpen && (
          <Modal title="스터디 방 만들기 / 입장" onClose={() => setRoomMenuOpen(false)}>
            <div style={S.grid2}>
              <div style={{ ...S.card, boxShadow: "none" }}>
                <h3 style={{ marginTop: 0 }}>새 방 만들기</h3>
                <p style={S.small}>새 스터디 방을 만들고 친구에게 방 ID와 비밀번호를 알려줄 수 있습니다.</p>
                <button
                  style={{ ...S.button, width: "100%", marginTop: 8 }}
                  onClick={() => {
                    setRoomMenuOpen(false);
                    setCreateOpen(true);
                  }}
                >
                  방 만들기
                </button>
              </div>

              <div style={{ ...S.card, boxShadow: "none" }}>
                <h3 style={{ marginTop: 0 }}>방 ID로 입장</h3>
                <p style={S.small}>친구가 알려준 영어 8자 방 ID와 숫자 8개 비밀번호를 입력해 주세요.</p>

                <Field label="방 ID">
                  <input
                    style={S.input}
                    value={joinRoom.code}
                    onChange={(e) =>
                      setJoinRoom((p) => ({
                        ...p,
                        code: normalizeRoomCode(e.target.value),
                      }))
                    }
                    placeholder="예: STUDYABC"
                  />
                </Field>

                <Field label="비밀번호">
                  <input
                    style={S.input}
                    value={joinRoom.password}
                    onChange={(e) =>
                      setJoinRoom((p) => ({
                        ...p,
                        password: normalizeRoomPw(e.target.value),
                      }))
                    }
                    placeholder="숫자 8개"
                  />
                </Field>

                <button
                  style={{ ...S.button, width: "100%" }}
                  onClick={async () => {
                    await joinGroup();
                    setRoomMenuOpen(false);
                  }}
                >
                  방 입장하기
                </button>
              </div>
            </div>

            {groupMsg && (
              <div
                style={{
                  marginTop: 10,
                  background: "#dcfce7",
                  color: "#166534",
                  padding: 10,
                  borderRadius: 12,
                  fontSize: 12,
                }}
              >
                {groupMsg}
              </div>
            )}
          </Modal>
        )}

        {createOpen && (
          <Modal title="새 스터디 그룹 만들기" onClose={() => setCreateOpen(false)}>
            <p style={S.small}>모든 방은 비공개방으로 생성됩니다.</p>

            <Field label="방 이름">
              <input
                style={S.input}
                value={createRoom.name}
                onChange={(e) =>
                  setCreateRoom((p) => ({ ...p, name: e.target.value }))
                }
              />
            </Field>

            <Field label="방 설명">
              <input
                style={S.input}
                value={createRoom.description}
                onChange={(e) =>
                  setCreateRoom((p) => ({ ...p, description: e.target.value }))
                }
              />
            </Field>

            <Field label="방 목표">
              <input
                style={S.input}
                value={createRoom.goal}
                onChange={(e) =>
                  setCreateRoom((p) => ({ ...p, goal: e.target.value }))
                }
              />
            </Field>

            <div style={{ ...S.card, boxShadow: "none" }}>
              <h3>자동 생성 방 ID</h3>
              <div style={{ fontSize: 34, fontWeight: 900, fontFamily: "monospace" }}>
                {pendingCode || "--------"}
              </div>
              <button style={S.lightButton} onClick={generateRoomCode}>
                ID 생성 / 중복 확인
              </button>
              <p style={S.small}>{codeMsg || "영어 8자 방 ID를 생성해 주세요."}</p>

              <input
                style={S.input}
                value={createRoom.password}
                onChange={(e) =>
                  setCreateRoom((p) => ({
                    ...p,
                    password: normalizeRoomPw(e.target.value),
                  }))
                }
                placeholder="숫자 8개 비밀번호"
              />
            </div>

            <button style={{ ...S.button, width: "100%", marginTop: 12 }} onClick={createGroup}>
              스터디 그룹 만들기
            </button>
          </Modal>
        )}

        {ddayOpen && (
          <Modal title="D-DAY 설정" onClose={() => setDdayOpen(false)}>
            <div style={S.grid2}>
              <div>
                <h3>등록된 D-DAY</h3>
                {ddays.length ? (
                  ddays.map((d) => (
                    <div
                      key={d.id}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: 16,
                        padding: 12,
                        marginBottom: 10,
                      }}
                    >
                      <b>
                        {d.title} {formatDday(d.date)}
                      </b>
                      <p style={S.small}>
                        {d.date} · {d.category} · 중요도 {d.priority}
                      </p>
                      {d.memo && <p style={S.small}>{d.memo}</p>}
                      <button style={S.lightButton} onClick={() => openEditDday(d)}>
                        수정
                      </button>{" "}
                      <button
                        style={S.lightButton}
                        onClick={() => {
                          setSelectedDdayId(d.id);
                          setPlannerDdayId(d.id);
                        }}
                      >
                        대표 선택
                      </button>{" "}
                      <button style={S.lightButton} onClick={() => deleteDday(d.id)}>
                        삭제
                      </button>
                    </div>
                  ))
                ) : (
                  <p style={S.small}>아직 D-DAY가 없습니다.</p>
                )}
              </div>

              <div>
                <h3>{editingDdayId ? "목표 수정" : "새 목표 추가"}</h3>

                <Field label="목표 이름">
                  <input
                    style={S.input}
                    value={ddayForm.title}
                    onChange={(e) =>
                      setDdayForm((p) => ({ ...p, title: e.target.value }))
                    }
                  />
                </Field>

                <Field label="목표 날짜">
                  <input
                    style={S.input}
                    type="date"
                    value={ddayForm.date}
                    onChange={(e) =>
                      setDdayForm((p) => ({ ...p, date: e.target.value }))
                    }
                  />
                </Field>

                <Field label="분류">
                  <select
                    style={S.input}
                    value={ddayForm.category}
                    onChange={(e) =>
                      setDdayForm((p) => ({ ...p, category: e.target.value }))
                    }
                  >
                    <option>시험</option>
                    <option>모의고사</option>
                    <option>수행평가</option>
                    <option>발표</option>
                    <option>과제</option>
                    <option>기타</option>
                  </select>
                </Field>

                <Field label="중요도">
                  <select
                    style={S.input}
                    value={ddayForm.priority}
                    onChange={(e) =>
                      setDdayForm((p) => ({ ...p, priority: e.target.value }))
                    }
                  >
                    <option>낮음</option>
                    <option>보통</option>
                    <option>높음</option>
                  </select>
                </Field>

                <Field label="목표 메모">
                  <textarea
                    style={S.textarea}
                    value={ddayForm.memo}
                    onChange={(e) =>
                      setDdayForm((p) => ({ ...p, memo: e.target.value }))
                    }
                  />
                </Field>

                <button style={{ ...S.button, width: "100%" }} onClick={saveDday}>
                  {editingDdayId ? "수정 저장" : "새 D-DAY 추가"}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {plannerOpen && (
          <Modal title="나의 공부 달력 · 플래너" onClose={() => setPlannerOpen(false)}>
            <div style={S.grid2}>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <button style={S.lightButton} onClick={() => moveMonth(-1)}>
                    이전
                  </button>
                  <b>
                    {calendarMonth.getFullYear()}년 {calendarMonth.getMonth() + 1}월
                  </b>
                  <button style={S.lightButton} onClick={() => moveMonth(1)}>
                    다음
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: 6,
                    textAlign: "center",
                    fontSize: 12,
                    color: "#71717a",
                    marginBottom: 6,
                  }}
                >
                  {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
                  {getCalendarCells().map((date, idx) => {
                    const amount = date && recordDateMap[date];
                    const selected = date === plannerDate;

                    return (
                      <button
                        key={idx}
                        disabled={!date}
                        onClick={() => date && setPlannerDate(date)}
                        style={{
                          minHeight: 60,
                          border: "1px solid var(--border)",
                          borderRadius: 14,
                          background: selected ? "#18181b" : "white",
                          color: selected ? "white" : "#18181b",
                          opacity: date ? 1 : 0,
                          cursor: date ? "pointer" : "default",
                        }}
                      >
                        {date && (
                          <>
                            <b>{Number(date.split("-")[2])}</b>
                            {amount && <div style={{ fontSize: 10 }}>{formatStudy(amount)}</div>}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>{renderPlanner(plannerRecords, plannerTotal, plannerDate)}</div>
            </div>
          </Modal>
        )}

        {chatOpen && (
          <Modal title={currentGroup?.name || "채팅"} onClose={() => setChatOpen(false)}>
            {studying && (
              <div
                style={{
                  background: "#fef3c7",
                  color: "#92400e",
                  padding: 12,
                  borderRadius: 16,
                  marginBottom: 12,
                }}
              >
                순공 측정 중에는 채팅 내용을 볼 수 없습니다.
                {chatNotice && unread > 0 && <div>새 메시지 {unread}개 도착</div>}
              </div>
            )}

            <div
              style={{
                height: 360,
                overflowY: "auto",
                border: "1px solid var(--border)",
                borderRadius: 18,
                padding: 14,
                background: "#f9fafb",
              }}
            >
              {!studying &&
                messages.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      justifyContent: m.senderUid === uid ? "flex-end" : "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "75%",
                        background: m.senderUid === uid ? "#18181b" : "#e4e4e7",
                        color: m.senderUid === uid ? "white" : "#18181b",
                        padding: 12,
                        borderRadius: 18,
                        fontSize: 14,
                      }}
                    >
                      <div style={{ fontSize: 11, opacity: 0.7 }}>{m.senderName}</div>
                      {m.text}
                    </div>
                  </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input
                style={S.input}
                value={chatText}
                disabled={studying || !enteredGroupId}
                onChange={(e) => setChatText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={studying ? "순공 중에는 채팅할 수 없습니다" : "메시지를 입력해 주세요"}
              />
              <button style={S.button} disabled={studying} onClick={sendMessage}>
                전송
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}