import React, { useEffect, useMemo, useState } from "react";
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
  getFirestore,
  onSnapshot,
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const S = {
  page: {
  minHeight: "100vh",
  width: "100%",
  background: "#f4f4f5",
  color: "#18181b",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
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
  background: "#f4f4f5",
  borderRadius: 0,
  padding: "clamp(12px, 3vw, 24px)",
  boxSizing: "border-box",
  overflowX: "hidden",
},
  input: {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #d4d4d8",
  borderRadius: 16,
  padding: "12px 14px",
  fontSize: 14,
  outline: "none",
  background: "white",
  color: "#18181b",
  WebkitTextFillColor: "#18181b",
  caretColor: "#18181b",
},
  textarea: {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #d4d4d8",
  borderRadius: 16,
  padding: "12px 14px",
  fontSize: 14,
  outline: "none",
  minHeight: 90,
  resize: "vertical",
  background: "white",
  color: "#18181b",
  WebkitTextFillColor: "#18181b",
  caretColor: "#18181b",
},
  button: {
    border: "none",
    borderRadius: 16,
    padding: "12px 16px",
    fontWeight: 800,
    cursor: "pointer",
    background: "#18181b",
    color: "white",
  },
  lightButton: {
    border: "1px solid #d4d4d8",
    borderRadius: 16,
    padding: "12px 16px",
    fontWeight: 800,
    cursor: "pointer",
    background: "white",
    color: "#18181b",
  },
  small: { color: "#71717a", fontSize: 13 },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 800,
    color: "#3f3f46",
    marginBottom: 6,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 14,
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
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
    background: "white",
    borderRadius: 28,
    padding: 22,
  },
};

const todayString = () => {
  const d = new Date();
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
    <div style={{ marginBottom: 12 }}>
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
        paddingTop: 10,
        marginTop: 22,
        fontSize: 12,
        fontWeight: 900,
        letterSpacing: 1.5,
        color: "#52525b",
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const today = todayString();

  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [authMode, setAuthMode] = useState("login");
  const [authMsg, setAuthMsg] = useState("");
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
  const [createRoom, setCreateRoom] = useState({
    name: "",
    description: "",
    goal: "",
    password: "",
  });
  const [pendingCode, setPendingCode] = useState("");
  const [codeMsg, setCodeMsg] = useState("");
  const [joinRoom, setJoinRoom] = useState({ code: "", password: "" });

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
  const [detail, setDetail] = useState("영어 단어 Day 12 암기 + 예문 복습");

  const [studying, setStudying] = useState(false);
  const [totalSec, setTotalSec] = useState(0);
  const [sessionSec, setSessionSec] = useState(0);
  const [startedAt, setStartedAt] = useState(null);

  const [records, setRecords] = useState([]);
  const [groupRecords, setGroupRecords] = useState([]);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatNotice, setChatNotice] = useState(true);
  const [unread, setUnread] = useState(0);
  const [messages, setMessages] = useState([]);
  const [chatText, setChatText] = useState("");

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
      setGroups([]);
      return;
    }

    const unsub = onSnapshot(collection(db, "groups"), (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const mine = all.filter((g) => (g.memberUids || []).includes(uid));
      mine.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setGroups(mine);

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
    if (!studying) return;
    const timer = setInterval(() => {
      setTotalSec((v) => v + 1);
      setSessionSec((v) => v + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [studying]);

  useEffect(() => {
    if (!studying) return;
    const last = messages[messages.length - 1];
    if (last && last.senderUid !== uid) setUnread((v) => v + 1);
  }, [messages, studying, uid]);

  const selectedDday = ddays.find((d) => d.id === selectedDdayId) || null;
  const plannerDday = ddays.find((d) => d.id === plannerDdayId) || selectedDday;

  const todayRecords = records.filter((r) => r.date === today);
  const plannerRecords = records.filter((r) => r.date === plannerDate);
  const todayTotal = todayRecords.reduce((s, r) => s + (r.seconds || 0), 0);
  const plannerTotal = plannerRecords.reduce((s, r) => s + (r.seconds || 0), 0);

  const recordDateMap = useMemo(() => {
    const obj = {};
    records.forEach((r) => {
      obj[r.date] = (obj[r.date] || 0) + (r.seconds || 0);
    });
    return obj;
  }, [records]);

  const liveMembers = useMemo(() => {
    return members.map((m) => {
      if (m.uid !== uid) return m;
      return {
        ...m,
        displayName,
        subject,
        detail,
        studying,
        liveSeconds: totalSec,
      };
    });
  }, [members, uid, displayName, subject, detail, studying, totalSec]);

  const groupLiveTotal = liveMembers.reduce((s, m) => s + (m.liveSeconds || 0), 0);

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
      setIdCheck({ id: "", ok: false, msg: "아이디를 입력해줘." });
      return;
    }

    const snap = await getDoc(doc(db, "userIds", id));
    if (snap.exists()) {
      setIdCheck({ id, ok: false, msg: `${id}는 이미 사용 중이야.` });
    } else {
      setIdCheck({ id, ok: true, msg: `${id}는 사용할 수 있어.` });
    }
  };

  const doSignup = async () => {
    try {
      const id = normalizeId(signup.id);
      const pw = normalizePw(signup.pw);
      const pw2 = normalizePw(signup.pw2);

      if (!id) throw new Error("아이디를 입력해줘.");
      if (idCheck.id !== id || !idCheck.ok) throw new Error("아이디 중복 확인을 해줘.");
      if (!pw || !pw2) throw new Error("비밀번호를 두 번 입력해줘.");
      if (pw.length < 6) throw new Error("비밀번호는 최소 6글자 이상이어야 해.");
      if (pw !== pw2) throw new Error("비밀번호가 서로 달라.");

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
      setAuthMsg(e.message || "회원가입 중 오류가 생겼어.");
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
      setAuthMsg("아이디 또는 비밀번호가 맞지 않아.");
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
        throw new Error("새 비밀번호가 서로 달라.");
      }
      if (newPw) {
        if (newPw.length < 6) throw new Error("비밀번호는 최소 6글자 이상이어야 해.");
        await updatePassword(user, newPw);
      }

      await updateDoc(doc(db, "users", uid), {
        displayName: profileForm.displayName.trim() || userId,
        bio: profileForm.bio.trim(),
        defaultGoal: profileForm.defaultGoal.trim(),
        updatedAt: serverTimestamp(),
      });

      setProfileMsg("저장됐어.");
    } catch (e) {
      setProfileMsg(e.message || "저장 중 오류가 생겼어.");
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
        count > 1 ? `${count}번 확인했어.` : "한 번에 생성됐어."
      }`
    );
    return code;
  };

  const createGroup = async () => {
    try {
      const name = createRoom.name.trim();
      const description = createRoom.description.trim() || "새로 만든 스터디 그룹";
      const goal = createRoom.goal.trim() || "오늘 목표를 정해보자";
      const password = normalizeRoomPw(createRoom.password);

      if (!name) throw new Error("방 이름을 입력해줘.");
      if (!/^[0-9]{8}$/.test(password)) throw new Error("비밀번호는 숫자 8개여야 해.");

      const code = pendingCode || (await generateRoomCode());
      const codeSnap = await getDoc(doc(db, "roomCodes", code));
      if (codeSnap.exists()) throw new Error("방 ID가 이미 있어. 다시 생성해줘.");

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
        joinedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "groups", groupRef.id, "messages"), {
        senderUid: uid,
        senderName: displayName,
        text: "스터디 그룹을 만들었어.",
        createdAt: serverTimestamp(),
      });

      setSelectedGroupId(groupRef.id);
      setEnteredGroupId(groupRef.id);
      setCreateOpen(false);
      setPendingCode("");
      setCodeMsg("");
      setCreateRoom({ name: "", description: "", goal: "", password: "" });
      setGroupMsg(`방이 생성됐어. 방 ID는 ${code}야.`);
    } catch (e) {
      setGroupMsg(e.message || "방 생성 중 오류가 생겼어.");
    }
  };

  const joinGroup = async () => {
    try {
      const code = normalizeRoomCode(joinRoom.code);
      const password = normalizeRoomPw(joinRoom.password);

      if (!/^[A-Z]{8}$/.test(code)) throw new Error("방 ID는 영어 대문자 8자야.");
      if (!/^[0-9]{8}$/.test(password)) throw new Error("비밀번호는 숫자 8개야.");

      const codeSnap = await getDoc(doc(db, "roomCodes", code));
      if (!codeSnap.exists()) throw new Error("해당 방 ID를 찾을 수 없어.");

      const groupId = codeSnap.data().groupId;
      const groupSnap = await getDoc(doc(db, "groups", groupId));
      if (!groupSnap.exists()) throw new Error("방 정보를 찾을 수 없어.");

      const group = { id: groupId, ...groupSnap.data() };
      if (group.password !== password) throw new Error("방 ID 또는 비밀번호가 틀렸어.");

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
          joinedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setSelectedGroupId(groupId);
      setEnteredGroupId(groupId);
      setJoinRoom({ code: "", password: "" });
      setGroupMsg(`${group.name}에 입장했어.`);
    } catch (e) {
      setGroupMsg(e.message || "방 입장 중 오류가 생겼어.");
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
    if (!enteredGroupId || !subject || !detail.trim()) return;

    setStudying(true);
    setStartedAt(nowTime());
    setSessionSec(0);
    setUnread(0);

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
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  const stopStudy = async () => {
    const end = nowTime();

    if (sessionSec > 0) {
      await addDoc(collection(db, "studyRecords"), {
        ownerUid: uid,
        ownerUserId: userId,
        ownerName: displayName,
        date: today,
        subject,
        detail,
        seconds: sessionSec,
        start: startedAt || "시작 시간 없음",
        end,
        sharedToGroups: groups.map((g) => g.id),
        createdAt: serverTimestamp(),
      });
    }

    if (enteredGroupId) {
      await setDoc(
        doc(db, "groups", enteredGroupId, "members", uid),
        {
          studying: false,
          liveSeconds: 0,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    setStudying(false);
    setStartedAt(null);
    setSessionSec(0);
    setUnread(0);
    setPlannerDate(today);
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

  const renderPlanner = (list, total, date) => {
    return (
      <div style={S.card}>
        <div
          style={{
            background: "#15803d",
            color: "white",
            padding: 16,
            borderRadius: 18,
            marginBottom: 18,
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
                background: "#f4f4f5",
                border: "1px solid #e4e4e7",
                borderRadius: 16,
                padding: 12,
                minHeight: 60,
              }}
            >
              {list.length ? (
                list.map((r) => (
                  <div key={r.id} style={{ fontSize: 14, marginBottom: 8 }}>
                    <b>{r.subject}</b> · {r.detail}
                  </div>
                ))
              ) : (
                <span style={S.small}>기록된 공부 내용이 없어.</span>
              )}
            </div>

            <SectionTitle>TASK</SectionTitle>
            <div style={{ borderTop: "1px solid #e4e4e7" }}>
              {list.length ? (
                list.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "90px 1fr 80px",
                      gap: 8,
                      padding: "10px 0",
                      borderBottom: "1px solid #e4e4e7",
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
              placeholder="오늘 느낀 점, 내일 할 일, 오답 메모 등을 적어줘. 이 메모는 다른 사람에게 공유되지 않아."
            />
            <div style={S.small}>MEMO는 나만 보는 비공개 메모야.</div>
          </div>

          <div>
            <SectionTitle>TOTAL</SectionTitle>
            <h1>{formatStudy(total)}</h1>

            <SectionTitle>TIME TABLE</SectionTitle>
            <div style={S.small}>06:00부터 다음날 05:00까지 하루 흐름으로 표시돼.</div>

            <div style={{ marginTop: 10, borderTop: "1px solid #e4e4e7" }}>
              {timeTableHours.map((hour) => {
                const hourRecords = recordsByHour(hour, list);
                return (
                  <div
                    key={hour}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "60px 1fr",
                      minHeight: 38,
                      borderBottom: "1px solid #e4e4e7",
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
                            background: "#dcfce7",
                            border: "1px solid #bbf7d0",
                            color: "#166534",
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
    return <div style={S.page}>앱을 불러오는 중...</div>;
  }

  if (!user) {
    return (
      <div style={S.page}>
        <div style={{ maxWidth: 900, margin: "40px auto" }}>
          <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
            <div style={S.grid2}>
              <div style={{ background: "#18181b", color: "white", padding: 34 }}>
                <p style={{ color: "#a1a1aa" }}>Study Room</p>
                <h1 style={{ fontSize: 40, lineHeight: 1.1 }}>
                  친구와 공부하기 전, 먼저 로그인해줘.
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
                  <p>· Firebase 때문에 비밀번호는 최소 6글자</p>
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
                          ? "비밀번호가 일치해."
                          : "비밀번호가 일치하지 않아."}
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
    <div style={S.page}>
      <div style={S.wrap}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 18,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={S.small}>Firebase로 실시간 저장되는 스터디 웹앱</p>
            <h1 style={{ fontSize: 48, margin: "6px 0" }}>Study Room</h1>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <select
                style={{ ...S.input, width: 260 }}
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
              <button style={S.lightButton} onClick={openNewDday}>
                D-DAY 설정
              </button>
            </div>
          </div>

          <div style={{ minWidth: 260 }}>
            <div style={{ ...S.card, padding: 14, marginBottom: 8 }}>
              <b>{displayName}</b> <span style={S.small}>@{userId}</span>{" "}
              <button style={S.lightButton} onClick={openProfile}>
                내 정보
              </button>
            </div>
            <div style={{ ...S.card, padding: 14, marginBottom: 8 }}>
              현재 입장: <b>{currentGroup?.name || "없음"}</b>
            </div>
            <div style={{ ...S.card, padding: 14 }}>
              공부 중 채팅 알림{" "}
              <button style={S.lightButton} onClick={() => setChatNotice((v) => !v)}>
                {chatNotice ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        </header>

        <section style={{ ...S.card, marginBottom: 18 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <p style={S.small}>스터디 그룹 선택</p>
              <h2 style={{ marginTop: 0 }}>내 스터디 그룹</h2>
              <p style={S.small}>모든 방은 비공개방이야. 방 ID와 숫자 8개 비밀번호로 입장해.</p>
            </div>
            <button style={S.button} onClick={() => setCreateOpen(true)}>
              + 방 만들기
            </button>
          </div>

          {groups.length ? (
            <div style={S.grid3}>
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGroupId(g.id)}
                  style={{
                    textAlign: "left",
                    borderRadius: 20,
                    padding: 16,
                    cursor: "pointer",
                    border:
                      selectedGroupId === g.id
                        ? "1px solid #18181b"
                        : "1px solid #e4e4e7",
                    background: selectedGroupId === g.id ? "#18181b" : "white",
                    color: selectedGroupId === g.id ? "white" : "#18181b",
                  }}
                >
                  <b>{g.name}</b>
                  <p style={{ opacity: 0.75 }}>{g.description}</p>
                  <p>인원 {(g.memberUids || []).length}명 · {g.goal}</p>
                  <p>ID {g.roomCode} · {g.ownerUid === uid ? "방장" : "참여자"}</p>
                  {enteredGroupId === g.id && <b style={{ color: "#86efac" }}>입장 중</b>}
                </button>
              ))}
            </div>
          ) : (
            <p style={S.small}>아직 참여 중인 방이 없어. 방을 만들거나 입장해줘.</p>
          )}

          {selectedGroup && (
            <div style={{ marginTop: 14, background: "#f4f4f5", borderRadius: 18, padding: 14 }}>
              <b>{selectedGroup.name}</b>
              <p style={S.small}>방 ID: {selectedGroup.roomCode}</p>
              <button
                style={S.button}
                disabled={studying}
                onClick={() => setEnteredGroupId(selectedGroup.id)}
              >
                선택한 그룹 입장
              </button>
            </div>
          )}

          <div style={{ marginTop: 16, border: "1px solid #e4e4e7", borderRadius: 18, padding: 16 }}>
            <h3>비공개 방 입장</h3>
            <div style={S.grid2}>
              <input
                style={S.input}
                value={joinRoom.code}
                onChange={(e) =>
                  setJoinRoom((p) => ({ ...p, code: normalizeRoomCode(e.target.value) }))
                }
                placeholder="영어 8자 방 ID"
              />
              <input
                style={S.input}
                value={joinRoom.password}
                onChange={(e) =>
                  setJoinRoom((p) => ({
                    ...p,
                    password: normalizeRoomPw(e.target.value),
                  }))
                }
                placeholder="숫자 8개 비밀번호"
              />
            </div>
            <button style={{ ...S.lightButton, marginTop: 10 }} onClick={joinGroup}>
              방 ID로 입장
            </button>
          </div>

          {groupMsg && (
            <div
              style={{
                marginTop: 14,
                background: "#dcfce7",
                color: "#166534",
                padding: 12,
                borderRadius: 14,
              }}
            >
              {groupMsg}
            </div>
          )}
        </section>

        <main className="app-main">
          <section style={S.card}>
            <h2>공부 설정</h2>
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

              <Field label="리스트에 없는 과목 추가">
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    style={S.input}
                    value={newSubject}
                    disabled={studying}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="예: 미적분"
                  />
                  <button style={S.lightButton} onClick={addSubject}>
                    추가
                  </button>
                </div>
              </Field>
            </div>

            <Field label="자세한 공부 내용">
              <textarea
                style={S.textarea}
                value={detail}
                disabled={studying}
                onChange={(e) => setDetail(e.target.value)}
              />
            </Field>

            <div style={{ background: "#f4f4f5", borderRadius: 18, padding: 14 }}>
              <p style={S.small}>현재 그룹 친구에게 표시되는 내용</p>
              <b>{subject} · {detail}</b>
              <p style={S.small}>공부 종료 후 개인 기록으로 저장되고, 참여 중인 방들에 공유돼.</p>
            </div>

            <div style={{ border: "1px solid #e4e4e7", borderRadius: 24, padding: 22, marginTop: 16 }}>
              <p style={S.small}>나의 오늘 순공시간</p>
              <div style={{ fontSize: 60, fontWeight: 900 }}>{formatTimer(totalSec)}</div>
              <p style={S.small}>
                {studying
                  ? `${startedAt}부터 측정 중 · ${subject}`
                  : totalSec > 0
                  ? "측정이 일시 정지되어 있어."
                  : "아직 측정을 시작하지 않았어."}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {studying ? (
                  <button style={S.button} onClick={stopStudy}>
                    공부 종료
                  </button>
                ) : (
                  <button style={S.button} disabled={!enteredGroupId} onClick={startStudy}>
                    순공 시작
                  </button>
                )}
                <button
                  style={S.lightButton}
                  disabled={studying}
                  onClick={() => setTotalSec(0)}
                >
                  초기화
                </button>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>{renderPlanner(todayRecords, todayTotal, today)}</div>
          </section>

          <aside style={S.card}>
            <h2>그룹원 현황 · 기록</h2>
            <p style={S.small}>그룹 현재 순공 합계: {formatTimer(groupLiveTotal)}</p>

            {liveMembers.length ? (
              liveMembers.map((m) => {
                const memberRecords = groupRecords.filter(
                  (r) =>
                    r.ownerUid === m.uid &&
                    (r.sharedToGroups || []).includes(enteredGroupId)
                );
                const sum = memberRecords.reduce((a, r) => a + (r.seconds || 0), 0);

                return (
                  <div
                    key={m.uid}
                    style={{
                      border: "1px solid #e4e4e7",
                      borderRadius: 18,
                      padding: 14,
                      marginBottom: 12,
                    }}
                  >
                    <b>{m.displayName || m.userId}</b>
                    <p style={S.small}>{m.role || "참여자"} · {m.studying ? "공부 중" : "휴식"}</p>
                    <p>
                      <b>{m.subject || "과목 없음"}</b>
                      <br />
                      <span style={S.small}>{m.detail || "공부 내용 없음"}</span>
                    </p>
                    <h2>{formatTimer(m.liveSeconds || 0)}</h2>
                    <div style={{ background: "#f4f4f5", borderRadius: 14, padding: 10 }}>
                      <p style={S.small}>공유된 누적 기록</p>
                      <b>{formatStudy(sum)}</b>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={S.small}>아직 그룹원이 없어.</p>
            )}
          </aside>
        </main>

        <button
          style={{
            position: "fixed",
            right: 22,
            bottom: 100,
            width: 62,
            height: 62,
            borderRadius: "50%",
            border: "none",
            background: "#15803d",
            color: "white",
            fontWeight: 900,
            cursor: "pointer",
          }}
          onClick={() => setPlannerOpen(true)}
        >
          달력
        </button>

        <button
          style={{
            position: "fixed",
            right: 22,
            bottom: 26,
            width: 62,
            height: 62,
            borderRadius: "50%",
            border: "none",
            background: "#18181b",
            color: "white",
            fontWeight: 900,
            cursor: "pointer",
          }}
          onClick={() => setChatOpen(true)}
        >
          채팅
          {unread > 0 && chatNotice && (
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                background: "#f59e0b",
                color: "white",
                borderRadius: "50%",
                width: 24,
                height: 24,
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {unread}
            </span>
          )}
        </button>

        {profileOpen && (
          <Modal title="나의 정보" onClose={() => setProfileOpen(false)}>
            <div style={S.grid2}>
              <div style={{ ...S.card, boxShadow: "none" }}>
                <p style={S.small}>아이디</p>
                <h3>{userId}</h3>
                <p style={S.small}>아이디는 수정하지 않게 했어.</p>
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
              <p style={S.small}>바꾸지 않으려면 비워둬.</p>
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

        {createOpen && (
          <Modal title="새 스터디 그룹 만들기" onClose={() => setCreateOpen(false)}>
            <p style={S.small}>모든 방은 비공개방으로 생성돼.</p>

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
              <p style={S.small}>{codeMsg || "영어 8자 방 ID를 생성해줘."}</p>

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
                        border: "1px solid #e4e4e7",
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
                  <p style={S.small}>아직 D-DAY가 없어.</p>
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
                          border: "1px solid #e4e4e7",
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
                순공 측정 중에는 채팅 내용을 볼 수 없어.
                {chatNotice && unread > 0 && <div>새 메시지 {unread}개 도착</div>}
              </div>
            )}

            <div
              style={{
                height: 360,
                overflowY: "auto",
                border: "1px solid #e4e4e7",
                borderRadius: 18,
                padding: 14,
                background: "#fafafa",
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
                placeholder={studying ? "순공 중에는 채팅할 수 없어" : "메시지를 입력해줘"}
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